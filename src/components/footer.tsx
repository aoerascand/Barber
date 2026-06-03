import { AtSign, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-700/70 bg-zinc-950/90 text-zinc-500">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">CDTBarber</p>
          <p className="text-sm text-zinc-500 mt-1">Premium booking and appointments for your best look.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <a
            href="https://www.instagram.com/cdtbarber"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-amber-500 hover:text-amber-300"
          >
            <AtSign className="w-4 h-4 text-amber-400" />
            Instagram
          </a>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-400 hover:text-emerald-300"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
