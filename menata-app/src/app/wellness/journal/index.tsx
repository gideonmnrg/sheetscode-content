import { useState } from 'react';
import { router } from 'expo-router';
import { listJournal } from '../../../db/queries';
import { useQuery } from '../../../lib/useQuery';
import { relativeDay } from '../../../lib/format';
import { Button, Card, Empty, Field, Header, Screen, T } from '../../../components/UI';
import { colors } from '../../../theme';

export default function JournalList() {
  const [search, setSearch] = useState('');
  const { data } = useQuery((db) => listJournal(db));
  const q = search.trim().toLowerCase();
  const entries = (data ?? []).filter(
    (e) => !q || e.body.toLowerCase().includes(q) || (e.title ?? '').toLowerCase().includes(q),
  );
  const write = () => router.push({ pathname: '/wellness/journal/[id]', params: { id: 'new' } });

  return (
    <Screen header={<Header title="Journal" />} footer={<Button title="New entry" icon="edit" onPress={write} />}>
      {data && data.length === 0 ? (
        <Empty icon="note" title="Your journal is empty" text="A few lines at the end of the day is plenty." />
      ) : (
        <>
          <Field label="Search" placeholder="Find an entry" value={search} onChangeText={setSearch} />
          {entries.map((e) => (
            <Card
              key={e.id}
              onPress={() => router.push({ pathname: '/wellness/journal/[id]', params: { id: String(e.id) } })}
              accessibilityLabel={e.title ?? 'Journal entry'}
              style={{ gap: 6 }}
            >
              <T v="eyebrow">{relativeDay(e.date)}</T>
              {e.title ? <T v="heading">{e.title}</T> : null}
              <T v="body" color={colors.ink2} numberOfLines={3}>
                {e.body}
              </T>
            </Card>
          ))}
          {q && entries.length === 0 ? (
            <Card>
              <T v="body" color={colors.ink2}>
                No entries match “{search.trim()}”.
              </T>
            </Card>
          ) : null}
        </>
      )}
    </Screen>
  );
}
