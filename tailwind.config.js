/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Hijau Utama SnapChef (Primary)
                'chef-green': '#4ADE80',
                // Hijau Tua untuk Text atau Hover (Secondary)
                'chef-dark-green': '#166534',
                // Warna Background Ringan (Soft Green/Gray)
                'chef-bg': '#F8FAFC',
                // Warna Accent untuk Text
                'chef-text': '#1E293B',
            },
            borderRadius: {
                'chef': '20px', // Kebulatan button & card di Figma kamu
            }
        },
    },
    plugins: [],
}