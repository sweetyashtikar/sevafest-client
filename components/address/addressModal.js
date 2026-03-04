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
      setSelectedId(selectedAddressId || null);
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
    setSelectedId(address._id);
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
        toast.success("Address added successfully ");
        if (onAddAddress) {
          onAddAddress(res.address);
        }
        onClose();
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

  const handleDeleteAddress = async (addressId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this address?",
      );
      if (!confirmDelete) return;

      const res = await apiClient(`/address/user/${addressId}`, {
        method: "DELETE",
      });

      if (res?.success) {
        toast.success("Address deleted successfully");

        // refresh list
        if (onAddAddress) {
          const updated = addresses.filter((addr) => addr._id !== addressId);
          onAddAddress(updated);
        }
        onClose();
      } else {
        toast.error(res?.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error("Server error while deleting address");
    }
  };

  const ViewList = () => {
    console.log("selectedId", selectedId);
    console.log("address id", addresses._id);

    return (
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 shadow-sm
            ${
              selectedId === address._id
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md"
                : "border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
            } ${!address.serviceable ? "opacity-60 grayscale" : ""}`}
            onClick={() => handleSelect(address)}
          >
            <div className="flex items-start gap-4">
              {/* Radio */}
              <div className="pt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${selectedId === address._id ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}
                >
                  {selectedId === address._id && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-semibold text-gray-900">
                    {address.name}
                  </span>

                  {/* Address Type Badge */}
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase font-medium">
                    {address.type}
                  </span>

                  {/* Default Badge */}
                  {address.is_default && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium text-gray-900">{address.address}</p>

                  <p className="text-gray-600">
                    {address.area_id?.name}, {address.city_id?.name},{" "}
                    {address.state} - {address.pincode}
                  </p>

                  {/* Phone */}
                  <div className="flex items-center gap-2 mt-2 text-gray-700">
                    <Phone size={14} className="text-blue-500" />
                    <span>{address.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address._id);
                  }}
                  className="p-2 rounded-full bg-red-50 transition"
                >
                  <Trash2 size={16} className="text-red-800" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Address Button */}
        <button
          onClick={() => setView("add")}
          className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl
        hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center gap-2">
            <Plus
              size={20}
              className="text-blue-500 group-hover:text-blue-700"
            />

            <span className="text-blue-600 group-hover:text-blue-700 font-semibold">
              Add New Address
            </span>
          </div>
        </button>
      </div>
    );
  };

  const Buttons = () => {
    return (
      <>
        {" "}
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
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <Header view={view} onClose={onClose} setView={setView} />

          <div className="flex-1 overflow-y-auto p-6">
            {view === "list" ? (
              <ViewList />
            ) : (
              <form
                id="addressForm"
                onSubmit={handleSubmitNewAddress}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-md font-semibold text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-md font-semibold text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-md font-semibold text-gray-700">
                    Flat / House No. / Building / Street
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Complete address details"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-md font-semibold text-gray-700">
                      City 
                    </label>
                    <div className="relative">
                      <select
                        name="city_id"
                        className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="text-md font-semibold text-gray-700">
                      Area
                    </label>
                    <div className="relative">
                      <select
                        name="area_id"
                        className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="text-md font-semibold text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      readOnly
                      className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.pincode}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-md font-semibold text-gray-700">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      className="w-full p-2.5 border border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-4 h-4 text-blue-600 font-bold"
                    />
                    <span className="text-md font-bold">Home</span>
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
                    <span className="text-md font-bold">Office</span>
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
                  <label htmlFor="is_default" className="text-md text-gray-600">
                    Set as default address
                  </label>
                </div>
              </form>
            )}
          </div>

          <div className="p-6 flex items-center justify-end gap-3 bg-gray-50 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
            <Buttons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;

const Header = React.memo(({ view, setView, onClose }) => {
  return (
    <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 bg-[#f0f2f2]">
      <div className="flex items-center gap-3">
        {view === "add" && (
          <button
            onClick={() => setView("list")}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-all text-gray-700"
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h3 className="text-[20px] font-bold text-[#111]">
          {view === "list" ? "Select a delivery address" : "Add a new address"}
        </h3>
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-200 rounded-md transition-colors group"
      >
        <X size={20} className="text-gray-500 group-hover:text-black" />
      </button>
    </div>
  );
});
