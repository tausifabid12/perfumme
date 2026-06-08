import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {






  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}