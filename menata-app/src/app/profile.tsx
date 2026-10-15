import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import Constants from 'expo-constants';
import { eraseAllData, getProfile, getSetting, saveProfile, setSetting } from '../db/queries';
import { loadDemoData } from '../db/seed';
import { Button, Card, confirmDestructive, Field, Header, Loading, Screen, SectionHeader, Stepper, T, Wordmark } from '../components/UI';
import { colors } from '../theme';

export default function Profile() {
  const db = useSQLiteContext();
  const [name, setName] = useState<string | null>(null);
  const [savedName, setSavedName] = useState('');
  const [waterGoal, setWaterGoal] = useState(8);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const p = await getProfile(db);
      setName(p?.name ?? '');
      setSavedName(p?.name ?? '');
      setWaterGoal(Number(await getSetting(db, 'water_goal', '8')));
    })();
  }, [db]);

  if (name === null) return <Screen header={<Header />}><Loading /></Screen>;

  return (
    <Screen header={<Header title="Profile & settings" />}>
      <Card style={{ alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.navy,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <T v="title" color={colors.paper}>
            {(savedName || '?').charAt(0).toUpperCase()}
          </T>
        </View>
        <T v="heading">{savedName}</T>
        <T v="caption">On this phone only</T>
      </Card>

      <SectionHeader title="You" />
      <Field
        label="Name"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError(null);
        }}
        error={error}
        maxLength={40}
      />
      {name.trim() !== savedName ? (
        <Button
          title="Save name"
          onPress={async () => {
            if (!name.trim()) return setError('Your name can’t be empty.');
            await saveProfile(db, name);
            setSavedName(name.trim());
          }}
        />
      ) : null}

      <SectionHeader title="Wellness targets" />
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="label">Water goal</T>
          <T v="caption">{(waterGoal * 0.25).toFixed(2).replace(/\.?0+$/, '')} L a day</T>
        </View>
        <Stepper
          value={waterGoal}
          min={1}
          max={20}
          label="glasses"
          onChange={async (n) => {
            setWaterGoal(n);
            await setSetting(db, 'water_goal', String(n));
          }}
        />
      </Card>

      <SectionHeader title="Your data" />
      <Card>
        <T v="body" color={colors.ink2}>
          Everything is stored in a SQLite database on this phone. Deleting the app deletes the data.
        </T>
        <Button
          title="Replace with demo data"
          kind="secondary"
          icon="sparkle"
          onPress={() =>
            confirmDestructive(
              'Replace everything with demo data?',
              'Your current habits, money and plans will be erased and replaced with sample data.',
              'Replace',
              async () => {
                await eraseAllData(db);
                await loadDemoData(db, savedName || 'Gidy');
                Alert.alert('Demo data loaded', 'Have a look around.');
                router.replace('/(tabs)');
              },
            )
          }
        />
        <Button
          title="Erase all data"
          kind="danger"
          icon="trash"
          onPress={() =>
            confirmDestructive(
              'Erase all data?',
              'Every habit, check-in, transaction and plan on this phone will be deleted. This can’t be undone.',
              'Erase',
              async () => {
                await eraseAllData(db);
                router.dismissAll();
                router.replace('/welcome');
              },
            )
          }
        />
      </Card>

      <View style={{ alignItems: 'center', gap: 4, marginTop: 24 }}>
        <Wordmark size={22} />
        <T v="caption">Version {Constants.expoConfig?.version ?? '1.0.0'} · test build</T>
      </View>
    </Screen>
  );
}
