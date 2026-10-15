import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from './Icon';
import { Row, T } from './UI';
import { colors } from '../theme';
import type { HabitToday, PlannerItem, PlannerSpace, TransactionRow } from '../db/queries';
import { relativeDay, rupiah } from '../lib/format';
import type { Pastel } from '../theme';

export function CheckCircle({
  done,
  label,
  onPress,
  progress,
}: {
  done: boolean;
  label: string;
  onPress: () => void;
  progress?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: done ? colors.teal : colors.paper,
        borderWidth: done ? 0 : 2,
        borderColor: colors.line,
        transform: [{ scale: pressed ? 0.9 : 1 }],
      })}
    >
      {done ? (
        <Icon name="check" size={22} color={colors.navy} strokeWidth={2.4} />
      ) : progress ? (
        <T v="caption" color={colors.ink}>
          {progress}
        </T>
      ) : null}
    </Pressable>
  );
}

const PART_LABEL = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', anytime: 'Any time' } as const;

export function HabitItem({ habit, onTap }: { habit: HabitToday; onTap: () => void }) {
  const done = habit.count >= habit.target;
  const progress = habit.target > 1 ? `${habit.count}/${habit.target}` : undefined;
  return (
    <Row
      icon={habit.icon}
      tone={habit.area}
      title={habit.name}
      subtitle={done ? 'Done · nice' : PART_LABEL[habit.part_of_day]}
      onPress={() => router.push({ pathname: '/wellness/habit/[id]', params: { id: String(habit.id) } })}
      right={<CheckCircle done={done} label={`Mark ${habit.name}`} onPress={onTap} progress={progress} />}
    />
  );
}

export const SPACE_META: Record<PlannerSpace, { label: string; icon: IconName; tone: Pastel }> = {
  personal: { label: 'Personal', icon: 'user', tone: 'butter' },
  wellness: { label: 'Wellness', icon: 'leaf', tone: 'mint' },
  finance: { label: 'Finance', icon: 'wallet', tone: 'sky' },
  travel: { label: 'Travel', icon: 'plane', tone: 'peach' },
  event: { label: 'Event', icon: 'gift', tone: 'rose' },
  education: { label: 'Education', icon: 'cap', tone: 'lilac' },
  home: { label: 'Home', icon: 'house', tone: 'butter' },
};

export function PlannerRow({
  item,
  onToggle,
  showDate,
}: {
  item: PlannerItem;
  onToggle: () => void;
  showDate?: boolean;
}) {
  const meta = SPACE_META[item.space];
  const when = [showDate ? relativeDay(item.date) : null, item.time, meta.label].filter(Boolean).join(' · ');
  return (
    <Row
      icon={meta.icon}
      tone={meta.tone}
      title={item.title}
      subtitle={when}
      muted={!!item.done}
      onPress={() => router.push({ pathname: '/planner/[id]', params: { id: String(item.id) } })}
      right={<CheckCircle done={!!item.done} label={`Complete ${item.title}`} onPress={onToggle} />}
    />
  );
}

export function TxRow({ tx }: { tx: TransactionRow }) {
  const income = tx.kind === 'income';
  return (
    <Row
      icon={income ? 'arrowDown' : 'wallet'}
      tone={tx.category_area ?? 'chip'}
      title={tx.note || tx.category_name || (income ? 'Income' : 'Expense')}
      subtitle={[tx.category_name, tx.account_name, relativeDay(tx.date)].filter(Boolean).join(' · ')}
      onPress={() => router.push({ pathname: '/finance/tx/[id]', params: { id: String(tx.id) } })}
      right={
        // Money is never red: spending in ink, income in teal.
        <View style={{ alignItems: 'flex-end' }}>
          <T v="label" color={income ? colors.teal : colors.ink}>
            {income ? rupiah(tx.amount, { sign: true }) : rupiah(-tx.amount)}
          </T>
        </View>
      }
    />
  );
}
