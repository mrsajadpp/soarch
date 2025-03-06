import type { Metadata } from 'next'
import HomePage from './components/HomePage'

export const metadata: Metadata = {
  title: 'VerifEye - AI-Powered News Fact Checking Tool',
  description: 'Instant fact-checking for Malayalam and Indian news using advanced AI. Verify news authenticity, detect fake news, and get accurate information analysis for Malayalam news, Indian media, and more.',
  keywords: 'malayalam news fact checking, news fact checking, indian ai, fake news detection, news verification tool, malayalam news verification, indian news fact checker',
  openGraph: {
    title: 'VerifEye - AI News Fact Checking',
    description: 'Instant fact-checking for Malayalam and Indian news using advanced AI technology.',
    images: ['/og-image.png'],
    url: 'https://verifeye.grovixlab.com/',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@grovixlab',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function Page() {
  return <HomePage />
}
