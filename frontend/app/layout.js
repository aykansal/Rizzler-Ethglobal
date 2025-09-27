import "./globals.css";

export const metadata = {
  title: "Rizzler.in",
  description: "attract hoes like aura farmer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
