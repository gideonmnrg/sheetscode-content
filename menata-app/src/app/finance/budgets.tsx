import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { listBudgets, setBudget, type BudgetRow } from '../../db/queries';
import { groupDigits, monthKey, monthLabel, parseAmount, rupiah, today } from '../../lib/format';
import { Button, Card, Header, Loading, ProgressBar, Screen, T } from '../../components/UI';
import { colors, fonts, radius } from '../../theme';
import { goBack } from '../../lib/nav';

export default function Budgets() {
  const db = useSQLiteContext();
  const month = monthKey(today());
  const [rows, setRows] = useState<BudgetRow[] | null>(null);
  const [limits, setLimits] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listBudgets(db, month).then((r) => {
      setRows(r);
      setLimits(Object.fromEntries(r.map((b) => [b.category_id, b.monthly_limit ? groupDigits(String(b.monthly_limit)) : ''])));
    });
  }, [db, month]);

  if (!rows) return <Screen header={<Header />}><Loading /></Screen>;

  const total = Object.values(limits).reduce((s, v) => s + parseAmount(v), 0);

  async function save() {
    setSaving(true);
    try {
      await db.withTransactionAsync(async () => {
        for (const r of rows!) await setBudget(db, r.category_id, parseAmount(limits[r.category_id] ?? '') || null);
      });
      goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={<Header title="Monthly budget" eyebrow={monthLabel(month)} />}
      footer={<Button title="Save budget" onPress={save} loading={saving} />}
    >
      <Card tone="sky">
        <T v="caption" color={colors.ink}>
          Total monthly budget
        </T>
        <T v="title">{rupiah(total)}</T>
        <T v="caption" color={colors.ink}>
          Leave a category empty if you don’t want a limit for it.
        </T>
      </Card>

      {rows.map((r) => {
        const limit = parseAmount(limits[r.category_id] ?? '');
        return (
          <Card key={r.category_id} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors[r.area] }} />
              <T v="label" style={{ flex: 1 }}>
                {r.name}
              </T>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: colors.chip,
                borderRadius: radius.tile,
                paddingHorizontal: 14,
              }}
            >
              <T v="caption">Rp</T>
              <TextInput
                value={limits[r.category_id] ?? ''}
                onChangeText={(v) => setLimits({ ...limits, [r.category_id]: groupDigits(v) })}
                keyboardType="number-pad"
                placeholder="No limit"
                placeholderTextColor={colors.ink3}
                accessibilityLabel={`${r.name} monthly limit`}
                style={{ flex: 1, minWidth: 0, minHeight: 48, fontFamily: fonts.heavy, fontSize: 16, color: colors.ink }}
              />
            </View>
            {limit > 0 ? (
              <>
                <ProgressBar value={r.spent / limit} color={r.spent > limit ? colors.navy : colors.teal} />
                <T v="caption">
                  {rupiah(r.spent)} spent ·{' '}
                  {r.spent > limit ? `${rupiah(r.spent - limit)} over` : `${rupiah(limit - r.spent)} left`}
                </T>
              </>
            ) : r.spent > 0 ? (
              <T v="caption">{rupiah(r.spent)} spent this month</T>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}
