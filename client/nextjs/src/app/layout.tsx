import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redis Shopping',
  description: 'Shop with the speed of Redis!',
  icons: ['/favicon.ico'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
      </body>
    </html>
  );
}