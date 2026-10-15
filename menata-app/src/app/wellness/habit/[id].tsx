import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { deleteHabit, getHabit, getHabitHistory, setHabitCount, setHabitFlag } from '../../../db/queries';
import { useQuery } from '../../../lib/useQuery';
import { dayLabel, fromDateStr } from '../../../lib/format';
import { describeDays } from '../../../lib/habits';
import {
  Button,
  Card,
  confirmDestructive,
  Header,
  IconButton,
  IconTile,
  Loading,
  Screen,
  SectionHeader,
  T,
} from '../../../components/UI';
import { Icon } from '../../../components/Icon';
import { colors } from '../../../theme';
import { goBack } from '../../../lib/nav';

const DAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Number(id);
  const { data, reload, db } = useQuery(
    async (db) => {
      const habit = await getHabit(db, habitId);
      return { habit, history: habit ? await getHabitHistory(db, habit) : null };
    },
    [habitId],
  );

  if (!data) return <Screen header={<Header />}><Loading /></Screen>;
  const { habit, history } = data;
  if (!habit || !history) {
    return (
      <Screen header={<Header title="Habit" />}>
        <Card>
          <T v="body">This habit no longer exists.</T>
        </Card>
      </Screen>
    );
  }

  const rate = history.scheduledLast30 ? Math.round((history.doneLast30 / history.scheduledLast30) * 100) : 0;

  return (
    <Screen
      header={
        <Header
          title={habit.name}
          right={
            <IconButton
              icon="edit"
              label="Edit habit"
              onPress={() => router.push({ pathname: '/wellness/habit-form/[id]', params: { id: String(habit.id) } })}
            />
          }
        />
      }
    >
      <Card tone={habit.area}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <IconTile icon={habit.icon} tone="chip" size={56} />
          <View style={{ flex: 1, gap: 2 }}>
            <T v="heading">{habit.name}</T>
            <T v="caption" color={colors.ink}>
              {describeDays(habit.days)}
              {habit.target > 1 ? ` · ${habit.target}× a day` : ''}
              {habit.paused ? ' · Paused' : ''}
              {habit.archived ? ' · Archived' : ''}
            </T>
          </View>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Card style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="flame" size={22} />
            <T v="caption">Streak</T>
          </View>
          <T v="title">{history.streak}</T>
          <T v="caption">{history.streak === 1 ? 'day' : 'days'}</T>
        </Card>
        <Card style={{ flex: 1 }}>
          <T v="caption">Best</T>
          <T v="title">{history.best}</T>
          <T v="caption">days in a row</T>
        </Card>
        <Card style={{ flex: 1 }}>
          <T v="caption">30 days</T>
          <T v="title">{rate}%</T>
          <T v="caption">
            {history.doneLast30}/{history.scheduledLast30} done
          </T>
        </Card>
      </View>

      <SectionHeader title="Last 7 days" />
      <Card>
        <T v="caption">Missed a day? Tap it to fix the record.</T>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {history.last7.map((d) => {
            const done = d.count >= habit.target;
            return (
              <Pressable
                key={d.date}
                disabled={!d.scheduled}
                onPress={async () => {
                  await setHabitCount(db, habit.id, d.date, done ? 0 : habit.target);
                  reload();
                }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: done, disabled: !d.scheduled }}
                accessibilityLabel={`${dayLabel(d.date)}${d.scheduled ? '' : ', not scheduled'}`}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: done ? colors.teal : d.scheduled ? colors.chip : 'transparent',
                    borderWidth: d.scheduled ? 0 : 1,
                    borderColor: colors.lineSoft,
                  }}
                >
                  {done ? <Icon name="check" size={18} color={colors.navy} strokeWidth={2.4} /> : null}
                </View>
                <T v="caption" style={{ fontSize: 12 }}>
                  {DAY_LETTER[fromDateStr(d.date).getDay()]}
                </T>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionHeader title="Options" />
      {!habit.archived ? (
        <Button
          title={habit.paused ? 'Resume habit' : 'Pause habit'}
          kind="secondary"
          icon={habit.paused ? 'play' : 'pause'}
          onPress={async () => {
            await setHabitFlag(db, habit.id, 'paused', !habit.paused);
            reload();
          }}
        />
      ) : null}
      <Button
        title={habit.archived ? 'Restore habit' : 'Archive habit'}
        kind="secondary"
        icon="archive"
        onPress={async () => {
          await setHabitFlag(db, habit.id, 'archived', !habit.archived);
          reload();
        }}
      />
      <Button
        title="Delete habit"
        kind="danger"
        icon="trash"
        onPress={() =>
          confirmDestructive(
            'Delete this habit?',
            'Its history goes too. Archive it instead if you might want it back.',
            'Delete',
            async () => {
              await deleteHabit(db, habit.id);
              goBack();
            },
          )
        }
      />
    </Screen>
  );
}
