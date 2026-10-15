import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  deletePlannerItem,
  getPlannerItem,
  savePlannerItem,
  setPlannerDone,
  type PlannerInput,
  type PlannerSpace,
} from '../../db/queries';
import { isValidTime, today } from '../../lib/format';
import { SPACE_META } from '../../components/Items';
import {
  Button,
  Chip,
  ChipRow,
  confirmDestructive,
  DateStepper,
  Field,
  Header,
  IconButton,
  Loading,
  Screen,
  T,
} from '../../components/UI';
import { colors } from '../../theme';
import { goBack } from '../../lib/nav';

type Form = Omit<PlannerInput, 'time' | 'notes'> & { time: string; notes: string };

export default function PlannerForm() {
  const params = useLocalSearchParams<{ id: string; date?: string }>();
  const isNew = params.id === 'new';
  const db = useSQLiteContext();
  const blank: Form = { title: '', notes: '', date: params.date || today(), time: '', space: 'personal', priority: 0 };
  const [form, setForm] = useState<Form | null>(isNew ? blank : null);
  const [initial, setInitial] = useState<Form>(blank);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getPlannerItem(db, Number(params.id)).then((p) => {
      if (!p) return;
      const loaded = {
        title: p.title,
        notes: p.notes ?? '',
        date: p.date,
        time: p.time ?? '',
        space: p.space,
        priority: p.priority,
      };
      setForm(loaded);
      setInitial(loaded);
      setDone(!!p.done);
    });
  }, [db, isNew, params.id]);

  if (!form) return <Screen header={<Header />}><Loading /></Screen>;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm({ ...form, [k]: v });
    setErrors({});
  };

  const leave = () => {
    if (JSON.stringify(form) === JSON.stringify(initial)) return goBack();
    Alert.alert('Discard changes?', 'This won’t be added to your planner.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => goBack() },
    ]);
  };

  async function save() {
    const next: typeof errors = {};
    if (!form!.title.trim()) next.title = 'What do you want to plan?';
    const time = form!.time.trim();
    if (time && !isValidTime(time)) next.time = 'Use 24-hour time, like 07:30 or 19:00.';
    if (Object.keys(next).length) return setErrors(next);
    setSaving(true);
    try {
      await savePlannerItem(db, { ...form!, time: time || null, notes: form!.notes }, isNew ? undefined : Number(params.id));
      goBack();
    } finally {
      setSaving(false);
    }
  }

  // "730" → "07:30", "1900" → "19:00" as people type.
  const formatTime = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, digits.length - 2).padStart(2, '0')}:${digits.slice(-2)}`;
  };

  return (
    <Screen
      header={
        <Header
          title={isNew ? 'Plan something' : 'Planner item'}
          onBack={leave}
          right={
            !isNew ? (
              <IconButton
                icon="trash"
                label="Delete"
                color={colors.brick}
                onPress={() =>
                  confirmDestructive('Delete this item?', 'It will be removed from your planner.', 'Delete', async () => {
                    await deletePlannerItem(db, Number(params.id));
                    goBack();
                  })
                }
              />
            ) : undefined
          }
        />
      }
      footer={
        <>
          <Button title={isNew ? 'Add to planner' : 'Save changes'} onPress={save} loading={saving} />
          {!isNew ? (
            <Button
              title={done ? 'Mark as not done' : 'Mark as done'}
              kind="secondary"
              icon="check"
              onPress={async () => {
                await setPlannerDone(db, Number(params.id), !done);
                goBack();
              }}
            />
          ) : null}
        </>
      }
    >
      <Field
        label="What"
        placeholder="e.g. Pay IndiHome"
        value={form.title}
        onChangeText={(v) => set('title', v)}
        error={errors.title}
        maxLength={100}
        autoFocus={isNew}
      />
      <T v="label">Day</T>
      <DateStepper value={form.date} onChange={(d) => set('date', d)} />
      <Field
        label="Time (optional)"
        placeholder="HH:MM"
        value={form.time}
        onChangeText={(v) => set('time', formatTime(v))}
        keyboardType="number-pad"
        error={errors.time}
        maxLength={5}
      />
      <T v="label">Space</T>
      <ChipRow>
        {(Object.keys(SPACE_META) as PlannerSpace[]).map((s) => (
          <Chip
            key={s}
            label={SPACE_META[s].label}
            icon={SPACE_META[s].icon}
            selected={form.space === s}
            onPress={() => set('space', s)}
          />
        ))}
      </ChipRow>
      <T v="label">Priority</T>
      <ChipRow>
        <Chip label="Normal" selected={form.priority === 0} onPress={() => set('priority', 0)} />
        <Chip label="Important" selected={form.priority === 1} onPress={() => set('priority', 1)} />
      </ChipRow>
      <Field
        label="Notes (optional)"
        placeholder="Anything to remember"
        value={form.notes}
        onChangeText={(v) => set('notes', v)}
        multiline
        maxLength={500}
      />
    </Screen>
  );
}
