import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getHabit, saveHabit, type HabitInput, type PartOfDay } from '../../../db/queries';
import { DAY_NAMES } from '../../../lib/habits';
import { Button, Card, Chip, ChipRow, Field, Header, Loading, Screen, Stepper, T } from '../../../components/UI';
import { HABIT_ICONS, Icon } from '../../../components/Icon';
import { colors, pastels, radius } from '../../../theme';
import { goBack } from '../../../lib/nav';

const PARTS: { key: PartOfDay; label: string }[] = [
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' },
  { key: 'anytime', label: 'Any time' },
];

const SUGGESTIONS = ['Morning walk · 20 min', 'Drink a glass of water on waking', 'Read 10 pages', 'Stretch 5 min', 'Phone away by 22:00'];

const EMPTY: HabitInput = { name: '', area: 'mint', icon: 'leaf', part_of_day: 'morning', days: '1111111', target: 1 };

export default function HabitForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const db = useSQLiteContext();
  const [form, setForm] = useState<HabitInput | null>(isNew ? EMPTY : null);
  const [initial, setInitial] = useState<HabitInput>(EMPTY);
  const [errors, setErrors] = useState<{ name?: string; days?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getHabit(db, Number(id)).then((h) => {
      if (!h) return;
      const loaded = { name: h.name, area: h.area, icon: h.icon, part_of_day: h.part_of_day, days: h.days, target: h.target };
      setForm(loaded);
      setInitial(loaded);
    });
  }, [db, id, isNew]);

  if (!form) return <Screen header={<Header />}><Loading /></Screen>;

  const set = <K extends keyof HabitInput>(k: K, v: HabitInput[K]) => {
    setForm({ ...form, [k]: v });
    setErrors({});
  };
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const leave = () => {
    if (!dirty) return goBack();
    Alert.alert('Discard changes?', 'What you typed here won’t be saved.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => goBack() },
    ]);
  };

  async function save() {
    const next: typeof errors = {};
    if (!form!.name.trim()) next.name = 'Give your habit a short name.';
    else if (form!.name.trim().length > 60) next.name = 'Keep it under 60 characters.';
    if (!form!.days.includes('1')) next.days = 'Pick at least one day.';
    if (Object.keys(next).length) return setErrors(next);
    setSaving(true);
    try {
      const savedId = await saveHabit(db, form!, isNew ? undefined : Number(id));
      if (isNew) router.replace({ pathname: '/wellness/habit/[id]', params: { id: String(savedId) } });
      else goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={<Header title={isNew ? 'New habit' : 'Edit habit'} onBack={leave} />}
      footer={<Button title={isNew ? 'Create habit' : 'Save changes'} onPress={save} loading={saving} />}
    >
      <Field
        label="Name"
        placeholder="e.g. Morning walk · 20 min"
        value={form.name}
        onChangeText={(v) => set('name', v)}
        error={errors.name}
        maxLength={80}
      />
      {isNew && !form.name ? (
        <ChipRow>
          {SUGGESTIONS.map((s) => (
            <Chip key={s} label={s} onPress={() => set('name', s)} />
          ))}
        </ChipRow>
      ) : null}

      <T v="label" style={{ marginTop: 8 }}>
        Icon & colour
      </T>
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {HABIT_ICONS.map((ic) => (
            <Pressable
              key={ic}
              onPress={() => set('icon', ic)}
              accessibilityRole="radio"
              accessibilityState={{ selected: form.icon === ic }}
              accessibilityLabel={ic}
              style={{
                width: 46,
                height: 46,
                borderRadius: radius.tile,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: form.icon === ic ? colors[form.area] : colors.chip,
                borderWidth: form.icon === ic ? 2 : 0,
                borderColor: colors.navy,
              }}
            >
              <Icon name={ic} size={22} />
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {pastels.map((p) => (
            <Pressable
              key={p}
              onPress={() => set('area', p)}
              accessibilityRole="radio"
              accessibilityState={{ selected: form.area === p }}
              accessibilityLabel={p}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors[p],
                borderWidth: form.area === p ? 3 : 1,
                borderColor: form.area === p ? colors.navy : colors.line,
              }}
            />
          ))}
        </View>
      </Card>

      <T v="label" style={{ marginTop: 8 }}>
        When in the day
      </T>
      <ChipRow>
        {PARTS.map((p) => (
          <Chip key={p.key} label={p.label} selected={form.part_of_day === p.key} onPress={() => set('part_of_day', p.key)} />
        ))}
      </ChipRow>

      <T v="label" style={{ marginTop: 8 }}>
        Which days
      </T>
      <ChipRow>
        {DAY_NAMES.map((d, i) => {
          const on = form.days[i] === '1';
          return (
            <Chip
              key={d}
              label={d}
              selected={on}
              onPress={() => set('days', form.days.slice(0, i) + (on ? '0' : '1') + form.days.slice(i + 1))}
            />
          );
        })}
      </ChipRow>
      <ChipRow>
        <Chip label="Every day" onPress={() => set('days', '1111111')} />
        <Chip label="Weekdays" onPress={() => set('days', '0111110')} />
        <Chip label="Weekends" onPress={() => set('days', '1000001')} />
      </ChipRow>
      {errors.days ? (
        <T v="caption" color={colors.brick}>
          {errors.days}
        </T>
      ) : null}

      <T v="label" style={{ marginTop: 8 }}>
        Times per day
      </T>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T v="caption" style={{ flex: 1 }}>
          Most habits are once a day. Use more for things like “4 short breaks”.
        </T>
        <Stepper value={form.target} onChange={(n) => set('target', n)} min={1} max={12} label="times" />
      </Card>
    </Screen>
  );
}
