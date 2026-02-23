"use client";

import { apiClient } from "@/services/apiClient";
import { Phone, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function AssignDeliveryBoyModal({ open, data, onClose }) {
  const { user } = useSelector((a) => a.auth);
  const vendorId = user?._id || user?.id;

  const [selectedBoy, setSelectedBoy] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH DELIVERY BOYS ================= */
  useEffect(() => {
    if (!open || !vendorId) return;

    const getDeliveryBoy = async () => {
      try {
        setLoading(true);
        const res = await apiClient(`/delivery_boy/vendor/${vendorId}`);

        if (res?.success) {
          setDeliveryBoys(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch delivery boys", err);
      } finally {
        setLoading(false);
      }
    };

    getDeliveryBoy();
  }, [open, vendorId]);

  const handleAssign = async () => {
    const id = data?.order_id?._id;

    console.log("oreder id", id);
    console.log("oreder ", data);

    console.log("selectedBoy", selectedBoy);
    console.log("selectedBoy?._id", selectedBoy?._id);

    try {
      setAssigning(true);

      const res = await apiClient(`/order/assignDeliveryBoy/${id}`, {
        method: "PUT",
        body: {
          delivery_boy_id: selectedBoy?._id,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setAssigning(false);
      onClose();
    }
  };

  if (!open) return null;

  const filteredBoys = deliveryBoys.filter((boy) => {
    const name = boy.personal_details?.full_name || boy.user_id?.username || "";

    const phone = boy.personal_details?.mobile || boy.user_id?.mobile || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 w-[90%] h-[90%] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Assign Delivery Partner
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Order Number:{" "}
              <span className="font-semibold text-blue-600">
                #{data?.order_id?.order_number}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white/50 border-b">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search delivery boy by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
        w-full
        h-12
        pl-12
        pr-4
        rounded-lg
        border border-slate-200
        bg-white
        text-sm
        text-black
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      "
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBoys.map((boy) => {
                const name =
                  boy.personal_details?.full_name ||
                  boy.user_id?.username ||
                  "No Name";

                const phone =
                  boy.personal_details?.mobile || boy.user_id?.mobile || "N/A";

                return (
                  <div
                    key={boy._id}
                    onClick={() => setSelectedBoy(boy)}
                    className={`
                      relative flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        selectedBoy?._id === boy._id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-white bg-white hover:border-slate-200 shadow-sm"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4
                        ${
                          selectedBoy?._id === boy._id
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }
                      `}
                    >
                      {name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{name}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {phone}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Available
                        </span>
                      </div>
                    </div>

                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${
                          selectedBoy?._id === boy._id
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }
                      `}
                    >
                      {selectedBoy?._id === boy._id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-8 py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-slate-700">
            {selectedBoy ? (
              <p>
                Selected:{" "}
                <span className="font-bold text-blue-600">
                  {selectedBoy.personal_details?.full_name ||
                    selectedBoy.user_id?.username}
                </span>
              </p>
            ) : (
              <p className="text-slate-400 italic">No partner selected</p>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedBoy || assigning}
              className={`
    flex-1 sm:flex-none px-8 py-2.5 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2
    ${
      selectedBoy && !assigning
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-blue-300 cursor-not-allowed"
    }
  `}
            >
              {assigning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Assigning...
                </>
              ) : (
                "Confirm & Assign"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
