// src/utils/theme.ts

export const Colors = {
  background: '#F5EDE4',
  primary: '#3D1C02',
  accent: '#C8973A',
  ready: '#3A8F5C',
  preparing: '#E07B39',
  delete: '#C0392B',
  muted: '#8A6A5A',
  white: '#FFFFFF',
  card: '#FFFFFF',
  inputBg: '#F0E6DC',
  border: '#E5D5C5',
  textLight: '#FFFFFF',
  success: '#3A8F5C',
};

export const Fonts = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#3D1C02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const statusColors: Record<string, string> = {
  em_preparo: '#E07B39',
  pronto: '#3A8F5C',
  entregue: '#8A6A5A',
};

export const statusLabels: Record<string, string> = {
  em_preparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
}
