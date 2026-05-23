import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { 50:'#FDFCFA',100:'#F5F2ED',200:'#EDE9E3',300:'#E0DBD3',400:'#C8C2B8',500:'#9E9890',600:'#6B6660',700:'#3D3A36',800:'#26231F',900:'#1A1714' },
        forest: { 50:'#EFF5F2',100:'#D4E8DE',200:'#A8D1BB',300:'#72B394',400:'#3E8F6A',500:'#1A6B47',600:'#155539',700:'#0F3F2A',800:'#0A2A1C',DEFAULT:'#1A3A2A' },
        gold: { 300:'#E8C97A',400:'#D4AA4A',DEFAULT:'#C4974A',600:'#A87A32' },
      },
      fontFamily: {
        display: ['var(--font-playfair)','Georgia','serif'],
        body: ['var(--font-inter)','system-ui','sans-serif'],
        price: ['var(--font-dm-serif)','serif'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(26,20,12,0.08)',
        'card-hover': '0 16px 40px rgba(26,20,12,0.14)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: { from:{transform:'translateY(16px)',opacity:'0'}, to:{transform:'translateY(0)',opacity:'1'} },
        shimmer: { '0%,100%':{opacity:'1'}, '50%':{opacity:'0.6'} },
      },
    },
  },
  plugins: [],
}
export default config
