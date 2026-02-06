/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Shadcn/UI colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        // UOS Judo custom theme colors
        theme: {
          primary: "var(--color-theme-primary)",
          bg: "var(--color-theme-bg)",
          text: "var(--color-theme-text)",
          accent: "var(--color-theme-accent)",
          black: "var(--color-theme-black)",
          grey: "var(--color-theme-grey)",
          "light-grey": "var(--color-theme-light-grey)",
          "dark-grey": "var(--color-theme-dark-grey)",
          yellow: "var(--color-theme-yellow)",
          pink: "var(--color-theme-pink)",
          white: "var(--color-theme-white)",
        },
      },
      fontSize: {
        // UOS Judo custom font sizes
        "theme-title": "var(--font-size-theme-title)",
        "theme-subtitle": "var(--font-size-theme-subtitle)",
        "theme-description": "var(--font-size-theme-description)",
        "theme-default": "var(--font-size-theme-default)",
        "theme-tiny": "var(--font-size-theme-tiny)",
      },
      lineHeight: {
        // UOS Judo custom line heights
        "theme-title": "var(--line-height-theme-title)",
        "theme-subtitle": "var(--line-height-theme-subtitle)",
        "theme-description": "var(--line-height-theme-description)",
        "theme-default": "var(--line-height-theme-default)",
        "theme-tiny": "var(--line-height-theme-tiny)",
      },
      screens: {
        // Custom breakpoints matching existing MediaLayout
        xs: "340px",
        sm: "560px",
        md: "860px",
        lg: "1200px",
      },
      keyframes: {
        fadeIn: {
          from: { transform: "scale(0)" },
          to: { transform: "scale(1.0)" },
        },
        fadeOut: {
          from: { transform: "scale(1.0)" },
          to: { transform: "scale(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-in forwards",
        fadeOut: "fadeOut 0.25s ease-in forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
