import Image from "next/image";

import geniusLogo from "@genius-sports/gs-marketing-ui/assets/logos/genius_logo.svg?url";

export function Header() {
  return (
    <header className="relative flex items-center border-b border-slate-200 bg-white px-6 py-5">
      <Image src={geniusLogo} alt="Genius Sports" width={90} height={15} style={{ height: "auto" }} priority />
      <h1
        className="absolute left-1/2 -translate-x-1/2 font-heading text-3xl font-semibold text-slate-900 md:text-4xl"
        style={{ fontFamily: "ESKlarheitKurrentTRIAL, system-ui, sans-serif" }}
      >
        WPP x Genius Intelligence
      </h1>
    </header>
  );
}
