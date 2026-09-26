export const colors = {
  bg: '#02061f',
  navy900: '#00072e',
  navy800: '#000B4A',
  navy700: '#0A176E',
  navy: '#00095A',
  periwinkle: '#899FFE',
  blue: '#2563EB',
  green: '#16A34A',
  greenSoft: '#34D399',
  amber: '#F59E0B',
  amberSoft: '#FCD34D',
  red: '#DC2626',
  redSoft: '#F87171',
  white: '#FFFFFF',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.6)',
  textFaint: 'rgba(255,255,255,0.4)',
  card: 'rgba(255,255,255,0.06)',
  cardStrong: 'rgba(255,255,255,0.1)',
  border: 'rgba(255,255,255,0.1)',
}

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 }

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }

export function scoreColor(value: number) {
  if (value >= 85) return colors.green
  if (value >= 70) return colors.amber
  return colors.red
}
