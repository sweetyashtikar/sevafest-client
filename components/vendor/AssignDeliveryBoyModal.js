
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

  useEffect(() => {
    if (!open || !vendorId) return;

    const getDeliveryBoy = async () => {
      try {
        setLoading(true);
        const res = await apiClient(`/delivery_boy/vendor/${vendorId}`);
        if (res?.success) {
          const data = res.data;
          const activeBoys = data.filter(
            (boy) => boy.user_id?.status === true
          );
          setDeliveryBoys(activeBoys || []);
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

    try {
      setAssigning(true);

      await apiClient(`/order/assignDeliveryBoy/${id}`, {
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
    const name =
      boy.personal_details?.full_name || boy.user_id?.username || "";
    const phone =
      boy.personal_details?.mobile || boy.user_id?.mobile || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 w-[80%] h-[80%] rounded-2xl shadow-2xl border border-black flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-black flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-black">
              Assign Delivery Partner
            </h2>
            <p className="text-sm mt-1 text-black">
              Order Number:{" "}
              <span className="font-semibold text-blue-600">
                #{data?.order_id?.order_number}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-black">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
            />
            <input
              type="text"
              placeholder="Search delivery boy by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-black bg-white text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <p className="text-black">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBoys.map((boy) => {
                const name =
                  boy.personal_details?.full_name ||
                  boy.user_id?.username ||
                  "No Name";

                const phone =
                  boy.personal_details?.mobile ||
                  boy.user_id?.mobile ||
                  "N/A";

                return (
                  <div
                    key={boy._id}
                    onClick={() => setSelectedBoy(boy)}
                    className={`relative flex items-center p-5 rounded-xl border-2 cursor-pointer
                      ${
                        selectedBoy?._id === boy._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-black bg-white"
                      }
                    `}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4
                        ${
                          selectedBoy?._id === boy._id
                            ? "bg-blue-500 text-white"
                            : "bg-black text-white"
                        }
                      `}
                    >
                      {name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-black">{name}</h4>
                      <p className="text-sm text-black flex items-center gap-2">
                        <Phone size={14} />
                        {phone}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium border border-black">
                          Available
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${
                          selectedBoy?._id === boy._id
                            ? "border-blue-500 bg-blue-500"
                            : "border-black"
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
        <div className="bg-white px-8 py-6 border-t border-black flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-black">
            {selectedBoy ? (
              <p>
                Selected:{" "}
                <span className="font-bold text-blue-600">
                  {selectedBoy.personal_details?.full_name ||
                    selectedBoy.user_id?.username}
                </span>
              </p>
            ) : (
              <p className="italic">No partner selected</p>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-semibold text-black bg-white border border-black"
            >
              Cancel
            </button>

            <button
              onClick={handleAssign}
              disabled={!selectedBoy || assigning}
              className={`flex-1 sm:flex-none px-8 py-2.5 rounded-lg font-semibold text-white shadow-lg flex items-center justify-center gap-2
                ${
                  selectedBoy && !assigning
                    ? "bg-blue-600"
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