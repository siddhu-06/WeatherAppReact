import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
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
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10%)' }
        },
        sunRay: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' }
        },
        glow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        rainDrop: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(200%)', opacity: '0' }
        },
        snowFall: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateY(200%) translateX(20px)', opacity: '0' }
        },
        lightningFlash: {
          '0%, 100%': { opacity: '0' },
          '10%, 30%': { opacity: '1' },
          '20%, 40%, 60%': { opacity: '0' },
          '50%': { opacity: '1' }
        },
        fogDrift: {
          '0%': { transform: 'translateX(-10%)' },
          '50%': { transform: 'translateX(10%)' },
          '100%': { transform: 'translateX(-10%)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift-slow': 'drift 8s ease-in-out infinite',
        'sun-ray': 'sunRay 3s ease-in-out infinite',
        'glow-soft': 'glow 4s ease-in-out infinite',
        'rain-drop-1': 'rainDrop 1.5s linear infinite',
        'rain-drop-2': 'rainDrop 1.5s 0.3s linear infinite',
        'rain-drop-3': 'rainDrop 1.5s 0.6s linear infinite',
        'snow-fall-1': 'snowFall 5s linear infinite',
        'snow-fall-2': 'snowFall 5s 1s linear infinite',
        'snow-fall-3': 'snowFall 5s 2s linear infinite',
        'lightning-flash': 'lightningFlash 3s ease-in-out infinite',
        'fog-drift-1': 'fogDrift 10s ease-in-out infinite',
        'fog-drift-2': 'fogDrift 15s 2s ease-in-out infinite'
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
