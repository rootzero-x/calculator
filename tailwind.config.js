/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ios-black': '#000000',
                'ios-dark-gray': '#333333',
                'ios-light-gray': '#a6a6a6',
                'ios-orange': '#ff9f0a',
                'ios-orange-active': '#d48407',
                'ios-light-gray-active': '#d9d9d9',
                'ios-dark-gray-active': '#737373',
            },
            fontFamily: {
                sans: ['SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
            },
            scale: {
                '95': '0.95',
            },
            transitionTimingFunction: {
                'ios-click': 'cubic-bezier(0.4, 0, 0.2, 1)',
            }
        },
    },
    plugins: [],
}
