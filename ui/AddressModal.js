"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useSelector } from "react-redux";

export function AddressModal({ isOpen, onClose }) {
  const { user } = useSelector((a) => a.auth);
  const id = user?.id;

  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    type: "Home",
    street: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (!id) return;

      try {
        console.log("API calling...");
        const res = await apiClient(`/address/user/${id}`);
        console.log("Address", res);

        if (res?.success) {
          setAddresses(res.data?.addresses || []);
        }
      } catch (err) {
        console.log("Address fetch error:", err);
      }
    };

    fetchAddress();
  }, [id]);

  const handleEdit = (addr) => {
    setFormData(addr);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      setAddresses(addresses.map((a) => (a.id === formData.id ? formData : a)));
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }
    setIsEditing(false);
    setFormData({ id: null, type: "Home", street: "", city: "", zip: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[1001]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-[90%] h-[90%] bg-white rounded-[2.5rem] shadow-2xl z-[1002] overflow-hidden flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                  <MapPin className="text-green-600" size={32} /> Saved
                  Addresses
                </h2>
                <p className="text-slate-500 mt-1">
                  Manage your delivery locations for faster checkout
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
              <div className="max-w-5xl mx-auto">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Address Card */}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50/30 transition-all group"
                    >
                      <div className="p-4 bg-slate-50 rounded-full group-hover:bg-green-100 transition-colors">
                        <Plus size={32} />
                      </div>
                      <span className="font-bold text-black">
                        Add New Address
                      </span>
                    </button>

                    {addresses.length === 0 ? (
                      <div className="col-span-full text-center py-20 text-slate-500">
                        <MapPin
                          size={40}
                          className="mx-auto mb-4 text-slate-300"
                        />
                        <p className="text-lg font-medium">
                          No saved addresses found
                        </p>
                        <p className="text-sm mt-2">
                          Add a new delivery location to continue checkout
                        </p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <motion.div
                          key={addr.id}
                          layout
                          className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden"
                        >
                          {addr.isDefault && (
                            <div className="absolute top-4 right-4 text-green-600 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">
                              <CheckCircle2 size={12} /> Default
                            </div>
                          )}
                          <div className="flex items-center gap-3 mb-4 text-slate-400">
                            {addr.type === "Home" ? (
                              <Home size={20} />
                            ) : (
                              <Briefcase size={20} />
                            )}
                            <span className="text-xs font-black uppercase tracking-widest">
                              {addr.type}
                            </span>
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed mb-6">
                            {addr.street}, {addr.city} - {addr.zip}
                          </p>

                          <div className="flex gap-2 pt-4 border-t border-slate-50">
                            <button
                              onClick={() => handleEdit(addr)}
                              className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(addr.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                ) : (
                  /* Edit / Add Form */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100"
                  >
                    <h3 className="text-xl font-bold mb-8 text-black">
                      {formData.id ? "Edit Address" : "New Delivery Location"}
                    </h3>
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="flex gap-4 mb-8">
                        {["Home", "Office", "Other"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, type: t })
                            }
                            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${formData.type === t ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 uppercase ml-2">
                          Full Address / Street
                        </label>
                        <textarea
                          required
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                          className="w-full p-4 bg-slate-50 text-black border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
                          placeholder="House No, Building, Area..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-900 uppercase ml-2">
                            City
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            className="w-full p-4 bg-slate-50 border-none  text-black rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-900 uppercase ml-2">
                            Zipcode
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.zip}
                            onChange={(e) =>
                              setFormData({ ...formData, zip: e.target.value })
                            }
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-black focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 pt-6">
                        <button
                          type="submit"
                          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
