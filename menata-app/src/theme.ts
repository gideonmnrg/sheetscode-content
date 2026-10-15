// Tokens taken from the Menata canvas, "Design system · Foundations".

export const colors = {
  navy: '#042751',
  teal: '#08A39E',
  tealSoft: '#7FCBC2',
  oat: '#F6F0E4',
  oatDeep: '#EDE5D6',
  paper: '#FFFCF6',
  ink: '#1F1D1A',
  ink2: '#5E574D',
  ink3: '#6E665A',
  line: '#E3D9C8',
  lineSoft: '#EFE7DA',
  chip: '#F3ECE0',
  // One pastel per area. Backgrounds only; text on them is always ink.
  lilac: '#E4DAF2',
  mint: '#D2ECE7',
  sky: '#D6E6F0',
  butter: '#F8E7A6',
  peach: '#FBDCC6',
  rose: '#F4D6D2',
  // Reserved roles.
  streak: '#E07A3A',
  brick: '#8A3B22',
};

export const fonts = {
  display: 'YoungSerif_400Regular',
  body: 'Nunito_600SemiBold',
  bodyRegular: 'Nunito_400Regular',
  bold: 'Nunito_700Bold',
  heavy: 'Nunito_800ExtraBold',
};

export const radius = {
  tile: 14,
  control: 20,
  card: 26,
  sheet: 32,
  pill: 999,
};

export const space = {
  gutter: 20,
  cardGap: 12,
  section: 30,
};

export const shadow = {
  raised: {
    shadowColor: '#4A3414',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#4A3414',
    shadowOpacity: 0.14,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

export type Pastel = 'lilac' | 'mint' | 'sky' | 'butter' | 'peach' | 'rose';
export const pastels: Pastel[] = ['lilac', 'mint', 'sky', 'butter', 'peach', 'rose'];
