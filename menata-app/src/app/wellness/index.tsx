import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import {
  getWater,
  latestCheckIn,
  listHabitsForDay,
  listJournal,
  listWaterWeek,
  setWater,
  tapHabit,
} from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { addDays, fromDateStr, relativeDay, today } from '../../lib/format';
import {
  Button,
  Card,
  DateStepper,
  Empty,
  Header,
  IconButton,
  Row,
  Screen,
  SectionHeader,
  T,
} from '../../components/UI';
import { HabitItem } from '../../components/Items';
import { Icon } from '../../components/Icon';
import { MOOD_LABELS, MoodFace } from '../../components/MoodFace';
import { colors } from '../../theme';

const DAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function WellnessHub() {
  const [date, setDate] = useState(today());
  const { data, reload, db } = useQuery(
    async (db) => {
      const [habits, water, week, checkIn, journal] = await Promise.all([
        listHabitsForDay(db, date),
        getWater(db, date),
        listWaterWeek(db, date),
        latestCheckIn(db, date),
        listJournal(db),
      ]);
      return { habits, water, week, checkIn, journal: journal.slice(0, 2) };
    },
    [date],
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - 6));
  const byDate = new Map(data?.week.map((w) => [w.date, w.glasses]));

  return (
    <Screen
      header={
        <Header
          eyebrow="Space"
          title="Wellness"
          right={<IconButton icon="sliders" label="Manage habits" onPress={() => router.push('/wellness/habits')} />}
        />
      }
    >
      <DateStepper value={date} onChange={setDate} />

      <SectionHeader
        title="Habits"
        action="Add"
        onAction={() => router.push({ pathname: '/wellness/habit-form/[id]', params: { id: 'new' } })}
      />
      {data && data.habits.length === 0 ? (
        <Empty
          icon="leaf"
          title="Nothing scheduled"
          text="No habits are set for this day. Small and steady beats big and rare."
          action="Add a habit"
          onAction={() => router.push({ pathname: '/wellness/habit-form/[id]', params: { id: 'new' } })}
        />
      ) : (
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {data?.habits.map((h) => (
            <HabitItem
              key={h.id}
              habit={h}
              onTap={async () => {
                await tapHabit(db, h, date);
                reload();
              }}
            />
          ))}
        </Card>
      )}

      <SectionHeader title="Water" />
      <Card tone="sky">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <T v="title">
              {data?.water.glasses ?? 0}
              <T v="caption"> of {data?.water.goal ?? 8} glasses</T>
            </T>
            <T v="caption">One glass ≈ 250 ml</T>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton
              icon="minus"
              label="Remove a glass"
              onPress={async () => {
                await setWater(db, date, (data?.water.glasses ?? 0) - 1);
                reload();
              }}
            />
            <IconButton
              icon="plus"
              label="Add a glass"
              tone="navy"
              onPress={async () => {
                await setWater(db, date, (data?.water.glasses ?? 0) + 1);
                reload();
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 90 }}>
          {weekDays.map((d) => {
            const g = byDate.get(d) ?? 0;
            const goal = data?.water.goal ?? 8;
            return (
              <View key={d} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <View
                  style={{
                    width: '100%',
                    height: Math.max(4, Math.min(1, g / goal) * 64),
                    borderRadius: 6,
                    backgroundColor: g >= goal ? colors.navy : 'rgba(4,39,81,0.25)',
                  }}
                />
                <T v="caption" style={{ fontSize: 11 }} color={d === date ? colors.navy : colors.ink2}>
                  {DAY_LETTER[fromDateStr(d).getDay()]}
                </T>
              </View>
            );
          })}
        </View>
      </Card>

      <SectionHeader title="Mind" action="History" onAction={() => router.push('/wellness/mind')} />
      <Card tone="lilac" onPress={() => router.push('/wellness/check-in')} accessibilityLabel="Check in">
        {data?.checkIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <MoodFace level={data.checkIn.mood} size={52} />
            <View style={{ flex: 1, gap: 2 }}>
              <T v="heading">Feeling {MOOD_LABELS[data.checkIn.mood - 1].toLowerCase()}</T>
              <T v="caption">
                Stress {data.checkIn.stress}/5 · Energy {data.checkIn.energy}/5 · {data.checkIn.time}
              </T>
            </View>
            <Icon name="plus" />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <MoodFace level={3} size={52} />
            <View style={{ flex: 1, gap: 2 }}>
              <T v="heading">How are you feeling?</T>
              <T v="caption">Mood, stress and energy in 20 seconds</T>
            </View>
            <Icon name="chevronRight" />
          </View>
        )}
      </Card>

      <SectionHeader title="Journal" action="All entries" onAction={() => router.push('/wellness/journal')} />
      <Card style={{ gap: 2, paddingVertical: 10 }}>
        {data?.journal.map((j) => (
          <Row
            key={j.id}
            icon="note"
            tone="peach"
            title={j.title || j.body.slice(0, 40)}
            subtitle={`${relativeDay(j.date)} · ${j.body.slice(0, 60)}`}
            onPress={() => router.push({ pathname: '/wellness/journal/[id]', params: { id: String(j.id) } })}
          />
        ))}
        <Button
          title="Write a few lines"
          kind="ghost"
          icon="edit"
          onPress={() => router.push({ pathname: '/wellness/journal/[id]', params: { id: 'new' } })}
        />
      </Card>
    </Screen>
  );
}
