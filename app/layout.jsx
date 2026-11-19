import "./globals.css";

export const metadata = {
  title: "Mission: PS5 Pro — Help Dhruva",
  description: "Join the family mission. Play, then power up with UPI.",
  openGraph: {
    title: "Mission: PS5 Pro — Help Dhruva",
    description: "Join the family mission. Play, then power up with UPI.",
    images: ["/ps5pro.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070b1a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
