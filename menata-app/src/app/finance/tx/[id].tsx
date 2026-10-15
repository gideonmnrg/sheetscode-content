import { useEffect, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  deleteTransaction,
  getTransaction,
  listAccounts,
  listCategories,
  saveTransaction,
  type AccountWithBalance,
  type Category,
  type TxKind,
} from '../../../db/queries';
import { groupDigits, parseAmount, today } from '../../../lib/format';
import {
  Button,
  Card,
  Chip,
  ChipRow,
  confirmDestructive,
  DateStepper,
  Empty,
  Field,
  Header,
  IconButton,
  Loading,
  Screen,
  Segmented,
  T,
} from '../../../components/UI';
import { colors, fonts } from '../../../theme';
import { goBack } from '../../../lib/nav';

type Form = { kind: TxKind; amount: string; account_id: number | null; category_id: number | null; note: string; date: string };

export default function TransactionForm() {
  const params = useLocalSearchParams<{ id: string; kind?: TxKind }>();
  const isNew = params.id === 'new';
  const db = useSQLiteContext();
  const [form, setForm] = useState<Form | null>(null);
  const [initial, setInitial] = useState<Form | null>(null);
  const [accounts, setAccounts] = useState<AccountWithBalance[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ amount?: string; account?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [accs, cats] = await Promise.all([listAccounts(db), listCategories(db)]);
      setAccounts(accs);
      setCategories(cats);
      let loaded: Form;
      if (isNew) {
        loaded = {
          kind: params.kind === 'income' ? 'income' : 'expense',
          amount: '',
          account_id: accs[0]?.id ?? null,
          category_id: null,
          note: '',
          date: today(),
        };
      } else {
        const t = await getTransaction(db, Number(params.id));
        if (!t) return;
        loaded = {
          kind: t.kind,
          amount: groupDigits(String(t.amount)),
          account_id: t.account_id,
          category_id: t.category_id,
          note: t.note ?? '',
          date: t.date,
        };
      }
      setForm(loaded);
      setInitial(loaded);
    })();
  }, [db, isNew, params.id, params.kind]);

  if (!form) return <Screen header={<Header />}><Loading /></Screen>;

  if (accounts.length === 0 && isNew) {
    return (
      <Screen header={<Header title="New transaction" />}>
        <Empty
          icon="wallet"
          title="Add an account first"
          text="Every transaction belongs to an account — a bank, an e-wallet or cash."
          action="Add account"
          onAction={() => router.replace({ pathname: '/finance/account/[id]', params: { id: 'new' } })}
        />
      </Screen>
    );
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm({ ...form, [k]: v });
    setErrors({});
  };
  const cats = categories.filter((c) => c.kind === form.kind);

  const leave = () => {
    if (JSON.stringify(form) === JSON.stringify(initial)) return goBack();
    Alert.alert('Discard changes?', 'This transaction won’t be saved.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => goBack() },
    ]);
  };

  async function save() {
    const amount = parseAmount(form!.amount);
    const next: typeof errors = {};
    if (amount <= 0) next.amount = 'Enter an amount above Rp 0.';
    else if (amount > 100_000_000_000) next.amount = 'That’s more than Rp 100 billion — check the number.';
    if (!form!.account_id) next.account = 'Choose an account.';
    if (Object.keys(next).length) return setErrors(next);
    setSaving(true);
    try {
      await saveTransaction(
        db,
        {
          kind: form!.kind,
          amount,
          account_id: form!.account_id!,
          category_id: form!.category_id,
          note: form!.note,
          date: form!.date,
        },
        isNew ? undefined : Number(params.id),
      );
      goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={
        <Header
          title={isNew ? (form.kind === 'income' ? 'Add income' : 'Add expense') : 'Transaction'}
          onBack={leave}
          right={
            !isNew ? (
              <IconButton
                icon="trash"
                label="Delete transaction"
                color={colors.brick}
                onPress={() =>
                  confirmDestructive(
                    'Delete this transaction?',
                    'Account balances and budgets will update.',
                    'Delete',
                    async () => {
                      await deleteTransaction(db, Number(params.id));
                      goBack();
                    },
                  )
                }
              />
            ) : undefined
          }
        />
      }
      footer={<Button title={isNew ? 'Save' : 'Save changes'} onPress={save} loading={saving} />}
    >
      <Segmented
        options={[
          { key: 'expense', label: 'Expense' },
          { key: 'income', label: 'Income' },
        ]}
        value={form.kind}
        onChange={(kind) => setForm({ ...form, kind, category_id: null })}
      />

      <Card style={{ alignItems: 'center', gap: 4 }}>
        <T v="caption">Amount</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <T v="title" color={colors.ink2}>
            Rp
          </T>
          <TextInput
            value={form.amount}
            onChangeText={(v) => set('amount', groupDigits(v))}
            placeholder="0"
            placeholderTextColor={colors.line}
            keyboardType="number-pad"
            accessibilityLabel="Amount in rupiah"
            autoFocus={isNew}
            style={{
              fontFamily: fonts.display,
              fontSize: 40,
              color: form.kind === 'income' ? colors.teal : colors.ink,
              minWidth: 120,
              textAlign: 'center',
              paddingVertical: 4,
            }}
          />
        </View>
        {errors.amount ? (
          <T v="caption" color={colors.brick}>
            {errors.amount}
          </T>
        ) : null}
      </Card>

      <T v="label" style={{ marginTop: 6 }}>
        Category
      </T>
      <ChipRow>
        {cats.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            tone={c.area}
            selected={form.category_id === c.id}
            onPress={() => set('category_id', form.category_id === c.id ? null : c.id)}
          />
        ))}
      </ChipRow>

      <T v="label" style={{ marginTop: 6 }}>
        {form.kind === 'income' ? 'Into account' : 'From account'}
      </T>
      <ChipRow>
        {accounts.map((a) => (
          <Chip key={a.id} label={a.name} selected={form.account_id === a.id} onPress={() => set('account_id', a.id)} />
        ))}
      </ChipRow>
      {errors.account ? (
        <T v="caption" color={colors.brick}>
          {errors.account}
        </T>
      ) : null}

      <T v="label" style={{ marginTop: 6 }}>
        Date
      </T>
      <DateStepper value={form.date} onChange={(d) => set('date', d)} />

      <Field
        label="Note (optional)"
        placeholder={form.kind === 'income' ? 'e.g. Monthly salary' : 'e.g. Weekly groceries'}
        value={form.note}
        onChangeText={(v) => set('note', v)}
        maxLength={120}
      />
    </Screen>
  );
}
