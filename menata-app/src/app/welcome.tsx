import { useState } from 'react';
import { Image, View } from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Button, Field, Screen, T, Wordmark } from '../components/UI';
import { saveProfile } from '../db/queries';
import { loadDemoData } from '../db/seed';
import { colors } from '../theme';

// Stands in for Log in / Create account while everything lives on the phone.
export default function Welcome() {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'start' | 'demo' | null>(null);

  async function start(withDemo: boolean) {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Tell us what to call you.');
      return;
    }
    setBusy(withDemo ? 'demo' : 'start');
    try {
      if (withDemo) await loadDemoData(db, trimmed);
      else await saveProfile(db, trimmed);
      router.replace('/(tabs)');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Screen
      footer={
        <>
          <Button title="Start my Menata" onPress={() => start(false)} loading={busy === 'start'} disabled={!!busy} />
          <Button
            title="Try it with demo data"
            kind="secondary"
            onPress={() => start(true)}
            loading={busy === 'demo'}
            disabled={!!busy}
          />
        </>
      }
    >
      <View style={{ alignItems: 'center', marginTop: 56, gap: 14 }}>
        <Image
          source={require('../../assets/menata-mark.png')}
          style={{ width: 96, height: 84 }}
          resizeMode="contain"
          accessibilityLabel="Menata logo"
        />
        <Wordmark size={40} />
        <T v="body" color={colors.ink2} style={{ textAlign: 'center', maxWidth: 300 }}>
          One calm place for your health, money, plans and the people you care for.
        </T>
      </View>

      <View style={{ marginTop: 40, gap: 16 }}>
        <T v="title">What should we call you?</T>
        <Field
          label="Your name"
          placeholder="e.g. Gidy"
          value={name}
          onChangeText={(v) => {
            setName(v);
            setError(null);
          }}
          error={error}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => start(false)}
          maxLength={40}
        />
        <T v="caption">
          This test version keeps everything on this phone, in a local SQLite database. No account, nothing uploaded.
        </T>
      </View>
    </Screen>
  );
}
