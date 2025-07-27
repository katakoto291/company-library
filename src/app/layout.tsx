import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import NavigationBar from '@/app/navigationBar'

import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'company-library',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="w-screen">
        <header>
          <NavigationBar />
        </header>

        <main className="max-w-7xl mx-4 mt-8">{children}</main>

        <footer className="mt-10" />
      </body>
    </html>
  )
}
