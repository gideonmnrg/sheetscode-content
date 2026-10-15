import { useState } from 'react';
import { router } from 'expo-router';
import { listHabits } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { Button, Card, Empty, Field, Header, IconButton, Row, Screen, Segmented, T } from '../../components/UI';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme';
import { describeDays } from '../../lib/habits';

export default function ManageHabits() {
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [search, setSearch] = useState('');
  const { data } = useQuery((db) => listHabits(db, tab === 'archived'), [tab]);

  const q = search.trim().toLowerCase();
  const habits = (data ?? []).filter((h) => !q || h.name.toLowerCase().includes(q));
  const newHabit = () => router.push({ pathname: '/wellness/habit-form/[id]', params: { id: 'new' } });

  return (
    <Screen
      header={<Header title="Manage habits" right={<IconButton icon="plus" label="New habit" tone="navy" onPress={newHabit} />} />}
    >
      <Segmented
        options={[
          { key: 'active', label: 'Active' },
          { key: 'archived', label: 'Archived' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <Field label="Search" placeholder="Find a habit" value={search} onChangeText={setSearch} />

      {data && habits.length === 0 ? (
        q ? (
          <Card>
            <T v="body" color={colors.ink2}>
              No habits match “{search.trim()}”.
            </T>
          </Card>
        ) : tab === 'active' ? (
          <Empty icon="leaf" title="No habits yet" text="Add one small thing you want to do often." action="New habit" onAction={newHabit} />
        ) : (
          <Empty icon="archive" title="Nothing archived" text="Habits you archive keep their history and show up here." />
        )
      ) : (
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {habits.map((h) => (
            <Row
              key={h.id}
              icon={h.icon}
              tone={h.area}
              title={h.name}
              subtitle={`${h.paused ? 'Paused · ' : ''}${describeDays(h.days)}${h.target > 1 ? ` · ${h.target}× a day` : ''}`}
              onPress={() => router.push({ pathname: '/wellness/habit/[id]', params: { id: String(h.id) } })}
              right={<Icon name="chevronRight" size={18} color={colors.ink3} />}
            />
          ))}
        </Card>
      )}
      {tab === 'active' && habits.length > 0 ? <Button title="New habit" kind="secondary" icon="plus" onPress={newHabit} /> : null}
    </Screen>
  );
}
