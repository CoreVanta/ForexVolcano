/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0e17', // Dark Blue/Black
                surface: '#111827', // Slightly lighter dark
                primary: '#10b981', // Green (Profit/Up)
                secondary: '#ef4444', // Red (Risk/Down)
                accent: '#f97316', // Orange (Volcano/Warning)
                text: '#f3f4f6', // Light gray/white text
                'text-muted': '#9ca3af',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Assuming Inter or system font
            },
        },
    },
    plugins: [],
}
