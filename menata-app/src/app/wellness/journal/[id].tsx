import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { deleteJournal, getJournal, saveJournal } from '../../../db/queries';
import { today } from '../../../lib/format';
import { Button, confirmDestructive, DateStepper, Field, Header, IconButton, Loading, Screen } from '../../../components/UI';
import { colors } from '../../../theme';
import { goBack } from '../../../lib/nav';

type Form = { date: string; title: string; body: string };

export default function JournalEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const db = useSQLiteContext();
  const blank: Form = { date: today(), title: '', body: '' };
  const [form, setForm] = useState<Form | null>(isNew ? blank : null);
  const [initial, setInitial] = useState<Form>(blank);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getJournal(db, Number(id)).then((e) => {
      if (!e) return;
      const loaded = { date: e.date, title: e.title ?? '', body: e.body };
      setForm(loaded);
      setInitial(loaded);
    });
  }, [db, id, isNew]);

  if (!form) return <Screen header={<Header />}><Loading /></Screen>;

  const leave = () => {
    if (JSON.stringify(form) === JSON.stringify(initial)) return goBack();
    Alert.alert('Discard this entry?', 'What you wrote won’t be saved.', [
      { text: 'Keep writing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => goBack() },
    ]);
  };

  async function save() {
    if (!form!.body.trim()) return setError('Write at least a few words.');
    setSaving(true);
    try {
      await saveJournal(db, form!, isNew ? undefined : Number(id));
      goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={
        <Header
          title={isNew ? 'New entry' : 'Journal entry'}
          onBack={leave}
          right={
            !isNew ? (
              <IconButton
                icon="trash"
                label="Delete entry"
                color={colors.brick}
                onPress={() =>
                  confirmDestructive('Delete this entry?', 'This can’t be undone.', 'Delete', async () => {
                    await deleteJournal(db, Number(id));
                    goBack();
                  })
                }
              />
            ) : undefined
          }
        />
      }
      footer={<Button title="Save entry" onPress={save} loading={saving} />}
    >
      <DateStepper value={form.date} onChange={(date) => setForm({ ...form, date })} />
      <Field
        label="Title (optional)"
        placeholder="e.g. A calmer week"
        value={form.title}
        onChangeText={(title) => setForm({ ...form, title })}
        maxLength={80}
      />
      <Field
        label="Entry"
        placeholder="What happened today? What helped?"
        value={form.body}
        onChangeText={(body) => {
          setForm({ ...form, body });
          setError(null);
        }}
        error={error}
        multiline
        style={{ minHeight: 220 }}
      />
    </Screen>
  );
}
