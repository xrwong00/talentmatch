"use client";

import { useState } from "react";
import DiscoverCareerModal from "./DiscoverCareerModal";

export default function HeroDiscoveryButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:scale-105"
      >
        Map Your 5-Year Career
      </button>
      <DiscoverCareerModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}


