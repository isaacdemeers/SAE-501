'use client'

import Footer from "@/components/footer/footer";

export default function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}