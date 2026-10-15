import { Redirect } from 'expo-router';

// Placeholder route for the (+) slot; the tab bar opens the Quick add sheet instead.
export default function AddTab() {
  return <Redirect href="/quick-add" />;
}
