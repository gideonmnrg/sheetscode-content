import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../../components/Icon';
import { T } from '../../components/UI';
import { colors, fonts, shadow } from '../../theme';

// Today · Spaces · (+) Quick add · Calendar · Inbox — the bar never grows past five.
const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Today', icon: 'sun' },
  spaces: { label: 'Spaces', icon: 'grid' },
  add: { label: 'Add', icon: 'plus' },
  calendar: { label: 'Calendar', icon: 'calendar' },
  inbox: { label: 'Inbox', icon: 'inbox' },
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          if (route.name === 'add') {
            return (
              <Pressable
                key={route.key}
                onPress={() => router.push('/quick-add')}
                accessibilityRole="button"
                accessibilityLabel="Quick add"
                style={({ pressed }) => [styles.add, pressed && { transform: [{ scale: 0.94 }] }]}
              >
                <Icon name="plus" size={26} color={colors.paper} strokeWidth={2.2} />
              </Pressable>
            );
          }
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={styles.item}
            >
              <View style={[styles.iconPill, focused && { backgroundColor: colors.mint }]}>
                <Icon name={meta.icon} size={22} color={focused ? colors.navy : colors.ink2} />
              </View>
              <T
                v="caption"
                color={focused ? colors.navy : colors.ink2}
                style={{ fontSize: 11, lineHeight: 14, fontFamily: focused ? fonts.heavy : fonts.bold }}
              >
                {meta.label}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="spaces" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="inbox" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.oat,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.paper,
    borderRadius: 28,
    height: 72,
    paddingHorizontal: 6,
    ...shadow.floating,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 60,
  },
  iconPill: {
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});
