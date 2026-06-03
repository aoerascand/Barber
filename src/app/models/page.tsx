import Link from "next/link";
import { ArrowRight, Sparkles, Scissors, Clock3 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const hairstyleModels = [
  {
    title: "Textured Crop",
    description: "Gaya rapi dan modern dengan tekstur ringan yang cocok untuk keseharian.",
    image: "/models/textured-crop.svg",
    vibe: "Best Seller",
    time: "45 min",
  },
  {
    title: "Slick Back",
    description: "Tampilan bersih, glossy, dan tetap elegan untuk acara formal atau workday.",
    image: "/models/slick-back.svg",
    vibe: "Premium",
    time: "60 min",
  },
  {
    title: "Layered Fade",
    description: "Fade dengan lapisan terstruktur untuk tampilan lebih edgy dan fresh.",
    image: "/models/layered-fade.svg",
    vibe: "Trending",
    time: "60 min",
  },
  {
    title: "Classic Pompadour",
    description: "Aksen klasik yang cocok untuk kamu yang ingin tampil percaya diri dan timeless.",
    image: "/models/classic-pompadour.svg",
    vibe: "Classic",
    time: "75 min",
  },
];

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">
                <Sparkles className="w-4 h-4" />
                Koleksi model rambut terbaru
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white leading-tight">
                Temukan model rambut yang cocok untuk <span className="text-amber-400">gaya kamu</span>.
              </h1>
              <p className="mt-5 text-lg text-zinc-300 leading-relaxed max-w-2xl">
                Jelajahi inspirasi rambut secara visual sebelum booking. Setiap model dibuat untuk membantu customer memilih gaya yang paling sesuai dengan karakter dan kebutuhan sehari-hari.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/">
                  <Button variant="outline" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800">
                    Kembali ke beranda
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Model pilihan", value: "4+" },
                  { label: "Waktu styling", value: "45-75 min" },
                  { label: "Konsultasi", value: "Gratis" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3">
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-sm text-zinc-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Tips cepat</p>
                  <p className="text-sm text-zinc-400">Pilih model yang sesuai dengan bentuk wajah dan gaya hidup kamu.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Textured Crop cocok untuk tampilan fresh dan praktis.",
                  "Slick Back memberi kesan rapi dan premium.",
                  "Layered Fade ideal untuk styling yang lebih modern.",
                  "Classic Pompadour cocok untuk acara formal dan tampilan klasik.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <p className="text-sm text-zinc-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-amber-300 font-semibold uppercase tracking-[0.2em]">Gallery</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Contoh model rambut favorit customer</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Clock3 className="w-4 h-4 text-amber-300" />
                <span>Waktu styling dapat disesuaikan di booking</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {hairstyleModels.map((model) => (
                <Card key={model.title} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.title}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-amber-300">{model.vibe}</p>
                        <h3 className="mt-2 text-xl font-bold text-white">{model.title}</h3>
                      </div>
                      <span className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-200">{model.time}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">{model.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
