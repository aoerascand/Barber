"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Scissors, User, Calendar, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { DEFAULT_SERVICE_CATEGORY } from "@/lib/serviceCategories";

type Barber = { id: string; name: string; photo: string | null; specialty: string | null };
type Service = { id: string; name: string; category: string | null; price: number; duration: number };

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const normalizeArray = <T,>(value: unknown): T[] => {
    return Array.isArray(value) ? (value as T[]) : [];
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/barbers").then(res => res.json()),
      fetch("/api/services").then(res => res.json())
    ]).then(([barbersData, servicesData]) => {
      setBarbers(normalizeArray<Barber>(barbersData));
      setServices(normalizeArray<Service>(servicesData));
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(services.map((service) => service.category || DEFAULT_SERVICE_CATEGORY)))];
  const filteredServices = selectedCategory === "All"
    ? services
    : services.filter((service) => (service.category || DEFAULT_SERVICE_CATEGORY) === selectedCategory);

  const handleBooking = async () => {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: selectedBarber.id,
          serviceId: selectedService.id,
          bookingDate: selectedDate,
          bookingTime: selectedTime
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        if (res.status === 401) {
          alert("Please sign in to book an appointment.");
          router.push("/login");
        } else {
          alert("Failed to create booking.");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <Navbar />
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-center py-12 px-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-zinc-400 mb-8">
            Your appointment with {selectedBarber?.name} for a {selectedService?.name} is successfully requested. Please wait for admin approval.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="bg-amber-500 text-zinc-950 hover:bg-amber-400 w-full">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Button 
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="mb-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            ← Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Book Your Appointment</h1>
            <p className="text-zinc-400">Select your preferences below to schedule your premium grooming session.</p>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                  {num}
                </div>
                {num < 3 && <div className={`w-12 h-0.5 ${step > num ? 'bg-amber-500' : 'bg-zinc-800'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"><User className="text-amber-500" /> Choose Your Barber</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {barbers.map((barber) => (
                <Card 
                  key={barber.id} 
                  className={`bg-zinc-900 border-2 cursor-pointer transition-all hover:scale-[1.02] ${selectedBarber?.id === barber.id ? 'border-amber-500' : 'border-zinc-800 hover:border-zinc-700'}`}
                  onClick={() => setSelectedBarber(barber)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-zinc-950 overflow-hidden mb-4 border border-zinc-800">
                      {barber.photo ? (
                        <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-zinc-700" /></div>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-lg">{barber.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{barber.specialty || "Professional Barber"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedBarber}
                className="bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"><Scissors className="text-amber-500" /> Choose Service</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-amber-500 text-zinc-950"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <Card 
                  key={service.id} 
                  className={`bg-zinc-900 border-2 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-amber-500' : 'border-zinc-800 hover:border-zinc-700'}`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-6 flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{service.name}</h3>
                      <div className="mt-2 inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                        {service.category || DEFAULT_SERVICE_CATEGORY}
                      </div>
                      <p className="text-zinc-500 text-sm mt-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration} mins</p>
                    </div>
                    <div className="text-amber-500 font-bold text-xl shrink-0">
                      Rp {service.price.toLocaleString('id-ID')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredServices.length === 0 && (
              <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/60 px-4 py-10 text-center text-zinc-400">
                Tidak ada layanan untuk kategori ini.
              </div>
            )}
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!selectedService}
                className="bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"><Calendar className="text-amber-500" /> Choose Date & Time</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-zinc-500 mb-4 font-medium">Select Date</h3>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white h-12 px-4 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <h3 className="text-zinc-300 mb-4 font-medium">Select Time</h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`h-12 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === time 
                          ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-zinc-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <h4 className="text-white font-bold text-lg">Booking Summary</h4>
                <p className="text-zinc-400 text-sm mt-1">
                  <span className="text-amber-300 font-medium">{selectedService?.category || DEFAULT_SERVICE_CATEGORY}</span><br />
                  {selectedService?.name} with {selectedBarber?.name} <br/>
                  {selectedDate && selectedTime ? `${selectedDate} at ${selectedTime}` : 'Date & Time not selected'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-500 mb-2">Rp {selectedService?.price?.toLocaleString('id-ID')}</div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    Back
                  </Button>
                  <Button 
                    onClick={handleBooking} 
                    disabled={!selectedDate || !selectedTime || isSubmitting}
                    className="bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold px-8 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
