import { Pressable, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getWater, setWater } from '../db/queries';
import { today } from '../lib/format';
import { Header, IconTile, Screen, T } from '../components/UI';
import { type IconName } from '../components/Icon';
import { colors, radius, type Pastel } from '../theme';
import { goBack } from '../lib/nav';

type Action = { label: string; hint: string; icon: IconName; tone: Pastel; href?: Href; run?: () => Promise<void> };

export default function QuickAdd() {
  const db = useSQLiteContext();

  const actions: Action[] = [
    { label: 'Plan something', hint: 'Task or reminder', icon: 'list', tone: 'butter', href: { pathname: '/planner/[id]', params: { id: 'new' } } },
    { label: 'Expense', hint: 'Money out', icon: 'wallet', tone: 'sky', href: { pathname: '/finance/tx/[id]', params: { id: 'new', kind: 'expense' } } },
    { label: 'Income', hint: 'Money in', icon: 'arrowDown', tone: 'mint', href: { pathname: '/finance/tx/[id]', params: { id: 'new', kind: 'income' } } },
    { label: 'Check in', hint: 'Mood, stress, energy', icon: 'face', tone: 'lilac', href: '/wellness/check-in' },
    { label: 'New habit', hint: 'Something small, often', icon: 'leaf', tone: 'mint', href: { pathname: '/wellness/habit-form/[id]', params: { id: 'new' } } },
    { label: 'Journal', hint: 'A few lines', icon: 'note', tone: 'peach', href: { pathname: '/wellness/journal/[id]', params: { id: 'new' } } },
    {
      label: 'A glass of water',
      hint: 'Logs it right away',
      icon: 'drop',
      tone: 'sky',
      run: async () => {
        const t = today();
        const w = await getWater(db, t);
        await setWater(db, t, w.glasses + 1);
      },
    },
  ];

  return (
    <Screen header={<Header title="Quick add" />}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {actions.map((a) => (
          <Pressable
            key={a.label}
            accessibilityRole="button"
            accessibilityLabel={a.label}
            onPress={async () => {
              if (a.run) {
                await a.run();
                goBack();
              } else if (a.href) {
                // Swap the sheet for the form, so saving the form lands back where you started.
                router.replace(a.href);
              }
            }}
            style={({ pressed }) => ({
              width: '47%',
              flexGrow: 1,
              backgroundColor: colors.paper,
              borderRadius: radius.card,
              padding: 16,
              gap: 10,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <IconTile icon={a.icon} tone={a.tone} />
            <View style={{ gap: 2 }}>
              <T v="label">{a.label}</T>
              <T v="caption">{a.hint}</T>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
