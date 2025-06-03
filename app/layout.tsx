import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zero Waste Kitchen - Kelola Limbah Dapur dengan Cerdas",
  description:
    "Platform edukasi untuk mengurangi limbah dapur, membuat resep dari bahan sisa, dan tips komposting. Bergabunglah dengan gerakan zero waste untuk masa depan yang berkelanjutan.",
  keywords: "zero waste, limbah dapur, food waste, komposting, resep sisa makanan, daur ulang, berkelanjutan",
  authors: [{ name: "Zero Waste Kitchen Team" }],
  creator: "Zero Waste Kitchen",
  publisher: "Zero Waste Kitchen",
  robots: "index, follow",
  openGraph: {
    title: "Zero Waste Kitchen - Kelola Limbah Dapur dengan Cerdas",
    description: "Platform edukasi untuk mengurangi limbah dapur dan menciptakan gaya hidup berkelanjutan",
    url: "https://zerowastekitchen.com",
    siteName: "Zero Waste Kitchen",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zero Waste Kitchen - Sustainable Food Management",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero Waste Kitchen - Kelola Limbah Dapur dengan Cerdas",
    description: "Platform edukasi untuk mengurangi limbah dapur dan menciptakan gaya hidup berkelanjutan",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#16a34a",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
