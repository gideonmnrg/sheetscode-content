import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { listTransactions, type TransactionRow, type TxKind } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { monthKey, monthLabel, relativeDay, rupiah, shiftMonth, today } from '../../lib/format';
import { Button, Card, Empty, Field, Header, IconButton, Screen, Segmented, T } from '../../components/UI';
import { TxRow } from '../../components/Items';
import { colors } from '../../theme';

export default function Transactions() {
  const [month, setMonth] = useState(monthKey(today()));
  const [kind, setKind] = useState<'all' | TxKind>('all');
  const [search, setSearch] = useState('');
  const { data } = useQuery(
    (db) => listTransactions(db, { month, search, kind: kind === 'all' ? undefined : kind }),
    [month, search, kind],
  );

  const groups = new Map<string, TransactionRow[]>();
  for (const t of data ?? []) groups.set(t.date, [...(groups.get(t.date) ?? []), t]);
  const net = (data ?? []).reduce((s, t) => s + (t.kind === 'income' ? t.amount : -t.amount), 0);
  const filtered = !!search.trim() || kind !== 'all';

  return (
    <Screen
      header={<Header title="Transactions" />}
      footer={
        <Button
          title="Add transaction"
          icon="plus"
          onPress={() => router.push({ pathname: '/finance/tx/[id]', params: { id: 'new', kind: 'expense' } })}
        />
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon="chevronLeft" label="Previous month" tone="paper" onPress={() => setMonth(shiftMonth(month, -1))} />
        <View style={{ alignItems: 'center' }}>
          <T v="heading">{monthLabel(month)}</T>
          <T v="caption">Net {rupiah(net, { sign: true })}</T>
        </View>
        <IconButton icon="chevronRight" label="Next month" tone="paper" onPress={() => setMonth(shiftMonth(month, 1))} />
      </View>
      <Segmented
        options={[
          { key: 'all', label: 'All' },
          { key: 'expense', label: 'Out' },
          { key: 'income', label: 'In' },
        ]}
        value={kind}
        onChange={setKind}
      />
      <Field label="Search" placeholder="Note, category or account" value={search} onChangeText={setSearch} />

      {data && data.length === 0 ? (
        filtered ? (
          <Card>
            <T v="body" color={colors.ink2}>
              Nothing matches these filters this month.
            </T>
          </Card>
        ) : (
          <Empty icon="wallet" title="No transactions this month" text="Log money in and out and it shows up here." />
        )
      ) : (
        [...groups.entries()].map(([date, txs]) => (
          <View key={date} style={{ gap: 6 }}>
            <T v="eyebrow" style={{ marginTop: 6 }}>
              {relativeDay(date)}
            </T>
            <Card style={{ gap: 2, paddingVertical: 8 }}>
              {txs.map((t) => (
                <TxRow key={t.id} tx={t} />
              ))}
            </Card>
          </View>
        ))
      )}
    </Screen>
  );
}
