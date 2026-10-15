import { useState } from 'react';
import { router } from 'expo-router';
import { listOverdue, listPlannerDone, listPlannerRange, setPlannerDone, type PlannerItem } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { addDays, today } from '../../lib/format';
import { Button, Card, Empty, Header, IconButton, Screen, SectionHeader, Segmented } from '../../components/UI';
import { PlannerRow } from '../../components/Items';

export default function Planner() {
  const [tab, setTab] = useState<'open' | 'done'>('open');
  const { data, reload, db } = useQuery(
    async (db) => {
      const t = today();
      if (tab === 'done') return { done: await listPlannerDone(db, 50) };
      const [overdue, upcoming] = await Promise.all([listOverdue(db, t), listPlannerRange(db, t, addDays(t, 365))]);
      const open = upcoming.filter((p) => !p.done || p.date === t);
      return {
        overdue,
        today: open.filter((p) => p.date === t),
        week: open.filter((p) => p.date > t && p.date <= addDays(t, 7)),
        later: open.filter((p) => p.date > addDays(t, 7)),
      };
    },
    [tab],
  );

  const add = () => router.push({ pathname: '/planner/[id]', params: { id: 'new' } });

  const list = (title: string, items: PlannerItem[] | undefined, showDate = true) =>
    items && items.length ? (
      <>
        <SectionHeader title={title} />
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {items.map((p) => (
            <PlannerRow
              key={p.id}
              item={p}
              showDate={showDate}
              onToggle={async () => {
                await setPlannerDone(db, p.id, !p.done);
                reload();
              }}
            />
          ))}
        </Card>
      </>
    ) : null;

  const empty =
    data &&
    (tab === 'done'
      ? !data.done?.length
      : !data.overdue?.length && !data.today?.length && !data.week?.length && !data.later?.length);

  return (
    <Screen
      header={<Header title="Planner" right={<IconButton icon="plus" label="Add to planner" tone="navy" onPress={add} />} />}
      footer={<Button title="Plan something" icon="plus" onPress={add} />}
    >
      <Segmented
        options={[
          { key: 'open', label: 'To do' },
          { key: 'done', label: 'Done' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {empty ? (
        <Empty
          icon="list"
          title={tab === 'done' ? 'Nothing finished yet' : 'Your planner is clear'}
          text={tab === 'done' ? 'Things you tick off show up here.' : 'Add tasks, reminders and appointments from any space.'}
        />
      ) : null}
      {tab === 'open' ? (
        <>
          {list('Still open from earlier', data?.overdue)}
          {list('Today', data?.today, false)}
          {list('Next 7 days', data?.week)}
          {list('Later', data?.later)}
        </>
      ) : (
        list('Recently done', data?.done)
      )}
    </Screen>
  );
}
