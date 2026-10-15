import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

// Moods are drawn faces, never emoji, so they look the same on every phone.
const MOUTHS = [
  'M8.5 16.2c1-1.3 2.2-1.9 3.5-1.9s2.5.6 3.5 1.9', // 1 · low
  'M8.8 15.6c1-.6 2-.9 3.2-.9s2.2.3 3.2.9', // 2
  'M9 15.2h6', // 3 · okay
  'M8.8 14.6c1 .8 2 1.1 3.2 1.1s2.2-.3 3.2-1.1', // 4
  'M8.3 14c1 1.6 2.3 2.4 3.7 2.4s2.7-.8 3.7-2.4', // 5 · great
];

export const MOOD_LABELS = ['Low', 'Meh', 'Okay', 'Good', 'Great'];

export function MoodFace({ level, size = 40, color = colors.ink }: { level: number; size?: number; color?: string }) {
  const i = Math.max(1, Math.min(5, Math.round(level))) - 1;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d="M9 9.8v.4M15 9.8v.4" strokeWidth={2} />
      <Path d={MOUTHS[i]} />
    </Svg>
  );
}
