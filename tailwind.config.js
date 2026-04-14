/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        /* Brand */
        brand: {
          DEFAULT: '#3CA4AC',
          dark: '#2D3E50',
          navy: '#0D1B2A',
          orange: '#F97316',
        },
        /* Legacy shorthand aliases */
        aqua: '#3CA4AC',
        dark: '#2D3E50',
        /* Surfaces */
        page: '#F7F8FA',
        card: '#FFFFFF',
        subtle: '#F1F5F9',
        soft: '#EEF6F7',
        'input-bg': '#F9FBFC',
        /* Borders */
        'border-default': '#E2E8F0',
        'border-strong': '#CBD5E1',
        'border-brand': '#B4DDE1',
        /* Text */
        'text-primary': '#2D3E50',
        'text-secondary': '#64748B',
        'text-muted': '#94A3B8',
        /* Status */
        'status-success': '#16A34A',
        'status-success-bg': '#DCFCE7',
        'status-success-text': '#166534',
        'status-warning': '#CA8A04',
        'status-warning-bg': '#FEF3C7',
        'status-warning-text': '#9A6700',
        'status-danger': '#DC2626',
        'status-danger-bg': '#FEE2E2',
        'status-danger-text': '#B91C1C',
        'status-info': '#3CA4AC',
        'status-info-bg': '#E0F4F6',
        'status-info-text': '#1A6D74',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans'],
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '22px',
      },
      spacing: {
        /* compact-premium extras */
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
      },
    },
  },
  plugins: [],
};
