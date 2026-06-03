import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Clock, Scissors, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-amber-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-zinc-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>Premium Grooming Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              Masterful Cuts. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Impeccable Style.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
              Experience the pinnacle of men's grooming. Book your appointment effortlessly and enjoy a tailored haircut in a luxurious atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button className="w-full sm:w-auto h-14 px-8 bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-105">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/#services">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-zinc-300 text-zinc-300 hover:text-white hover:bg-zinc-400 font-semibold text-lg rounded-xl transition-all">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services Preview */}
      <section id="services" className="py-20 bg-zinc-900/50 border-t border-zinc-800/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose LuxeBarber?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We combine traditional barbering techniques with modern styling to give you the perfect look.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="w-8 h-8 text-amber-500" />,
                title: "Expert Barbers",
                desc: "Our team of highly trained professionals guarantees a flawless cut every single time."
              },
              {
                icon: <Clock className="w-8 h-8 text-amber-500" />,
                title: "Zero Waiting Time",
                desc: "Book your exact slot online and get seated immediately when you arrive."
              },
              {
                icon: <Star className="w-8 h-8 text-amber-500" />,
                title: "Premium Products",
                desc: "We exclusively use top-tier styling products to protect and nourish your hair."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-colors group">
                <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-10 shadow-[0_0_60px_rgba(15,23,42,0.4)]">
              <span className="text-amber-500 uppercase text-xs tracking-[0.3em] font-semibold">How it works</span>
              <h3 className="text-3xl font-bold text-white mt-4 max-w-xl">Easy booking in 3 simple steps</h3>
              <p className="text-zinc-400 mt-4 max-w-xl">From choosing your preferred barber to confirming your appointment, everything happens in one seamless flow.</p>

              <div className="mt-10 space-y-6">
                {[
                  { title: "Choose your service", desc: "Pick the treatment that fits your style and schedule.", step: "01" },
                  { title: "Select date & barber", desc: "Choose an available slot and preferred barber with just a few clicks.", step: "02" },
                  { title: "Relax and enjoy", desc: "Arrive at the salon ready to enjoy a premium grooming experience.", step: "03" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-300 font-bold text-lg">{item.step}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <p className="text-zinc-400 mt-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-10">
              <h3 className="text-3xl font-bold text-white">Popular customer favorites</h3>
              <p className="text-zinc-400 mt-4">Handpicked grooming packages customers love most.</p>

              <div className="mt-8 space-y-4">
                {[
                  { name: "Classic Cut & Style", price: "Rp 120.000", perks: ["Precision cut", "Hot towel finish", "Styling product"] },
                  { name: "Beard Grooming", price: "Rp 90.000", perks: ["Beard trim", "Line shaping", "Soothing balm"] },
                  { name: "Executive Spa", price: "Rp 180.000", perks: ["Hair wash", "Scalp massage", "Hair styling"] },
                ].map((item) => (
                  <div key={item.name} className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-semibold text-white">{item.name}</h4>
                        <p className="text-zinc-400 mt-1">{item.price}</p>
                      </div>
                      <div className="rounded-3xl bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">Best seller</div>
                    </div>
                    <ul className="mt-4 space-y-2 text-zinc-400 text-sm">
                      {item.perks.map((perk) => (
                        <li key={perk}>• {perk}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
