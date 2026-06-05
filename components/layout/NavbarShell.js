"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import NavbarFallback from "./NavbarFallback";

const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading: () => <NavbarFallback />,
});

export default function NavbarShell() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <Navbar />
    </Suspense>
  );
}
