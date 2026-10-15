import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

// 24px grid, 1.8px rounded stroke, round caps — the canvas's iconography rules.
// The first sixteen paths are copied from "Design system · Foundations".
const ICONS = {
  sun: (
    <>
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  leaf: (
    <>
      <Path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
      <Path d="M5 19l7-7" />
    </>
  ),
  moon: <Path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  drop: <Path d="M12 3.5c3.5 4.2 6 7.5 6 10.5a6 6 0 0 1-12 0c0-3 2.5-6.3 6-10.5z" />,
  shoe: (
    <>
      <Path d="M3 16h15a3 3 0 0 0 3-3l-5-1-3-4-3 1-2 3H3z" />
      <Path d="M3 19.5h18" />
    </>
  ),
  face: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2M9 9.5v.5M15 9.5v.5" />
    </>
  ),
  heart: <Path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  pill: (
    <>
      <Rect x={3.5} y={8.5} width={17} height={7} rx={3.5} transform="rotate(-35 12 12)" />
      <Path d="M9.6 8.4l4.8 7.2" />
    </>
  ),
  calendar: (
    <>
      <Rect x={4} y={5.5} width={16} height={15} rx={3} />
      <Path d="M4 10h16M9 3.5v4M15 3.5v4" />
    </>
  ),
  bowl: (
    <>
      <Path d="M4 11h16a8 8 0 0 1-16 0z" />
      <Path d="M9 7.5c0-1.5 1-2 1-3.5M13.5 7.5c0-1.5 1-2 1-3.5" />
    </>
  ),
  wind: <Path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3" />,
  people: (
    <>
      <Circle cx={9} cy={8.5} r={3.2} />
      <Path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" />
      <Circle cx={16.5} cy={9.5} r={2.6} />
      <Path d="M16 14c2.4 0 4 1.5 4.6 4" />
    </>
  ),
  chart: <Path d="M5 20V11M12 20V5M19 20v-6" />,
  bell: (
    <>
      <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <Path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  shield: <Path d="M12 3.5l7 2.5v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6z" />,
  plus: <Path d="M12 5v14M5 12h14" />,
  minus: <Path d="M5 12h14" />,
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <Path d="M6 6l12 12M18 6L6 18" />,
  chevronLeft: <Path d="M15 5l-7 7 7 7" />,
  chevronRight: <Path d="M9 5l7 7-7 7" />,
  chevronDown: <Path d="M5 9l7 7 7-7" />,
  grid: (
    <>
      <Rect x={4} y={4} width={6.5} height={6.5} rx={2} />
      <Rect x={13.5} y={4} width={6.5} height={6.5} rx={2} />
      <Rect x={4} y={13.5} width={6.5} height={6.5} rx={2} />
      <Rect x={13.5} y={13.5} width={6.5} height={6.5} rx={2} />
    </>
  ),
  inbox: (
    <>
      <Path d="M4 13l2.5-7.5h11L20 13v5.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z" />
      <Path d="M4 13h4.5l1.5 2.5h4l1.5-2.5H20" />
    </>
  ),
  search: (
    <>
      <Circle cx={11} cy={11} r={6.5} />
      <Path d="M16 16l4.5 4.5" />
    </>
  ),
  wallet: (
    <>
      <Path d="M4 7.5v10A2.5 2.5 0 0 0 6.5 20H20V8H6.5A2.5 2.5 0 0 1 4 5.5 2.5 2.5 0 0 1 6.5 3H18v5" />
      <Path d="M16 14h.5" />
    </>
  ),
  plane: <Path d="M20.5 3.5L3.5 10.5l7 3 3 7zM10.5 13.5l10-10" />,
  gift: (
    <>
      <Rect x={4} y={9} width={16} height={4} rx={1} />
      <Path d="M5.5 13v6.5h13V13M12 9v10.5M12 9c-1-3-5-4-5-1.5S10 9 12 9zM12 9c1-3 5-4 5-1.5S14 9 12 9z" />
    </>
  ),
  book: <Path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5zM12 6v13.5" />,
  house: <Path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5h4v5" />,
  cap: <Path d="M3 9.5L12 5l9 4.5-9 4.5zM7 11.5V16c1.5 1.5 3.2 2 5 2s3.5-.5 5-2v-4.5M21 9.5V14" />,
  sliders: (
    <>
      <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <Circle cx={16} cy={7} r={2} />
      <Circle cx={10} cy={17} r={2} />
    </>
  ),
  trash: <Path d="M5 7h14M10 7V4.5h4V7M6.5 7l1 12.5h9l1-12.5M10.5 11v5M13.5 11v5" />,
  edit: <Path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  clock: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M12 7.5V12l3 2" />
    </>
  ),
  user: (
    <>
      <Circle cx={12} cy={8.5} r={3.5} />
      <Path d="M5 20c1-3.8 3.8-6 7-6s6 2.2 7 6" />
    </>
  ),
  sparkle: <Path d="M12 4c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6z" />,
  archive: (
    <>
      <Rect x={3.5} y={4.5} width={17} height={4.5} rx={1} />
      <Path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4" />
    </>
  ),
  pause: <Path d="M9 6v12M15 6v12" />,
  play: <Path d="M8 5.5v13l10-6.5z" />,
  arrowUp: <Path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <Path d="M12 5v14M6 13l6 6 6-6" />,
  note: <Path d="M6 3.5h9l3.5 3.5v13.5H6zM15 3.5V7h3.5M9 12h6M9 15.5h6" />,
  list: <Path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />,
  flame: null, // drawn filled below
} as const;

export type IconName = keyof typeof ICONS;

export const HABIT_ICONS: IconName[] = [
  'leaf', 'shoe', 'wind', 'book', 'moon', 'drop', 'bowl', 'heart', 'pill', 'sun', 'face', 'sparkle',
];

export function Icon({
  name,
  size = 24,
  color = colors.ink,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  if (name === 'flame') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          fill={colors.streak}
          d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4 2 1.2 3 3 3 4.6 1-1 1.4-2 1.4-3.2 2.4 1.8 4.2 4.2 4.2 7 0 3.2-2.4 5.6-6 5.6z"
        />
      </Svg>
    );
  }
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </Svg>
  );
}
