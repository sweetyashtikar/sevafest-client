"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  Check,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import { apiClient } from "@/services/apiClient";

const AddressModal = ({
  isOpen,
  onClose,
  addresses = [],
  onSelectAddress,
  selectedAddressId,
  onAddAddress,
}) => {
  const { user } = useSelector((a) => a.auth);
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(selectedAddressId);
  const [zipcodes, setZipcodes] = useState([]);
  const [areas, setAreas] = useState([]);

  const initialFormState = {
    user_id: user?._id,
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

  const fetchZipcode = async () => {
    try {
      const res = await apiClient("/zipCode");
      if (res?.success) {
        setZipcodes(res.zipcodes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchZipcode();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setView("list");
      setSelectedId(selectedAddressId);
    }
  }, [isOpen, selectedAddressId]);

  const fetchAreasByCity = async (cityId) => {
    try {
      const res = await apiClient(`/area/city/${cityId}`);
      if (res?.success) {
        setAreas(res.areas);
      }
    } catch (error) {
      console.log("Error fetching areas:", error);
    }
  };

  if (!isOpen) return null;

  const handleSelect = (address) => {
    if (address.serviceable !== false) {
      setSelectedId(address._id);
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
        zipcode_id: selectedZip?._id || "",
      }));

      if (value) {
        fetchAreasByCity(value);
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitNewAddress = async () => {
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
      const payload = {
        user_id: user?.id,
        city_id: formData.city_id,
        area_id: formData.area_id,
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        pincode: formData.pincode,
        state: formData.state,
        is_default: formData.is_default,
        type: formData.type,
        alternate_mobile: formData.alternate_mobile || "",
        landmark: formData.landmark || "",
        country: formData.country,
        country_code: formData.country_code,
      };

      console.log("Payload...........", payload);

      const res = await apiClient("/address", {
        method: "POST",
        body: payload,
      });

      if (res?.success) {
        toast.success("Address added successfully ✅");

        if (onAddAddress) {
          onAddAddress(res.address);
        }

        setView("list");
        setFormData(initialFormState);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Server error. Please try again.");
    }
  };

  const handleConfirm = () => {
    const selected = addresses.find((addr) => addr._id === selectedId);
    if (selected) {
      onSelectAddress(selected);
      onClose();
    }
  };

  const cities = [
    ...new Map(
      zipcodes
        .filter((item) => item.city_id && item.city_id._id)
        .map((item) => [item.city_id._id, item.city_id]),
    ).values(),
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center gap-3">
              {view === "add" && (
                <button
                  onClick={() => setView("list")}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {view === "list" ? "Your Addresses" : "Add New Address"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {view === "list" ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border rounded-lg p-5 cursor-pointer transition-all ${
                      selectedId === address._id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    } ${!address.serviceable ? "opacity-60 grayscale" : ""}`}
                    onClick={() => handleSelect(address)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Radio Button */}
                      <div className="pt-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedId === address._id
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedId === address._id && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {address.name}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">
                            {address.type}
                          </span>
                          {address.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-medium">{address.address}</p>
                          <p>
                            {address.area_id?.name}, {address.city_id?.name},{" "}
                            {address.state} - {address.pincode}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-gray-600">
                            <Phone size={14} />
                            <span>{address.mobile}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-full">
                          <Edit size={16} className="text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-full">
                          <Trash2 size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setView("add")}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus
                      size={20}
                      className="text-gray-400 group-hover:text-blue-500"
                    />
                    <span className="text-gray-600 group-hover:text-blue-600 font-medium">
                      Add New Address
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              /* ADD NEW ADDRESS FORM */
              <form
                id="addressForm"
                onSubmit={handleSubmitNewAddress}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2.5 border rounded-lg outline-none focus:border-blue-500"
                      placeholder="e.g. Vaibhav Dhake"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      className="w-full p-2.5 border rounded-lg outline-none focus:border-blue-500"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Flat / House No. / Building / Street *
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    className="w-full p-2.5 border rounded-lg outline-none focus:border-blue-500"
                    placeholder="Complete address details"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <div className="relative">
                      <select
                        name="city_id"
                        className="w-full p-2.5 border rounded-lg outline-none focus:border-blue-500 appearance-none bg-white"
                        value={formData.city_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select City</option>

                        {cities.map((city) => (
                          <option key={city._id} value={city._id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Area *
                    </label>
                    <div className="relative">
                      <select
                        name="area_id"
                        className="w-full p-2.5 border rounded-lg outline-none focus:border-blue-500 appearance-none bg-white"
                        value={formData.area_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Area</option>

                        {areas?.map((area) => (
                          <option key={area._id} value={area._id}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      readOnly
                      className="w-full p-2.5 border rounded-lg bg-gray-100"
                      value={formData.pincode}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      className="w-full p-2.5 border rounded-lg outline-none focus:border-blue-500"
                      placeholder="Near Railway Station"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="home"
                      checked={formData.type === "home"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Home</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="office"
                      checked={formData.type === "office"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Office</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="is_default" className="text-sm text-gray-600">
                    Set as default address
                  </label>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex items-center justify-end gap-3 bg-gray-50">
            {view === "list" ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedId}
                  className={`px-8 py-2.5 rounded-lg font-bold transition-all shadow-md ${
                    selectedId
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  Deliver Here
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setView("list")}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                    onClick={handleSubmitNewAddress}
                  className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md"
                >
                  Save Address
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
