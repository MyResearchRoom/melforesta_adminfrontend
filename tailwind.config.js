/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary :'#CA8A04',
        // background:'#6395EE',
        // textPrimary:'#787590',
        // heroPrimary:'#dbecf0',

        background: '#FFF7CC',    
        textPrimary: '#92400E',    
        heroPrimary: '#FEF3C7', 
      },
      backgroundImage: {
        // 'custom-gradient1': 'linear-gradient(to top right, #2E2EB3, #163636)',
        // 'custom-gradient2': 'linear-gradient(to top right, #5C5CE6, #2E6B6B)',
        // 'custom-gradient1-hover': 'linear-gradient(to top right, #1F1F8A, #0F2424)',
        // 'custom-gradient2-hover': 'linear-gradient(to top right, #4747B4, #204F4F)',

        'custom-gradient1': 'linear-gradient(to top right, #CA8A04, #92400E)',
        'custom-gradient2': 'linear-gradient(to top right, #EAB308, #B45309)',
        'custom-gradient1-hover': 'linear-gradient(to top right, #A16207, #78350F)',
        'custom-gradient2-hover': 'linear-gradient(to top right, #CA8A04, #92400E)',

      },
    },
  },
  plugins: [],
}