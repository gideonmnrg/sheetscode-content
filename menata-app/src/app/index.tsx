import { Redirect } from 'expo-router';
import { getProfile } from '../db/queries';
import { useQuery } from '../lib/useQuery';
import { Loading } from '../components/UI';

// Entry: new installs go to the welcome screen, returning people straight to Today.
export default function Index() {
  const { data } = useQuery(async (db) => ({ profile: await getProfile(db) }));
  if (!data) return <Loading />;
  return <Redirect href={data.profile ? '/(tabs)' : '/welcome'} />;
}
