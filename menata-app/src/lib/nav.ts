import { router } from 'expo-router';

/** Back if there's somewhere to go back to, otherwise home — a screen opened from a link has no history. */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
