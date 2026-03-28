import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "PoopedIn — Professional Poop Network",
  description:
    "The world's largest professional network for sharing your most impactful deliverables.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
