import { View } from 'react-native';
import { router } from 'expo-router';
import { listAccounts, listBudgets, listTransactions, monthTotals } from '../../db/queries';
import { useQuery } from '../../lib/useQuery';
import { monthKey, monthLabel, rupiah, today } from '../../lib/format';
import { Button, Card, Empty, Header, IconButton, ProgressBar, Row, Screen, SectionHeader, T } from '../../components/UI';
import { TxRow } from '../../components/Items';
import { Icon, type IconName } from '../../components/Icon';
import { colors } from '../../theme';

const ACCOUNT_ICON: Record<string, IconName> = { bank: 'wallet', ewallet: 'sparkle', cash: 'wallet', savings: 'shield' };

export default function FinanceHome() {
  const month = monthKey(today());
  const { data } = useQuery(async (db) => {
    const [accounts, totals, budgets, recent] = await Promise.all([
      listAccounts(db),
      monthTotals(db, month),
      listBudgets(db, month),
      listTransactions(db, { limit: 6 }),
    ]);
    return { accounts, totals, budgets: budgets.filter((b) => b.monthly_limit), recent };
  });

  const total = data?.accounts.reduce((s, a) => s + a.balance, 0) ?? 0;
  const budgetTotal = data?.budgets.reduce((s, b) => s + (b.monthly_limit ?? 0), 0) ?? 0;
  const budgetSpent = data?.budgets.reduce((s, b) => s + b.spent, 0) ?? 0;
  const addTx = (kind: 'expense' | 'income') => router.push({ pathname: '/finance/tx/[id]', params: { id: 'new', kind } });

  return (
    <Screen
      header={
        <Header
          eyebrow="Space"
          title="Finance"
          right={<IconButton icon="search" label="All transactions" onPress={() => router.push('/finance/transactions')} />}
        />
      }
    >
      <Card tone="navy">
        <T v="caption" color={colors.tealSoft}>
          Total across {data?.accounts.length ?? 0} accounts
        </T>
        <T v="display" color={colors.paper}>
          {rupiah(total)}
        </T>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Expense" kind="teal" icon="minus" onPress={() => addTx('expense')} style={{ flex: 1 }} />
          <Button title="Income" kind="secondary" icon="plus" onPress={() => addTx('income')} style={{ flex: 1 }} />
        </View>
      </Card>

      <SectionHeader title={monthLabel(month)} action="Transactions" onAction={() => router.push('/finance/transactions')} />
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <T v="label">Came in</T>
          <T v="heading" color={colors.teal}>
            {rupiah(data?.totals.income ?? 0)}
          </T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <T v="label">Went out</T>
          <T v="heading">{rupiah(data?.totals.expense ?? 0)}</T>
        </View>
      </Card>

      <SectionHeader title="Budget" action="Edit limits" onAction={() => router.push('/finance/budgets')} />
      {data && data.budgets.length === 0 ? (
        <Card>
          <T v="body" color={colors.ink2}>
            Set a monthly limit for a few categories to see how the month is going.
          </T>
          <Button title="Set budgets" kind="secondary" onPress={() => router.push('/finance/budgets')} />
        </Card>
      ) : (
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T v="label">
              {rupiah(budgetSpent)} of {rupiah(budgetTotal)}
            </T>
            <T v="label" color={colors.ink2}>
              {budgetTotal ? Math.round((budgetSpent / budgetTotal) * 100) : 0}%
            </T>
          </View>
          <ProgressBar value={budgetTotal ? budgetSpent / budgetTotal : 0} color={colors.navy} />
          {data?.budgets
            .slice()
            .sort((a, b) => b.spent / (b.monthly_limit ?? 1) - a.spent / (a.monthly_limit ?? 1))
            .slice(0, 3)
            .map((b) => (
              <View key={b.category_id} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T v="caption" color={colors.ink}>
                    {b.name}
                  </T>
                  <T v="caption">
                    {rupiah(b.spent)} / {rupiah(b.monthly_limit ?? 0)}
                  </T>
                </View>
                <ProgressBar value={b.spent / (b.monthly_limit ?? 1)} color={colors.teal} />
              </View>
            ))}
        </Card>
      )}

      <SectionHeader title="Accounts" action="Manage" onAction={() => router.push('/finance/accounts')} />
      {data && data.accounts.length === 0 ? (
        <Empty
          icon="wallet"
          title="Add your first account"
          text="A bank account, e-wallet or cash. Balances update as you log money in and out."
          action="Add account"
          onAction={() => router.push({ pathname: '/finance/account/[id]', params: { id: 'new' } })}
        />
      ) : (
        <Card style={{ gap: 2, paddingVertical: 10 }}>
          {data?.accounts.map((a) => (
            <Row
              key={a.id}
              icon={ACCOUNT_ICON[a.kind] ?? 'wallet'}
              tone="sky"
              title={a.name}
              right={<T v="label">{rupiah(a.balance)}</T>}
              onPress={() => router.push({ pathname: '/finance/account/[id]', params: { id: String(a.id) } })}
            />
          ))}
        </Card>
      )}

      <SectionHeader title="Recent" action="See all" onAction={() => router.push('/finance/transactions')} />
      <Card style={{ gap: 2, paddingVertical: 10 }}>
        {data?.recent.length ? (
          data.recent.map((t) => <TxRow key={t.id} tx={t} />)
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <Icon name="wallet" color={colors.ink3} />
            <T v="body" color={colors.ink2}>
              No transactions yet.
            </T>
          </View>
        )}
      </Card>
    </Screen>
  );
}
