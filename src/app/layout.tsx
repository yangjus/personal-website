import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const sans = localFont({ src: [
  { path: '../fonts/manrope-regular.ttf', weight: '400', style: 'normal' },
  { path: '../fonts/manrope-bold.ttf', weight: '700', style: 'normal' },
], variable: '--font-manrope', display: 'swap' });
const display = localFont({ src: '../fonts/space-grotesk.ttf', variable: '--font-display', weight: '500', display: 'swap' });
export const metadata: Metadata = {
  title: 'Justin Yang — Full-Stack Engineer & Product Builder',
  description: 'Justin Yang is a full-stack engineer at Amazon, based in New York. See his work in backend services, web and mobile apps, and side projects.',
  openGraph: { title: 'Justin Yang — Full-Stack Engineer & Product Builder', description: 'I’m a full-stack engineer, mostly on the backend. I like building apps and seeing people use them.', type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#090909' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${display.variable}`}><body>{children}</body></html>;
}
