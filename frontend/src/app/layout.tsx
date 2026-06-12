import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'LgitLai — GitHub Repository Analyzer',
  description:
    'Understand any GitHub repository in seconds. Get architecture insights, code quality reports, security findings, documentation, and interactive codebase chat — all from one tool.',
  keywords: ['github analyzer', 'code review', 'security scan', 'repository analysis', 'repo insights'],
  authors: [{ name: 'labdouszlai' }],
  openGraph: {
    title: 'LgitLai — GitHub Repository Analyzer',
    description: 'Paste a GitHub URL and get instant architecture, code quality, security, and docs.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('lgitlai-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50 antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
