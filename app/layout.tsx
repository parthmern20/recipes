import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ગર્ભાવસ્થા આરોગ્ય યોજના | Pregnancy Health Plan',
  description: 'Complete pregnancy health guide with 105 Gujarati recipes, meal plans, and baby development tracking for gestational diabetes and BP management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="gu">
      <body className="bg-gradient-to-br from-green-50 to-rose-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
