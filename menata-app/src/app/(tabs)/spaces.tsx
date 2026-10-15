import { Alert, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { listAccounts, listHabitsForDay, monthTotals } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { monthKey, rupiah, today } from '../../lib/format';
import { Card, IconTile, Screen, T } from '../../components/UI';
import { Icon, type IconName } from '../../components/Icon';
import { colors, type Pastel } from '../../theme';

type Space = {
  key: string;
  name: string;
  blurb: string;
  icon: IconName;
  tone: Pastel;
  href?: Href;
};

const SPACES: Space[] = [
  { key: 'wellness', name: 'Wellness', blurb: 'Habits, water, mood & journal', icon: 'leaf', tone: 'mint', href: '/wellness' },
  { key: 'finance', name: 'Finance', blurb: 'Accounts, spending & budgets', icon: 'wallet', tone: 'sky', href: '/finance' },
  { key: 'travel', name: 'Travel', blurb: 'Trips, bookings & packing', icon: 'plane', tone: 'peach' },
  { key: 'event', name: 'Event Planner', blurb: 'Guests, budget & run of show', icon: 'gift', tone: 'rose' },
  { key: 'education', name: 'Education', blurb: 'Courses, focus & flashcards', icon: 'cap', tone: 'lilac' },
  { key: 'home', name: 'Home & Assets', blurb: 'Vehicles, chores & documents', icon: 'house', tone: 'butter' },
];

export default function Spaces() {
  const { data } = useQuery(async (db) => {
    const t = today();
    const [habits, accounts, totals] = await Promise.all([
      listHabitsForDay(db, t),
      listAccounts(db),
      monthTotals(db, monthKey(t)),
    ]);
    return {
      wellness: habits.length
        ? `${habits.filter((h) => h.count >= h.target).length} of ${habits.length} habits done today`
        : 'No habits yet',
      finance: accounts.length
        ? `${rupiah(accounts.reduce((s, a) => s + a.balance, 0))} across ${accounts.length} accounts`
        : `Spent ${rupiah(totals.expense)} this month`,
    } as Record<string, string>;
  });

  return (
    <Screen padBottom={24}>
      <View style={{ marginTop: 12, gap: 4, marginBottom: 6 }}>
        <T v="eyebrow">One account, six spaces</T>
        <T v="display">Your spaces</T>
      </View>

      {SPACES.map((s) => {
        const live = !!s.href;
        return (
          <Card
            key={s.key}
            tone={live ? s.tone : 'paper'}
            accessibilityLabel={s.name}
            onPress={() =>
              s.href
                ? router.push(s.href)
                : Alert.alert(`${s.name} is coming next`, 'This test build covers Wellness, Finance and the Planner first.')
            }
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <IconTile icon={s.icon} tone={live ? 'chip' : s.tone} size={52} />
              <View style={{ flex: 1, gap: 2 }}>
                <T v="heading">{s.name}</T>
                <T v="caption" color={colors.ink2}>
                  {live ? data?.[s.key] ?? s.blurb : s.blurb}
                </T>
              </View>
              {live ? (
                <Icon name="chevronRight" size={20} />
              ) : (
                <View style={{ backgroundColor: colors.chip, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <T v="caption">Soon</T>
                </View>
              )}
            </View>
          </Card>
        );
      })}

      <Card onPress={() => router.push('/planner')} accessibilityLabel="Planner">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <IconTile icon="list" tone="chip" size={52} />
          <View style={{ flex: 1, gap: 2 }}>
            <T v="heading">Planner</T>
            <T v="caption">Everything you plan, across every space</T>
          </View>
          <Icon name="chevronRight" size={20} />
        </View>
      </Card>
    </Screen>
  );
}
