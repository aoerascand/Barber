"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Barber = {
  id: string;
  name: string;
  photo: string | null;
  specialty: string | null;
};

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", photo: "", specialty: "" });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const res = await fetch("/api/barbers");
      const data = await res.json();
      if (res.ok) setBarbers(data);
    } catch (error) {
      console.error("Failed to fetch barbers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/barbers/${editingId}` : "/api/barbers";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsOpen(false);
        setEditingId(null);
        setFormData({ name: "", photo: "", specialty: "" });
        fetchBarbers();
      }
    } catch (error) {
      console.error("Failed to save barber", error);
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingId(barber.id);
    setFormData({ 
      name: barber.name, 
      photo: barber.photo || "", 
      specialty: barber.specialty || "" 
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this barber?")) return;
    try {
      const res = await fetch(`/api/barbers/${id}`, { method: "DELETE" });
      if (res.ok) fetchBarbers();
    } catch (error) {
      console.error("Failed to delete barber", error);
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData({ name: "", photo: "", specialty: "" });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Barbers</h1>
          <p className="text-zinc-800 mt-1">Manage your team of professional barbers.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            onClick={openNewForm}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-zinc-950 transition-all hover:bg-amber-400"
          >
            <Plus className="w-4 h-4" /> Add Barber
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Barber" : "Add New Barber"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Name</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Specialty</label>
                <Input 
                  placeholder="e.g. Fades, Classic Cuts, Beards"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Photo URL</label>
                <Input 
                  placeholder="https://..."
                  value={formData.photo}
                  onChange={(e) => setFormData({...formData, photo: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading barbers...</div>
      ) : barbers.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-500">
          No barbers found. Add your first team member!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
              <div className="h-48 bg-zinc-950 flex items-center justify-center overflow-hidden">
                {barber.photo ? (
                  <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <User className="w-16 h-16 text-zinc-800" />
                )}
              </div>
              <CardContent className="p-5 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{barber.name}</h3>
                  <p className="text-amber-500 text-sm font-medium mt-1">{barber.specialty || "Barber"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(barber)} className="h-8 w-8 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(barber.id)} className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-zinc-800">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
