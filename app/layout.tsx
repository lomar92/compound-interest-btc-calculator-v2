import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bitcoin & ETF Retirement Calculator',
  description: 'Calculate your retirement portfolio with Bitcoin and ETF investments',
  icons: {
    icon: '/img/btc.png',               // Standard-Favicon
    shortcut: '/img/btc-16x16.png',     // Shortcut-Favicon
    apple: '/img/btc.png',              // iOS-Icon
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/img/btc.png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
