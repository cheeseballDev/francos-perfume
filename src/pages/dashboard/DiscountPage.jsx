import { useState } from "react";
import SearchBar from "../../components/shared/SearchBar";

/*
  DiscountPage
  ─────────────────────────────────────────────────────────────────────────────
  PURPOSE:
    Lets a manager view, create, toggle, and delete discount types.
    All data is currently in-memory (no DB table for discounts yet).

  WHEN A BACKEND IS ADDED:
    - GET  /api/discounts            → replace `initialDiscounts` with fetch
    - POST /api/discounts            → call in handleAddDiscount after setDiscounts
    - PATCH /api/discounts/{prefix}  → call in toggleStatus
    - DELETE /api/discounts/{prefix} → call in handleDelete

  DATA SHAPE:
    { prefix: "SEN", name: "Senior Citizen", percent: 20, status: "Active" }

  BUG FIXED (2026-04-11):
    Line 55 referenced `searchLower` which was never declared.
    Fixed to inline `searchQuery.toLowerCase()` as the variable `q`.
  ─────────────────────────────────────────────────────────────────────────────
*/

const initialDiscounts = [
  { prefix: "SEN", name: "Senior Citizen",        percent: 20, status: "Active"   },
  { prefix: "PWD", name: "Person with Disability", percent: 20, status: "Active"   },
  { prefix: "EMP", name: "Employee Discount",      percent: 15, status: "Active"   },
  { prefix: "VIP", name: "VIP Member",             percent: 10, status: "Active"   },
  { prefix: "HOL", name: "Holiday Special",        percent: 25, status: "Inactive" },
];

const DiscountPage = () => {
  // ── State ────────────────────────────────────────────────────────────────
  const [discounts,     setDiscounts]     = useState(initialDiscounts);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");

  const [newDiscount, setNewDiscount] = useState({
    name: "", prefix: "", percent: "", status: "Active",
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddDiscount = (e) => {
    e.preventDefault();
    if (!newDiscount.name || !newDiscount.prefix || !newDiscount.percent) return;

    setDiscounts([...discounts, { ...newDiscount, percent: Number(newDiscount.percent) }]);
    setNewDiscount({ name: "", prefix: "", percent: "", status: "Active" });

    // 🔌 BACKEND HOOK: POST /api/discounts with newDiscount payload
  };

  const handleDelete = (prefix) => {
    setDiscounts(discounts.filter((d) => d.prefix !== prefix));
    // 🔌 BACKEND HOOK: DELETE /api/discounts/{prefix}
  };

  const toggleStatus = (prefix) => {
    setDiscounts(discounts.map((d) =>
      d.prefix === prefix
        ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" }
        : d
    ));
    // 🔌 BACKEND HOOK: PATCH /api/discounts/{prefix} with { status: toggled }
  };

  // ── Filter ───────────────────────────────────────────────────────────────
  // BUG FIX: `searchLower` was never declared — use inline toLowerCase().
  const filteredDiscounts = discounts.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch  = d.name.toLowerCase().includes(q) || d.prefix.toLowerCase().includes(q);
    const matchesStatus  = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = discounts.filter((d) => d.status === "Active").length;

  return (
    <div className="flex flex-col h-full animate-fade-in relative font-montserrat">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <h1 className="text-[32px] font-bold text-custom-black mb-1 leading-none tracking-tight">
        Discount Management
      </h1>
      <p className="text-custom-gray text-sm mb-8">Create, remove, and change discounts</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">

        {/* ── LEFT: DISCOUNT TABLE ────────────────────────────────────── */}
        <div className="bg-custom-white border border-custom-gray-2 rounded-2xl p-6 shadow-sm self-start">
          <h2 className="text-custom-gray text-sm font-bold uppercase tracking-wider mb-6">
            Active Discount Types
          </h2>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-custom-gray-2 rounded-md px-4 py-2 text-sm text-custom-gray focus:outline-none focus:ring-1 focus:ring-custom-gray"
            >
              <option value="All">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-custom-gray border-b border-custom-gray-2">
                <th className="text-left font-medium py-3">Prefix</th>
                <th className="text-left font-medium py-3">Discount Name</th>
                <th className="text-left font-medium py-3">Percentage</th>
                <th className="text-left font-medium py-3">Status</th>
                <th className="text-center font-medium py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-custom-gray italic text-sm">
                    No discounts match your search.
                  </td>
                </tr>
              ) : (
                filteredDiscounts.map((d, index) => (
                  <tr
                    key={d.prefix}
                    className={index % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"}
                  >
                    <td className="py-4 px-2 font-medium text-custom-gray uppercase">{d.prefix}</td>
                    <td className="py-4 text-custom-black">{d.name}</td>
                    <td className="py-4 text-custom-black">{d.percent}%</td>
                    <td className="py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        d.status === "Active"
                          ? "bg-green-100 text-custom-green"
                          : "bg-custom-gray-2 text-custom-gray"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center gap-2">
                        {/* Toggle active/inactive */}
                        <button
                          onClick={() => toggleStatus(d.prefix)}
                          title={d.status === "Active" ? "Deactivate" : "Activate"}
                          className={`p-1.5 rounded transition-colors text-xs ${
                            d.status === "Active"
                              ? "bg-custom-primary text-custom-black hover:bg-custom-primary/80"
                              : "bg-custom-black text-custom-white hover:opacity-80"
                          }`}
                        >
                          {d.status === "Active" ? "⏸" : "▶"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(d.prefix)}
                          title="Delete discount"
                          className="p-1.5 bg-custom-red hover:opacity-80 text-custom-white rounded transition-colors text-xs"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <p className="mt-6 text-sm font-bold text-custom-gray">
            Total Active Discounts: {totalActive}
          </p>
        </div>

        {/* ── RIGHT: ADD FORM ─────────────────────────────────────────── */}
        <div className="bg-custom-white border border-custom-gray-2 rounded-2xl p-6 shadow-sm self-start">
          <h2 className="text-custom-gray text-sm font-bold uppercase tracking-wider mb-8">
            Add New Discount Type
          </h2>

          <form onSubmit={handleAddDiscount} className="space-y-6">

            <div>
              <label className="block text-custom-gray text-sm mb-2 font-medium">
                Discount Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Citizen"
                value={newDiscount.name}
                onChange={(e) => setNewDiscount({ ...newDiscount, name: e.target.value })}
                className="w-full border border-custom-gray-2 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-custom-gray outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-custom-gray text-sm font-medium w-32">
                Discount Prefix:
              </label>
              <input
                type="text"
                maxLength={3}
                placeholder="ABC"
                value={newDiscount.prefix}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, prefix: e.target.value.toUpperCase() })
                }
                className="w-20 border border-custom-gray-2 rounded-md p-2 text-center text-sm focus:ring-1 focus:ring-custom-gray outline-none uppercase"
              />
              <span className="text-[10px] text-custom-gray uppercase font-bold">
                (3 Characters Max)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-custom-gray text-sm font-medium w-32">
                Discount Percent:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newDiscount.percent}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, percent: e.target.value })
                  }
                  className="w-20 border border-custom-gray-2 rounded-md p-2 text-center text-sm focus:ring-1 focus:ring-custom-gray outline-none"
                />
                <span className="text-lg text-custom-gray">%</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-custom-gray text-sm font-medium w-32">
                Status:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-custom-gray cursor-pointer">
                  <input
                    type="radio"
                    checked={newDiscount.status === "Active"}
                    onChange={() => setNewDiscount({ ...newDiscount, status: "Active" })}
                    className="accent-custom-black"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-custom-gray cursor-pointer">
                  <input
                    type="radio"
                    checked={newDiscount.status === "Inactive"}
                    onChange={() => setNewDiscount({ ...newDiscount, status: "Inactive" })}
                    className="accent-custom-black"
                  />
                  Inactive
                </label>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium py-3 rounded-md shadow-sm transition-colors"
              >
                Save as new discount
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DiscountPage;
