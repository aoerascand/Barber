import Link from "next/link";
import { Sparkles, Scissors } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-500/50 bg-zinc-600/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors border border-zinc-700 group-hover:border-amber-500/50">
            <Scissors className="w-4 h-4 text-zinc-100 group-hover:text-amber-500 transition-colors" />
          </div>
          <span className="font-bold text-lg text-zinc-100 tracking-tight">CDT<span className="text-amber-500">Barber</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/models"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm font-semibold text-zinc-100 transition hover:border-amber-500/50 hover:text-amber-300"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Model Rambut
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-950 hover:text-white hover:bg-zinc-300">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
