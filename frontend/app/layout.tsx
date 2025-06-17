import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Header';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "../components/AuthContext";

export const metadata: Metadata = {
  title: 'MedConnect - Professional Networking for Medical Professionals',
  description: 'MedConnect is a professional networking platform exclusively for medical professionals. Connect, collaborate, and grow your medical career.',
  generator: 'v0.dev',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TooltipProvider>
            <Header />
            <div style={{ paddingTop: '64px' }}>{children}</div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
