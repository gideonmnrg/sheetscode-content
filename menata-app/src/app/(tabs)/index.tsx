import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import {
  getProfile,
  getWater,
  latestCheckIn,
  listBudgets,
  listHabitsForDay,
  listOverdue,
  listPlannerOn,
  monthTotals,
  setPlannerDone,
  setWater,
  tapHabit,
} from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { dayLabel, greeting, monthKey, rupiah, today } from '../../lib/format';
import { Button, Card, Empty, IconButton, Loading, ProgressBar, Ring, Screen, SectionHeader, T } from '../../components/UI';
import { HabitItem, PlannerRow } from '../../components/Items';
import { Icon } from '../../components/Icon';
import { MOOD_LABELS, MoodFace } from '../../components/MoodFace';
import { colors } from '../../theme';

export default function Today() {
  const date = today();
  const { data, reload, db } = useQuery(async (db) => {
    const month = monthKey(date);
    const [profile, habits, water, checkIn, plan, overdue, totals, budgets] = await Promise.all([
      getProfile(db),
      listHabitsForDay(db, date),
      getWater(db, date),
      latestCheckIn(db, date),
      listPlannerOn(db, date),
      listOverdue(db, date),
      monthTotals(db, month),
      listBudgets(db, month),
    ]);
    const budgetTotal = budgets.reduce((s, b) => s + (b.monthly_limit ?? 0), 0);
    return { profile, habits, water, checkIn, plan, overdue, totals, budgetTotal };
  });

  if (!data) return <Screen><Loading /></Screen>;

  const { profile, habits, water, checkIn, plan, overdue, totals, budgetTotal } = data;
  const doneHabits = habits.filter((h) => h.count >= h.target).length;
  const donePlan = plan.filter((p) => p.done).length;
  const total = habits.length + plan.length;
  const done = doneHabits + donePlan;
  const firstName = profile?.name.split(' ')[0] ?? 'there';

  return (
    <Screen padBottom={24}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <T v="eyebrow">{dayLabel(date)}</T>
          <T v="display">
            {greeting()},{'\n'}
            {firstName}
          </T>
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          accessibilityRole="button"
          accessibilityLabel="Profile and settings"
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.navy,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <T v="label" color={colors.paper} style={{ fontSize: 18 }}>
            {firstName.charAt(0).toUpperCase()}
          </T>
        </Pressable>
      </View>

      <Card tone="navy" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
        <Ring value={total ? done / total : 0} size={72} color={colors.teal} track="rgba(255,252,246,0.16)">
          <T v="label" color={colors.paper}>
            {done}/{total}
          </T>
        </Ring>
        <View style={{ flex: 1, gap: 4 }}>
          <T v="heading" color={colors.paper}>
            {total === 0 ? 'A quiet day' : done === total ? 'All done for today' : 'Small things for today'}
          </T>
          <T v="caption" color={colors.tealSoft}>
            {total === 0
              ? 'Add a habit or a plan to get started.'
              : done === total
                ? 'That’s everything. Enjoy the rest of your day.'
                : `${total - done} left · one at a time is fine.`}
          </T>
        </View>
      </Card>

      {overdue.length > 0 ? (
        <Card tone="peach" onPress={() => router.push('/planner')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Icon name="clock" />
            <T v="label" style={{ flex: 1 }}>
              {overdue.length} {overdue.length === 1 ? 'thing' : 'things'} from earlier still open
            </T>
            <Icon name="chevronRight" size={20} />
          </View>
        </Card>
      ) : null}

      <SectionHeader title="Habits" action="Manage" onAction={() => router.push('/wellness/habits')} />
      {habits.length === 0 ? (
        <Empty
          icon="leaf"
          title="No habits for today"
          text="Start with one small thing you’d like to do most days."
          action="Add a habit"
          onAction={() => router.push({ pathname: '/wellness/habit-form/[id]', params: { id: 'new' } })}
        />
      ) : (
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {habits.map((h) => (
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

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Card tone="sky" style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="drop" size={20} />
            <T v="label">Water</T>
          </View>
          <T v="title">
            {water.glasses}
            <T v="caption"> / {water.goal} glasses</T>
          </T>
          <ProgressBar value={water.glasses / water.goal} color={colors.navy} track="rgba(4,39,81,0.12)" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton
              icon="minus"
              label="Remove a glass"
              onPress={async () => {
                await setWater(db, date, water.glasses - 1);
                reload();
              }}
            />
            <IconButton
              icon="plus"
              label="Add a glass"
              tone="navy"
              onPress={async () => {
                await setWater(db, date, water.glasses + 1);
                reload();
              }}
            />
          </View>
        </Card>

        <Card tone="lilac" style={{ flex: 1 }} onPress={() => router.push('/wellness/check-in')} accessibilityLabel="Check in">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="face" size={20} />
            <T v="label">Mood</T>
          </View>
          {checkIn ? (
            <>
              <MoodFace level={checkIn.mood} size={44} />
              <T v="label">{MOOD_LABELS[checkIn.mood - 1]}</T>
              <T v="caption">at {checkIn.time} · tap to update</T>
            </>
          ) : (
            <>
              <T v="heading">How are you feeling?</T>
              <T v="caption">A 20-second check-in</T>
            </>
          )}
        </Card>
      </View>

      <SectionHeader title="Planner" action="See all" onAction={() => router.push('/planner')} />
      {plan.length === 0 ? (
        <Card>
          <T v="body" color={colors.ink2}>
            Nothing planned for today.
          </T>
          <Button
            title="Plan something"
            kind="secondary"
            icon="plus"
            onPress={() => router.push({ pathname: '/planner/[id]', params: { id: 'new', date } })}
          />
        </Card>
      ) : (
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {plan.map((p) => (
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
      )}

      <SectionHeader title="Money this month" action="Finance" onAction={() => router.push('/finance')} />
      <Card onPress={() => router.push('/finance')} accessibilityLabel="Open Finance">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <T v="caption">Spent</T>
            <T v="heading">{rupiah(totals.expense)}</T>
          </View>
          <View style={{ gap: 2, alignItems: 'flex-end' }}>
            <T v="caption">Came in</T>
            <T v="heading" color={colors.teal}>
              {rupiah(totals.income)}
            </T>
          </View>
        </View>
        {budgetTotal > 0 ? (
          <>
            <ProgressBar value={totals.expense / budgetTotal} color={colors.navy} />
            <T v="caption">
              {Math.round((totals.expense / budgetTotal) * 100)}% of your {rupiah(budgetTotal)} budget
            </T>
          </>
        ) : null}
      </Card>
    </Screen>
  );
}
