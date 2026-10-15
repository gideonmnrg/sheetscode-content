import { View } from 'react-native';
import { router, type Href } from 'expo-router';
import {
  getWater,
  latestCheckIn,
  listBudgets,
  listHabitsForDay,
  listOverdue,
  listPlannerRange,
} from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { addDays, monthKey, relativeDay, rupiah, today } from '../../lib/format';
import { Card, Empty, Row, Screen, SectionHeader, T } from '../../components/UI';
import { Icon, type IconName } from '../../components/Icon';
import { SPACE_META } from '../../components/Items';
import { colors, type Pastel } from '../../theme';

type Notice = { key: string; icon: IconName; tone: Pastel | 'chip'; title: string; subtitle: string; href: Href };

// The inbox is worked out from what's in the database right now, so it's never stale.
export default function Inbox() {
  const { data } = useQuery(async (db) => {
    const t = today();
    const [overdue, upcoming, habits, water, checkIn, budgets] = await Promise.all([
      listOverdue(db, t),
      listPlannerRange(db, t, addDays(t, 3)),
      listHabitsForDay(db, t),
      getWater(db, t),
      latestCheckIn(db, t),
      listBudgets(db, monthKey(t)),
    ]);

    const now: Notice[] = [];
    const soon: Notice[] = [];

    for (const p of overdue) {
      const rd = relativeDay(p.date);
      now.push({
        key: `o${p.id}`,
        icon: 'clock',
        tone: 'peach',
        title: p.title,
        subtitle: `From ${rd === 'Yesterday' ? 'yesterday' : rd} · still open`,
        href: { pathname: '/planner/[id]', params: { id: String(p.id) } },
      });
    }
    for (const p of upcoming.filter((p) => !p.done)) {
      const meta = SPACE_META[p.space];
      (p.date === t ? now : soon).push({
        key: `u${p.id}`,
        icon: meta.icon,
        tone: meta.tone,
        title: p.title,
        subtitle: [relativeDay(p.date), p.time, meta.label].filter(Boolean).join(' · '),
        href: { pathname: '/planner/[id]', params: { id: String(p.id) } },
      });
    }
    const left = habits.filter((h) => h.count < h.target);
    if (left.length) {
      now.push({
        key: 'habits',
        icon: 'leaf',
        tone: 'mint',
        title: `${left.length} ${left.length === 1 ? 'habit' : 'habits'} left today`,
        subtitle: left.map((h) => h.name).slice(0, 3).join(', '),
        href: '/wellness',
      });
    }
    if (water.glasses < water.goal) {
      now.push({
        key: 'water',
        icon: 'drop',
        tone: 'sky',
        title: `${water.goal - water.glasses} glasses to your water goal`,
        subtitle: `${water.glasses} of ${water.goal} so far`,
        href: '/wellness',
      });
    }
    if (!checkIn) {
      now.push({
        key: 'checkin',
        icon: 'face',
        tone: 'lilac',
        title: 'How are you feeling today?',
        subtitle: 'A quick check-in helps you spot patterns later',
        href: '/wellness/check-in',
      });
    }
    for (const b of budgets) {
      if (!b.monthly_limit || b.spent < b.monthly_limit * 0.8) continue;
      const over = b.spent > b.monthly_limit;
      now.push({
        key: `b${b.category_id}`,
        icon: 'wallet',
        tone: b.area,
        title: over ? `${b.name} is over budget` : `${b.name} is close to its budget`,
        subtitle: `${rupiah(b.spent)} of ${rupiah(b.monthly_limit)} this month`,
        href: '/finance/budgets',
      });
    }
    return { now, soon };
  });

  const section = (title: string, items: Notice[]) =>
    items.length ? (
      <>
        <SectionHeader title={title} />
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {items.map((n) => (
            <Row
              key={n.key}
              icon={n.icon}
              tone={n.tone}
              title={n.title}
              subtitle={n.subtitle}
              onPress={() => router.push(n.href)}
              right={<Icon name="chevronRight" size={18} color={colors.ink3} />}
            />
          ))}
        </Card>
      </>
    ) : null;

  return (
    <Screen padBottom={24}>
      <View style={{ marginTop: 12, gap: 4 }}>
        <T v="eyebrow">Reminders & nudges</T>
        <T v="display">Inbox</T>
      </View>
      {data && data.now.length === 0 && data.soon.length === 0 ? (
        <Empty icon="inbox" title="You’re all caught up" text="Nothing needs you right now." />
      ) : null}
      {data ? section('Needs you today', data.now) : null}
      {data ? section('Coming up', data.soon) : null}
    </Screen>
  );
}
