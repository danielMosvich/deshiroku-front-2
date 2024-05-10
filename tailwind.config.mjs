/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily:{
        ui:["Open Sans", "sans-serif"]
      },
      animation: {
        "card-squeleton": "reflect 2s linear infinite",
        "fade-up": "fade_up 1s cubic-bezier(0, 0.83, 0.43, 1.02)",
      },
      keyframes: {
        reflect: {
          "0%": {
            background:
              "linear-gradient(90deg, rgba(255,228,230,1) 0%, rgba(255,228,230,1) 20%, rgba(255,241,242,1) 50%, rgba(255,228,230,1) 80%, rgba(255,228,230,1) 100%)",
            backgroundSize: "400px",
            backgroundPosition: "100px",
          },
          "50%, 100%": {
            background:
              "linear-gradient(90deg, rgba(255,228,230,1) 0%, rgba(255,228,230,1) 20%, rgba(255,241,242,1) 50%, rgba(255,228,230,1) 80%, rgba(255,228,230,1) 100%)",
            backgroundSize: "700px",
            // backgroundPosition: "150px",
            backgroundPosition: "700px",
          },
        },
        fade_up: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0%)",
          },
        }
      },
    },
  },
  plugins: [],
};
