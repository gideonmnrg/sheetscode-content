import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addCheckIn } from '../../db/queries';
import { nowTime, today } from '../../lib/format';
import { Button, Card, Field, Header, Screen, T } from '../../components/UI';
import { MOOD_LABELS, MoodFace } from '../../components/MoodFace';
import { colors, radius } from '../../theme';
import { goBack } from '../../lib/nav';

function Scale({
  label,
  low,
  high,
  value,
  onChange,
}: {
  label: string;
  low: string;
  high: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <Card style={{ gap: 10 }}>
      <T v="label">{label}</T>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === n }}
            accessibilityLabel={`${label} ${n} of 5`}
            style={{
              flex: 1,
              height: 48,
              borderRadius: radius.tile,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: value === n ? colors.navy : colors.chip,
            }}
          >
            <T v="label" color={value === n ? colors.paper : colors.ink}>
              {n}
            </T>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T v="caption">{low}</T>
        <T v="caption">{high}</T>
      </View>
    </Card>
  );
}

export default function CheckIn() {
  const db = useSQLiteContext();
  const [mood, setMood] = useState(0);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!mood) return setError('Pick the face closest to how you feel.');
    setSaving(true);
    try {
      await addCheckIn(db, { date: today(), time: nowTime(), mood, stress, energy, note });
      goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={<Header title="Quick check-in" />}
      footer={<Button title="Save check-in" onPress={save} loading={saving} />}
    >
      <T v="title" style={{ marginTop: 4 }}>
        How are you feeling?
      </T>
      <Card tone="lilac">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => {
                setMood(n);
                setError(null);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: mood === n }}
              accessibilityLabel={MOOD_LABELS[n - 1]}
              style={{
                alignItems: 'center',
                gap: 4,
                padding: 6,
                borderRadius: radius.tile,
                backgroundColor: mood === n ? colors.paper : 'transparent',
                transform: [{ scale: mood === n ? 1.06 : 1 }],
              }}
            >
              <MoodFace level={n} size={46} color={mood === n ? colors.navy : colors.ink} />
              <T v="caption" color={colors.ink}>
                {MOOD_LABELS[n - 1]}
              </T>
            </Pressable>
          ))}
        </View>
        {error ? (
          <T v="caption" color={colors.brick}>
            {error}
          </T>
        ) : null}
      </Card>

      <Scale label="Stress" low="Calm" high="Very stressed" value={stress} onChange={setStress} />
      <Scale label="Energy" low="Drained" high="Full of energy" value={energy} onChange={setEnergy} />

      <Field
        label="Anything on your mind? (optional)"
        placeholder="A word or a sentence is enough"
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={500}
      />
      <T v="caption">Menata looks for patterns over time. It never diagnoses.</T>
    </Screen>
  );
}
