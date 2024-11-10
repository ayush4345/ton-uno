import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UNO Game',
  description: 'A decentralized UNO game built on EVM chain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-bl min-h-screen from-[rgba(228,238,255,1)] via-[rgba(185,244,246,1)] to-[rgba(113,143,200,1)] ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}