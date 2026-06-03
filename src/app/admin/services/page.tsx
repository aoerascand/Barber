"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { DEFAULT_SERVICE_CATEGORY, SERVICE_CATEGORIES, type ServiceCategory } from "@/lib/serviceCategories";

type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
};

const normalizeCategory = (value?: string | null): ServiceCategory => {
  if (value && SERVICE_CATEGORIES.includes(value as ServiceCategory)) {
    return value as ServiceCategory;
  }

  return DEFAULT_SERVICE_CATEGORY;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    category: ServiceCategory;
    price: string;
    duration: string;
  }>({
    name: "",
    category: DEFAULT_SERVICE_CATEGORY,
    price: "",
    duration: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (res.ok) setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/services/${editingId}` : "/api/services";
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
        setFormData({
          name: "",
          category: DEFAULT_SERVICE_CATEGORY,
          price: "",
          duration: "",
        });
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to save service", error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      category: normalizeCategory(service.category),
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) fetchServices();
    } catch (error) {
      console.error("Failed to delete service", error);
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: DEFAULT_SERVICE_CATEGORY,
      price: "",
      duration: "",
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Services</h1>
          <p className="text-zinc-400 mt-1">Manage the services offered by your barbershop.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            onClick={openNewForm}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-zinc-950 transition-all hover:bg-amber-400"
          >
            <Plus className="w-4 h-4" /> Add Service
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Service Name</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as ServiceCategory})}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Price (IDR)</label>
                <Input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Duration (Minutes)</label>
                <Input 
                  required
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
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

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-300 hover:bg-transparent">
              <TableHead className="text-zinc-800">Name</TableHead>
              <TableHead className="text-zinc-800">Category</TableHead>
              <TableHead className="text-zinc-800">Price</TableHead>
              <TableHead className="text-zinc-800">Duration</TableHead>
              <TableHead className="text-zinc-800 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Loading...</TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-300">No services found.</TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium text-zinc-800">{service.name}</TableCell>
                  <TableCell className="text-zinc-800">{service.category || DEFAULT_SERVICE_CATEGORY}</TableCell>
                  <TableCell className="text-zinc-800">Rp {service.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-zinc-800">{service.duration} mins</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)} className="text-zinc-400 hover:text-amber-500">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="text-zinc-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
