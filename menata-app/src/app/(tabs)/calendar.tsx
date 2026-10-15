import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { listPlannerOn, plannerDaysInMonth, setPlannerDone } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { dayLabel, fromDateStr, monthKey, monthLabel, shiftMonth, today } from '../../lib/format';
import { Button, Card, IconButton, Screen, SectionHeader, T } from '../../components/UI';
import { PlannerRow } from '../../components/Items';
import { colors, fonts } from '../../theme';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function monthGrid(month: string): (string | null)[] {
  const first = fromDateStr(`${month}-01`);
  const lead = (first.getDay() + 6) % 7; // Monday-first weeks
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${month}-${String(d).padStart(2, '0')}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export default function Calendar() {
  const t = today();
  const [month, setMonth] = useState(monthKey(t));
  const [selected, setSelected] = useState(t);

  const { data, reload, db } = useQuery(
    async (db) => ({
      days: await plannerDaysInMonth(db, month),
      items: await listPlannerOn(db, selected),
    }),
    [month, selected],
  );

  const cells = monthGrid(month);

  return (
    <Screen padBottom={24}>
      <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T v="display">Calendar</T>
        <Button title="Planner" kind="secondary" icon="list" onPress={() => router.push('/planner')} />
      </View>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton icon="chevronLeft" label="Previous month" tone="chip" onPress={() => setMonth(shiftMonth(month, -1))} />
          <T v="heading">{monthLabel(month)}</T>
          <IconButton icon="chevronRight" label="Next month" tone="chip" onPress={() => setMonth(shiftMonth(month, 1))} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          {WEEKDAYS.map((w, i) => (
            <T key={i} v="eyebrow" style={{ flex: 1, textAlign: 'center' }}>
              {w}
            </T>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {cells.map((d, i) => {
            if (!d) return <View key={i} style={{ width: `${100 / 7}%`, height: 46 }} />;
            const info = data?.days.get(d);
            const isSel = d === selected;
            const isToday = d === t;
            return (
              <Pressable
                key={i}
                onPress={() => setSelected(d)}
                accessibilityRole="button"
                accessibilityLabel={`${dayLabel(d)}${info ? `, ${info.total} planned` : ''}`}
                accessibilityState={{ selected: isSel }}
                style={{ width: `${100 / 7}%`, height: 46, alignItems: 'center', justifyContent: 'center' }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSel ? colors.navy : isToday ? colors.mint : 'transparent',
                  }}
                >
                  <T
                    v="label"
                    color={isSel ? colors.paper : colors.ink}
                    style={{ fontFamily: isToday || isSel ? fonts.heavy : fonts.body }}
                  >
                    {Number(d.slice(8))}
                  </T>
                  {info ? (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        width: 5,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: info.open > 0 ? colors.teal : isSel ? colors.tealSoft : colors.line,
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionHeader
        title={selected === t ? 'Today' : dayLabel(selected)}
        action="Add"
        onAction={() => router.push({ pathname: '/planner/[id]', params: { id: 'new', date: selected } })}
      />
      {data && data.items.length > 0 ? (
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {data.items.map((p) => (
            <PlannerRow
              key={p.id}
              item={p}
              onToggle={async () => {
                await setPlannerDone(db, p.id, !p.done);
                reload();
              }}
            />
          ))}
        </Card>
      ) : (
        <Card>
          <T v="body" color={colors.ink2}>
            Nothing planned. A free day is a plan too.
          </T>
        </Card>
      )}
    </Screen>
  );
}
