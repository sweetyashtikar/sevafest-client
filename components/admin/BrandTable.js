import { useState } from "react"
import { Eye, Edit2, Trash2 } from "lucide-react"

export default function BrandTable({
  brands,
  loading,
  onView,
  onEdit,
  onDelete,
  onStatusToggle,
}) {
  const [page, setPage] = useState(1)
  const perPage = 5

  const start = (page - 1) * perPage
  const paginated = brands.slice(start, start + perPage)
  const totalPages = Math.ceil(brands.length / perPage)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Brand Icon
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Brand Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={3} className="p-8">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium text-gray-700 text-lg">
                      Loading brands...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center">
                  <div className="text-gray-500 text-lg">
                    No brands found
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              paginated.map((brand) => (
                <tr
                  key={brand._id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    {brand.icon ? (
                      <img
                        src={brand.icon}
                        alt={brand.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <span className="text-xs text-gray-400">No icon</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800 text-base">
                      {brand.name}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={brand.status === true}
                          onChange={() => onStatusToggle(brand)}
                          className="sr-only peer"
                        />
                        <div className="
                          relative w-14 h-7 bg-gray-300 rounded-full
                          peer-checked:bg-green-500
                          transition-all duration-300 shadow-inner
                          after:content-['']
                          after:absolute after:top-[3px] after:left-[3px]
                          after:bg-white after:rounded-full
                          after:h-[22px] after:w-[22px]
                          after:transition-transform after:duration-300
                          after:shadow-md
                          peer-checked:after:translate-x-[28px]
                        " />
                      </label>

                      <span className={`
                        text-xs font-bold px-3 py-1 rounded-full
                        ${brand.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }
                      `}>
                        {brand.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => onView(brand)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => onEdit(brand)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => onDelete(brand)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${page === i + 1
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}