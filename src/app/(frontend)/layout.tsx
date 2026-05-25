import type { Metadata } from 'next'

import { Fraunces, Newsreader } from 'next/font/google'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

/** Editorial fonts for Payload blocks (.payload-block-display / .payload-block-prose); loaded via next/font to avoid CSS @import ordering issues. */
const payloadDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-payload-display',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

const payloadSerif = Newsreader({
  subsets: ['latin'],
  variable: '--font-payload-serif',
  display: 'swap',
})

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        payloadDisplay.variable,
        payloadSerif.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
