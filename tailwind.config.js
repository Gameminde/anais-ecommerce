/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// ANAIS Brand Colors
				'anais-taupe': '#C4AB93',
				'desert-sand': '#D4C4B0',
				'warm-greige': '#B8A99A',
				'antique-gold': '#D4AF37',
				'deep-plum': '#6B4E5D',
				'rose-blush': '#D4A5A5',
				'ivory-cream': '#F8F6F3',
				'warm-gray': '#8B7E74',
				'charcoal': '#3A3331',
				'success-green': '#7A9B76',
				'info-blue': '#7A8C9B',
				'alert-rose': '#B87B7B',
				
				// Shadcn compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#C4AB93', // ANAIS Taupe
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#D4C4B0', // Desert Sand
					foreground: '#3A3331',
				},
				accent: {
					DEFAULT: '#D4AF37', // Antique Gold
					foreground: '#FFFFFF',
				},
				destructive: {
					DEFAULT: '#B87B7B',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F8F6F3',
					foreground: '#8B7E74',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#3A3331',
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#3A3331',
				},
			},
			fontFamily: {
				display: ['Cormorant Garamond', 'serif'],
				body: ['Lato', 'sans-serif'],
				accent: ['Playfair Display', 'serif'],
			},
			fontSize: {
				'hero': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'h1': ['56px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				'h2': ['40px', { lineHeight: '1.3' }],
				'h3': ['32px', { lineHeight: '1.3' }],
				'h4': ['24px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
				'body-lg': ['18px', { lineHeight: '1.7' }],
				'body': ['16px', { lineHeight: '1.6' }],
				'small': ['14px', { lineHeight: '1.6' }],
				'label': ['12px', { lineHeight: '1.5', letterSpacing: '0.1em' }],
			},
			spacing: {
				'xs': '4px',
				'sm': '8px',
				'md': '12px',
				'base': '16px',
				'lg': '24px',
				'xl': '32px',
				'2xl': '48px',
				'3xl': '64px',
				'4xl': '96px',
				'5xl': '128px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}