import { router } from 'expo-router';
import { listAccounts } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { rupiah } from '../../lib/format';
import { Button, Card, Empty, Header, Row, Screen, T } from '../../components/UI';
import { colors } from '../../theme';

const KIND_LABEL = { bank: 'Bank', ewallet: 'E-wallet', cash: 'Cash', savings: 'Savings' } as const;

export default function Accounts() {
  const { data } = useQuery((db) => listAccounts(db));
  const total = (data ?? []).reduce((s, a) => s + a.balance, 0);
  const add = () => router.push({ pathname: '/finance/account/[id]', params: { id: 'new' } });

  return (
    <Screen header={<Header title="Accounts" />} footer={<Button title="Add account" icon="plus" onPress={add} />}>
      {data && data.length === 0 ? (
        <Empty icon="wallet" title="No accounts yet" text="Add a bank account, e-wallet or the cash in your pocket." />
      ) : (
        <>
          <Card tone="sky">
            <T v="caption" color={colors.ink}>
              Total
            </T>
            <T v="title">{rupiah(total)}</T>
          </Card>
          <Card style={{ gap: 2, paddingVertical: 10 }}>
            {data?.map((a) => (
              <Row
                key={a.id}
                icon={a.kind === 'savings' ? 'shield' : 'wallet'}
                tone="sky"
                title={a.name}
                subtitle={KIND_LABEL[a.kind]}
                right={<T v="label">{rupiah(a.balance)}</T>}
                onPress={() => router.push({ pathname: '/finance/account/[id]', params: { id: String(a.id) } })}
              />
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}
