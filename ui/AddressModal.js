"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Plus,
  Trash2,
  Check,
  Phone,
  Home,
  Briefcase,
  Navigation,
  ArrowLeft,
  Save,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export function AddressModal({
  isOpen,
  onClose,
  addresses = [],
  onAddAddress,
  onSelectAddress,
  selectedAddressId,
}) {
  const { user } = useSelector((a) => a.auth);
  const [view, setView] = useState("list"); 
  const [selectedId, setSelectedId] = useState(selectedAddressId);
  const [zipcodes, setZipcodes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    user_id: user?.id || user?._id,
    city_id: "",
    area_id: "",
    name: "",
    mobile: "",
    address: "",
    pincode: "",
    state: "Maharashtra",
    is_default: false,
    type: "home",
    alternate_mobile: "",
    landmark: "",
    country: "India",
    country_code: 91,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      const fetchZipcode = async () => {
        try {
          const res = await apiClient("/zipCode");
          if (res?.success) setZipcodes(res.zipcodes);
        } catch (err) {
          console.error("Zip fetch error", err);
        }
      };
      fetchZipcode();
      setView("list");
      setSelectedId(selectedAddressId || null);
    }
  }, [isOpen, selectedAddressId]);

  const fetchAreasByCity = async (cityId) => {
    try {
      const res = await apiClient(`/area/city/${cityId}`);

      if (res?.success) {
        setAreas(res.data?.areas || []);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "city_id") {
      const selectedZip = zipcodes.find((zip) => zip.city_id?._id === value);
      setFormData((prev) => ({
        ...prev,
        city_id: value,
        pincode: selectedZip?.zipcode || "",
        area_id: "",
      }));
      if (value) fetchAreasByCity(value);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitNewAddress = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.city_id ||
      !formData.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient("/address", {
        method: "POST",
        body: formData,
      });

      if (res?.success) {
        toast.success("Address added successfully");
        if (onAddAddress) onAddAddress(res.address);
        setFormData(initialFormState);
        setView("list");
      }
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await apiClient(`/address/${addressId}`, {
        method: "DELETE",
      });
      if (res?.success) {
        toast.success("Address deleted");
        if (onAddAddress) {
          onAddAddress(addresses.filter((a) => a._id !== addressId));
        }
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleConfirmSelection = () => {
    const selected = addresses.find((addr) => addr._id === selectedId);
    if (selected) {
      onSelectAddress(selected);
      onClose();
    }
  };

  const uniqueCities = [
    ...new Map(
      zipcodes
        .filter((z) => z.city_id?._id)
        .map((z) => [z.city_id._id, z.city_id]),
    ).values(),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                {view === "add" && (
                  <button
                    onClick={() => setView("list")}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 className="text-xl font-black text-[#1a1c24]">
                  {view === "list" ? "Select Address" : "Add New Address"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#fcfcfc]">
              {view === "list" ? (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedId(addr._id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedId === addr._id
                          ? "border-[#fdd835] bg-yellow-50/30 shadow-md"
                          : "border-gray-100 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedId === addr._id ? "border-[#fdd835] bg-[#fdd835]" : "border-gray-300"}`}
                          >
                            {selectedId === addr._id && (
                              <Check size={12} className="text-black" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#1a1c24]">
                                {addr.name}
                              </span>
                              <span className="text-[10px] bg-gray-900 text-[#fdd835] px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                {addr.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-snug">
                              {addr.address}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {addr.city_id?.name}, {addr.pincode}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-700">
                              <Phone size={12} className="text-[#fdd835]" />{" "}
                              {addr.mobile}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr._id);
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setView("add")}
                    className="w-full py-5 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:border-[#fdd835] hover:text-black transition-all"
                  >
                    <Plus size={20} />{" "}
                    <span className="font-bold">Add New Delivery Location</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitNewAddress} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Receiver's Name"
                      className="text-black"
                    />
                    <Input
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-gray-400 ml-1">
                      Complete Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-50 border-2 text-black border-transparent rounded-2xl focus:border-[#fdd835]
                       focus:bg-white outline-none min-h-[100px] transition-all"
                      placeholder="House No, Street, Landmark..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-black">
                    <Select
                      label="City"
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      options={uniqueCities}
                      className="text-black"
                    />
                    <Select
                      label="Area"
                      name="area_id"
                      value={formData.area_id}
                      onChange={handleInputChange}
                      options={areas}
                      disabled={!formData.city_id}
                      className="text-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      readOnly
                      className="bg-gray-100 opacity-70 text-black"
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black uppercase text-gray-400 ml-1">
                        Address Type
                      </label>
                      <div className="flex gap-2">
                        {["home", "office"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, type: t })
                            }
                            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${formData.type === t ? "bg-black text-[#fdd835]" : "bg-gray-100 text-gray-400"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              {view === "list" ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 py-4 font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedId}
                    onClick={handleConfirmSelection}
                    className="flex-[2] py-4 bg-[#fdd835] text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-yellow-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Deliver to this address
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSubmitNewAddress}
                  disabled={loading}
                  className="w-full py-4 bg-black text-[#fdd835] font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {loading ? "Saving..." : "Save & Continue"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const Input = ({ label, ...props }) => (
  <div className="space-y-1 flex-1">
    <label className="text-[11px] font-black uppercase text-gray-400 ml-1">
      {label}
    </label>
    <input
      {...props}
      className={`w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#fdd835] focus:bg-white outline-none transition-all ${props.className}`}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="space-y-1 flex-1">
    <label className="text-[11px] font-black uppercase text-gray-400 ml-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#fdd835] focus:bg-white outline-none transition-all"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);
