import { View } from 'react-native';
import { router } from 'expo-router';
import { deleteCheckIn, listCheckIns } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { relativeDay } from '../../lib/format';
import { Button, Card, confirmDestructive, Empty, Header, IconButton, Screen, SectionHeader, T } from '../../components/UI';
import { MOOD_LABELS, MoodFace } from '../../components/MoodFace';
import { colors } from '../../theme';

export default function MindHistory() {
  const { data, reload, db } = useQuery((db) => listCheckIns(db, 60));
  const list = data ?? [];
  const recent = list.slice(0, 7);
  const avg = (k: 'mood' | 'stress' | 'energy') =>
    recent.length ? (recent.reduce((s, c) => s + c[k], 0) / recent.length).toFixed(1) : '–';

  return (
    <Screen
      header={<Header title="Mood, stress & energy" />}
      footer={<Button title="Check in now" icon="plus" onPress={() => router.push('/wellness/check-in')} />}
    >
      {data && list.length === 0 ? (
        <Empty icon="face" title="No check-ins yet" text="Check in once a day and you’ll start to see your week here." />
      ) : (
        <>
          <Card tone="lilac">
            <T v="caption" color={colors.ink}>
              Your recent check-ins · average of the last {recent.length}
            </T>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {(['mood', 'stress', 'energy'] as const).map((k) => (
                <View key={k} style={{ gap: 2 }}>
                  <T v="caption" color={colors.ink}>
                    {k[0].toUpperCase() + k.slice(1)}
                  </T>
                  <T v="title">{avg(k)}</T>
                </View>
              ))}
            </View>
          </Card>

          <SectionHeader title="History" />
          <Card style={{ gap: 0, paddingVertical: 6 }}>
            {list.map((c, i) => (
              <View
                key={c.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 10,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: colors.lineSoft,
                }}
              >
                <MoodFace level={c.mood} size={40} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="label">
                    {MOOD_LABELS[c.mood - 1]} · {relativeDay(c.date)}, {c.time}
                  </T>
                  <T v="caption">
                    Stress {c.stress}/5 · Energy {c.energy}/5
                  </T>
                  {c.note ? <T v="body">{c.note}</T> : null}
                </View>
                <IconButton
                  icon="trash"
                  label="Delete check-in"
                  tone="clear"
                  color={colors.ink3}
                  onPress={() =>
                    confirmDestructive('Delete this check-in?', 'It will be removed from your history.', 'Delete', async () => {
                      await deleteCheckIn(db, c.id);
                      reload();
                    })
                  }
                />
              </View>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}
