import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Team Tasks — 팀 일감 관리',
  description: '팀의 일감을 한눈에 관리하세요',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <TooltipProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
