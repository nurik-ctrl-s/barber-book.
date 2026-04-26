import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: 'BarberBook — Премиальные мужские стрижки', 
  description: 'Запишитесь к лучшим мастерам города онлайн. Стрижки, бритье и уход.',
  icons: {
    icon: '/apple-icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background">
      <body className={`${geist.className} ${geistMono.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}