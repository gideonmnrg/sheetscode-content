import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack } from '../lib/nav';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts, radius, shadow, space, type Pastel } from '../theme';
import { Icon, type IconName } from './Icon';
import { addDays, relativeDay, today } from '../lib/format';

// ---------- Text ----------

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption' | 'eyebrow';

const variantStyle: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.display, fontSize: 36, lineHeight: 40, letterSpacing: -0.4 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.display, fontSize: 21, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23 },
  label: { fontFamily: fonts.heavy, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  eyebrow: { fontFamily: fonts.heavy, fontSize: 12, lineHeight: 16, letterSpacing: 0.7, color: colors.ink3 },
};

export function T({
  v = 'body',
  color,
  style,
  children,
  ...rest
}: TextProps & { v?: Variant; color?: string; children: ReactNode }) {
  return (
    <Text style={[{ color: colors.ink }, variantStyle[v], color ? { color } : null, style]} {...rest}>
      {v === 'eyebrow' && typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  );
}

export function Wordmark({ size = 28, onNavy = false }: { size?: number; onNavy?: boolean }) {
  const base = onNavy ? colors.paper : colors.navy;
  const accent = onNavy ? colors.tealSoft : colors.teal;
  return (
    <Text style={{ fontFamily: fonts.heavy, fontSize: size, letterSpacing: -size * 0.03, color: base }}>
      me<Text style={{ color: accent }}>n</Text>ata
    </Text>
  );
}

// ---------- Layout ----------

export function Screen({
  children,
  header,
  footer,
  scroll = true,
  padBottom = 40,
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  padBottom?: number;
}) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: space.gutter, paddingBottom: padBottom, gap: space.cardGap }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, paddingHorizontal: space.gutter }}>{children}</View>
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.oat, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {header}
      {body}
      {footer ? (
        <View
          style={{
            paddingHorizontal: space.gutter,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: colors.oat,
            borderTopWidth: 1,
            borderTopColor: colors.lineSoft,
            gap: 10,
          }}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export function Header({
  title,
  eyebrow,
  back = true,
  right,
  onBack,
}: {
  title?: string;
  eyebrow?: string;
  back?: boolean;
  right?: ReactNode;
  onBack?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
        {back ? (
          <IconButton
            icon="chevronLeft"
            label="Back"
            onPress={onBack ?? goBack}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          {eyebrow ? <T v="eyebrow">{eyebrow}</T> : null}
          {title ? (
            <T v="heading" numberOfLines={1}>
              {title}
            </T>
          ) : null}
        </View>
      </View>
      {right ? <View style={{ flexDirection: 'row', gap: 6 }}>{right}</View> : null}
    </View>
  );
}

export function Card({
  children,
  tone,
  onPress,
  style,
  accessibilityLabel,
}: {
  children: ReactNode;
  tone?: Pastel | 'navy' | 'paper' | 'chip';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const bg = tone === undefined || tone === 'paper' ? colors.paper : colors[tone];
  const cardStyle = [styles.card, { backgroundColor: bg }, style];
  if (!onPress) return <View style={cardStyle}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [cardStyle, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
    >
      {children}
    </Pressable>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <T v="heading">{title}</T>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button">
          <T v="label" color={colors.teal}>
            {action}
          </T>
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------- Controls ----------

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'danger' | 'teal';

export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: ButtonKind;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const palette: Record<ButtonKind, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.navy, fg: colors.paper },
    teal: { bg: colors.teal, fg: colors.navy },
    secondary: { bg: colors.paper, fg: colors.navy, border: colors.line },
    ghost: { bg: 'transparent', fg: colors.navy },
    danger: { bg: colors.chip, fg: colors.brick },
  };
  const p = palette[kind];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!(disabled || loading) }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: p.bg, borderColor: p.border ?? p.bg, borderWidth: p.border ? 1 : 0 },
        (disabled || loading) && { opacity: 0.45 },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={p.fg} /> : icon ? <Icon name={icon} size={20} color={p.fg} /> : null}
      <T v="label" color={p.fg}>
        {title}
      </T>
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  tone = 'paper',
  color = colors.ink,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: 'paper' | 'chip' | 'navy' | 'clear';
  color?: string;
}) {
  const bg = tone === 'clear' ? 'transparent' : colors[tone];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: bg }, pressed && { opacity: 0.7 }]}
    >
      <Icon name={icon} size={22} color={tone === 'navy' ? colors.paper : color} />
    </Pressable>
  );
}

export function Field({
  label,
  error,
  hint,
  style,
  ...input
}: TextInputProps & { label: string; error?: string | null; hint?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T v="label">{label}</T>
      <TextInput
        placeholderTextColor={colors.ink3}
        accessibilityLabel={label}
        style={[
          styles.input,
          input.multiline && { minHeight: 110, textAlignVertical: 'top', paddingTop: 14 },
          error ? { borderColor: colors.brick, borderWidth: 1.5 } : null,
          style,
        ]}
        {...input}
      />
      {error ? (
        <T v="caption" color={colors.brick}>
          {error}
        </T>
      ) : hint ? (
        <T v="caption">{hint}</T>
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
  tone,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  tone?: Pastel;
}) {
  const bg = selected ? colors.navy : tone ? colors[tone] : colors.paper;
  const fg = selected ? colors.paper : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderColor: selected ? colors.navy : colors.line },
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      <T v="label" color={fg} style={{ fontSize: 14 }}>
        {label}
      </T>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>;
}

export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.segment, on && { backgroundColor: colors.paper, ...shadow.raised }]}
          >
            <T v="label" color={on ? colors.navy : colors.ink2} style={{ fontSize: 14 }}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <IconButton icon="minus" label={`Less ${label}`} tone="chip" onPress={() => onChange(Math.max(min, value - 1))} />
      <T v="title" style={{ minWidth: 36, textAlign: 'center' }}>
        {value}
      </T>
      <IconButton icon="plus" label={`More ${label}`} tone="chip" onPress={() => onChange(Math.min(max, value + 1))} />
    </View>
  );
}

export function DateStepper({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const t = today();
  return (
    <View style={styles.dateStepper}>
      <IconButton icon="chevronLeft" label="Previous day" tone="clear" onPress={() => onChange(addDays(value, -1))} />
      <Pressable onPress={() => onChange(t)} accessibilityRole="button" accessibilityLabel="Jump to today" style={{ flex: 1 }}>
        <T v="label" style={{ textAlign: 'center' }}>
          {relativeDay(value)}
        </T>
        {value !== t ? (
          <T v="caption" style={{ textAlign: 'center' }}>
            Tap for today
          </T>
        ) : null}
      </Pressable>
      <IconButton icon="chevronRight" label="Next day" tone="clear" onPress={() => onChange(addDays(value, 1))} />
    </View>
  );
}

// ---------- Display ----------

export function IconTile({ icon, tone = 'butter', size = 44 }: { icon: IconName; tone?: Pastel | 'chip'; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.tile,
        backgroundColor: colors[tone],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={size * 0.52} />
    </View>
  );
}

export function Row({
  icon,
  tone,
  title,
  subtitle,
  right,
  onPress,
  leading,
  muted,
}: {
  icon?: IconName;
  tone?: Pastel | 'chip';
  title: string;
  subtitle?: string | null;
  right?: ReactNode;
  onPress?: () => void;
  leading?: ReactNode;
  muted?: boolean;
}) {
  const content = (
    <>
      {leading ?? (icon ? <IconTile icon={icon} tone={tone} /> : null)}
      <View style={{ flex: 1, gap: 2 }}>
        <T
          v="label"
          numberOfLines={2}
          color={muted ? colors.ink2 : undefined}
          style={muted ? { textDecorationLine: 'line-through' } : undefined}
        >
          {title}
        </T>
        {subtitle ? (
          <T v="caption" numberOfLines={2}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right}
    </>
  );
  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      {content}
    </Pressable>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.lineSoft, marginVertical: 2 }} />;
}

export function ProgressBar({ value, color = colors.teal, track = colors.chip }: { value: number; color?: string; track?: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ height: 10, borderRadius: 5, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 5, backgroundColor: color }} />
    </View>
  );
}

export function Ring({
  value,
  size = 64,
  stroke = 7,
  color = colors.teal,
  track = colors.chip,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

export function Empty({
  icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: IconName;
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 28 }}>
      <IconTile icon={icon} tone="chip" size={56} />
      <T v="heading" style={{ textAlign: 'center' }}>
        {title}
      </T>
      <T v="body" color={colors.ink2} style={{ textAlign: 'center' }}>
        {text}
      </T>
      {action && onAction ? <Button title={action} onPress={onAction} icon="plus" style={{ marginTop: 6 }} /> : null}
    </Card>
  );
}

export function Loading() {
  return (
    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
      <ActivityIndicator color={colors.teal} />
    </View>
  );
}

/** Destructive actions always ask first, in plain words. */
export function confirmDestructive(title: string, message: string, action: string, onConfirm: () => void) {
  Alert.alert(title, message, [
    { text: 'Keep it', style: 'cancel' },
    { text: action, style: 'destructive', onPress: onConfirm },
  ]);
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
  },
  card: {
    borderRadius: radius.card,
    padding: 18,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 2,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.control,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    minHeight: 52,
    borderRadius: radius.control,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
  chip: {
    minHeight: 40,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.chip,
    borderRadius: radius.control,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 56,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingVertical: 6,
  },
});
