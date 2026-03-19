import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { DashboardProvider } from '@/context/DashboardContext'
import { AgentProvider } from '@/context/AgentContext'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PulseAI - Gamified Health Coaching',
  description: 'Your personal AI health and fitness coach with gamified workouts',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#3d1a7a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans antialiased">
        <OnboardingProvider>
          <DashboardProvider>
            <AgentProvider>
              {children}
            </AgentProvider>
          </DashboardProvider>
        </OnboardingProvider>
        <Analytics />
      </body>
    </html>
  )
}
