import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { listAccounts, removeAccount, saveAccount, type AccountKind } from '../../../db/queries';
import { groupDigits, parseAmount, rupiah } from '../../../lib/format';
import { Button, Card, Chip, ChipRow, confirmDestructive, Field, Header, Loading, Screen, T } from '../../../components/UI';
import { colors } from '../../../theme';
import { goBack } from '../../../lib/nav';

const KINDS: { key: AccountKind; label: string }[] = [
  { key: 'bank', label: 'Bank' },
  { key: 'ewallet', label: 'E-wallet' },
  { key: 'cash', label: 'Cash' },
  { key: 'savings', label: 'Savings' },
];

export default function AccountForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<AccountKind>('bank');
  const [balance, setBalance] = useState('');
  const [current, setCurrent] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(isNew);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    listAccounts(db).then((accs) => {
      const a = accs.find((x) => x.id === Number(id));
      if (a) {
        setName(a.name);
        setKind(a.kind);
        setBalance(groupDigits(String(a.opening_balance)));
        setCurrent(a.balance);
      }
      setLoaded(true);
    });
  }, [db, id, isNew]);

  if (!loaded) return <Screen header={<Header />}><Loading /></Screen>;

  async function save() {
    if (!name.trim()) return setError('Name the account, e.g. “BCA” or “Cash”.');
    setSaving(true);
    try {
      await saveAccount(db, { name, kind, opening_balance: parseAmount(balance) }, isNew ? undefined : Number(id));
      goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={<Header title={isNew ? 'New account' : 'Edit account'} />}
      footer={
        <>
          <Button title={isNew ? 'Add account' : 'Save changes'} onPress={save} loading={saving} />
          {!isNew ? (
            <Button
              title="Remove account"
              kind="danger"
              icon="trash"
              onPress={() =>
                confirmDestructive(
                  'Remove this account?',
                  'If it has transactions, it will be archived so your history stays correct.',
                  'Remove',
                  async () => {
                    const result = await removeAccount(db, Number(id));
                    if (result === 'archived') Alert.alert('Account archived', 'Its past transactions are kept.');
                    goBack();
                  },
                )
              }
            />
          ) : null}
        </>
      }
    >
      <Field
        label="Name"
        placeholder="e.g. BCA, GoPay, Cash"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError(null);
        }}
        error={error}
        maxLength={40}
      />
      <T v="label">Type</T>
      <ChipRow>
        {KINDS.map((k) => (
          <Chip key={k.key} label={k.label} selected={kind === k.key} onPress={() => setKind(k.key)} />
        ))}
      </ChipRow>
      <Field
        label={isNew ? 'Balance today' : 'Starting balance'}
        placeholder="0"
        value={balance}
        onChangeText={(v) => setBalance(groupDigits(v))}
        keyboardType="number-pad"
        hint={
          isNew
            ? 'What’s in it right now. New transactions move it up and down.'
            : 'The balance before the first transaction you logged here.'
        }
      />
      {current !== null ? (
        <Card tone="sky">
          <T v="caption" color={colors.ink}>
            Current balance
          </T>
          <T v="title">{rupiah(current)}</T>
        </Card>
      ) : null}
    </Screen>
  );
}
