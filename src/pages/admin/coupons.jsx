import React, { useState, useMemo, useEffect } from "react";
import {
  Eye, Pencil, Trash2, RotateCcw, Search, Tag, CheckCircle,
  PauseCircle, Calendar, BadgePercent,
  ChevronFirst, ChevronLast, ChevronLeft, ChevronRight,
  ShieldCheck, Lock, Zap,
} from "lucide-react";
// import GenerateCoupon from "../../model/admin/generateCoupon";
import couponData from "../../data/couponsData";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../redux/actions/couponsActions";
import CustomFilter from "../../components/common/filterOption";
import GenerateCoupon from "../../model/admin/generateCoupon";
import { fetchCounts } from "../../redux/actions/countAction";

// ─── Colour maps ──────────────────────────────────────────────────────────────
const TYPE_COLORS = { percentage: "bg-purple-100 text-purple-700", amount: "bg-blue-100 text-blue-700"};
const TYPE_LABELS = { percentage: "Percentage", amount: "Amount", };
const STATUS_COLORS = { Active: "bg-green-100 text-green-700 border-green-200", Inactive: "bg-gray-100 text-gray-600 border-gray-200", Expired: "bg-red-100 text-red-600 border-red-200" };
const VIS_COLORS = { public: "bg-green-50 text-green-700 border-green-200", private: "bg-orange-50 text-orange-700 border-orange-200", };

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, value, label, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 flex-1 min-w-[140px]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const discountDisplay = (c) => {
  if (c.discountType === "percentage") return `${Number(c.discountValue)}%`;
  if (c.discountType === "amount") return `₹${Number(c.discountValue)}`;
  return "Free Ship";
};

// Status is now derived — the data only carries `isActive`, not a status string.
const getCouponStatus = (c) => {
  if (!c.isActive) return "Inactive";
  if (c.isActive) return "Active";
  // const end = new Date(c.endDate);
  // const now = new Date();
  // if (end < now) return "Expired";
  // return "Active";
};

const visibilityOptions = [
  {
    label: "Private",
    value: "private",
  },
  {
    label: "Public",
    value: "public",
  },
];

const statusOptions = [
  {
    label: "Active",
    value: "true",
  },
  {
    label: "InActive",
    value: "false",
  },
];


const typeOptions = [
  {
    label: "Variant",
    value: "variant",
  },
   {
    label: "Specific product",
    value: "product",
  },
  {
    label: "category",
    value: "category",
  },
  {
    label: "All product",
    value: "allProduct",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CouponsPage() {
  // const [coupons, setCoupons] = useState(couponData);
  const dispatch = useDispatch();
  const rowsPerPage = 10;
  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
      dispatch(fetchCoupons(currentPage, rowsPerPage,search,filterStatus,filterType,filterVisibility)); 
  }, [dispatch, currentPage, rowsPerPage,search,filterStatus,filterType,filterVisibility]);
    
  const { coupons = [], totalRecords,totalPages, error } = useSelector(
    (state) => state.couponState
  );

  const { counts, error:countError } = useSelector(state => state.countState);
  
    useEffect(() => {
      dispatch(fetchCounts());
    }, [dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  const [perPage, setPerPage] = useState(10);

  // ── Add coupon (called from modal) ────────────────────────────
  // const handleAddCoupon = (coupon) => {
  //   setCoupons((prev) => [coupon, ...prev]);
  // };

  const handleView = (id) => {
    if (!id) return;
    setSelectedCoupon(id);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (id) => {
    if (!id) return;
    setSelectedCoupon(id);
    setModalMode("edit");
    setShowModal(true);
  };

  // const handleUpdateCoupon = (updatedCoupon) => {
  //   setCoupons((prev) =>
  //     prev.map((coupon) =>
  //       coupon.id === updatedCoupon.id
  //         ? updatedCoupon
  //         : coupon
  //     )
  //   );
  // };

  // ── Delete ─────────────────────────────────────────────────────
  
  const handleDelete = (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Stats (derived) ────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDay = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      total: coupons.length,
      active: coupons.filter((c) => getCouponStatus(c) === "Active").length,
      inactive: coupons.filter((c) => getCouponStatus(c) === "Inactive").length,
      expiringSoon: coupons.filter((c) => {
        const end = new Date(c.endDate);
        return end >= now && end <= sevenDay && getCouponStatus(c) === "Active";
      }).length,
      totalUsed: coupons.reduce((s, c) => s + (c.totalUsedCount || 0), 0),
    };
  }, [coupons]);


  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const renderPagination = () => {
  const pages = [];
  const startPage = Math.max(currentPage - 1, 1);
  const endPage = Math.min(currentPage + 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        disabled={i === currentPage} 
        className={`px-2 py-1 rounded border ${
          i === currentPage
            ? "bg-primary/70 text-white cursor-not-allowed"
            : "bg-white text-black hover:bg-primary/70 hover:text-white"
        }`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex gap-2 mt-4 justify-end">
      {/* First Page */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {"<<"}
      </button>

      {/* Prev Page */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {"<"}
      </button>

      {pages}

      {/* Next Page */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {">"}
      </button>

      {/* Last Page */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {">>"}
      </button>
    </div>
  );
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterVisibility("");
    setFilterType("");
    setSearch("");
    setCurrentPage(1);
  };

  const selectClass =
    "border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a11]/30 focus:border-[#d98a11] transition appearance-none pr-8";

  return (
    <div className="min-h-screen pr-5 py-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
          {/* <p className="text-sm text-gray-400 mt-0.5">
            Dashboard &rsaquo; <span className="text-gray-600">Coupons</span>
          </p> */}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d98a11] hover:bg-[#b96f00] text-white font-semibold rounded-xl shadow-md transition text-sm"
        >
          <span className="text-lg leading-none">+</span> Add New Coupon
        </button>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4 mt-6">
        <StatCard icon={<Tag size={22} className="text-[#d98a11]" />} iconBg="bg-[#fff4dd]" value={counts.totalCoupons} label="Total Coupons" sub="All coupons" />

        <StatCard icon={<CheckCircle size={22} className="text-green-500" />} iconBg="bg-green-50" value={counts.totalActiveCoupons} label="Active" sub="Currently active" />

        <StatCard icon={<PauseCircle size={22} className="text-red-400" />} iconBg="bg-red-50" value={counts.totalInactiveCoupons} label="Inactive" sub="Not active" />

        <StatCard icon={<Calendar size={22} className="text-purple-500" />} iconBg="bg-purple-50" value={counts.expiringSoonCoupons} label="Expiring Soon" sub="Within next 1 day" />
        
        <StatCard icon={<BadgePercent size={22} className="text-blue-500" />} iconBg="bg-blue-50" value={counts.totalUsedCoupon} label="Total Used" sub="All coupons" />
      </div>

      {/* Filter Bar */}
      <div className="mt-6 flex flex-wrap gap-3 items-center">

        <div className="w-[210px]">
            <CustomFilter
                options={statusOptions}
                value={filterStatus || "all"}
                onChange={(value) => {
                  setFilterStatus(value === "all" ? "" : value);
                  setCurrentPage(1);
                }}
                placeholder="All Status"
                allLabel="All Status"
            />
        </div>

        <div className="w-[210px]">
            <CustomFilter
                options={visibilityOptions}
                value={filterVisibility || "all"}
                onChange={(value) => {
                  setFilterVisibility(value === "all" ? "" : value);
                  setCurrentPage(1);
                }}
                placeholder="All"
                allLabel="All Visibility"
            />
        </div>

         <div className="w-[210px]">
            <CustomFilter
                options={typeOptions}
                value={filterType || "all"}
                onChange={(value) => {
                  setFilterType(value === "all" ? "" : value);
                  setCurrentPage(1);
                }}
                placeholder="All"
                allLabel="All"
            />
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border  border-primary rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a11]/30 focus:border-[#d98a11] transition"
            placeholder="Search by code or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 transition">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 bg-[#fff4dd] rounded-full flex items-center justify-center">
              <Tag size={28} className="text-[#d98a11]" />
            </div>
            <p className="text-gray-600 font-medium">No coupons yet</p>
            <p className="text-sm text-gray-400">Click "Add New Coupon" to create your first one.</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search size={28} className="text-gray-300" />
            <p className="text-gray-600 font-medium">No coupons match your filters</p>
            <button onClick={resetFilters} className="text-sm text-[#d98a11] hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#fff9ef] border-b border-[#f0dfbb]">
                <tr>
                  
                  {["Coupon Code", "Coupon Name", "Discount", "Type", "Min. Order", "Validity", "Usage", "Visibility", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-xs font-semibold text-[#7d4400] text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const used = c.totalUsedCount ?? 0;
                  const limit = c.usedCount === 1 ? "\u221E" : c.usedCount;
                  const pct = c.usedCount === 1 ? null : Math.round((used / c.usedCount) * 100);
                  const status = getCouponStatus(c);
                  return (
                    <tr key={c.id || i} className="border-t border-gray-50 hover:bg-[#fffdf8] transition">
                      

                      <td className="px-4 py-4">
                        <span className="inline-block px-3 py-1 rounded-lg border-2 border-dashed border-[#d98a11] text-[#8b4b00] text-xs font-bold tracking-wide bg-[#fff9ef]">
                          {c.code}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[160px] truncate">{c.description || ""}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold ${c.discountType === "percentage" ? "text-purple-600" : c.discountType === "amount" ? "text-blue-600" : "text-teal-600"}`}>
                          {discountDisplay(c)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_COLORS[c.discountType] || "bg-gray-100 text-gray-600"}`}>
                          {TYPE_LABELS[c.discountType] || c.discountType}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {c.minOrderAmount ? `₹${Number(c.minOrderAmount)}` : "—"}
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">
                        {fmt(c.startDate)}<br />
                        <span className="text-gray-400">– {fmt(c.endDate)}</span>
                      </td>

                      <td className="px-4 py-4 min-w-[120px]">
                        <p className="text-xs font-medium text-gray-700">{used} / {limit}</p>
                        {pct !== null ? (
                          <>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                              <div className="bg-[#d98a11] h-1.5 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{pct}%</p>
                          </>
                        ) : <p className="text-xs text-[#d98a11] mt-0.5">—</p>}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${VIS_COLORS[c.visibility] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                          {c.visibility}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(c.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleEdit(c.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition"
                          >
                            <Pencil size={15} />
                          </button>
                          {/* <button onClick={() => handleDelete(c.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
                            <Trash2 size={15} />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Legend */}
      {/* Legend Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: <ShieldCheck size={22} className="text-green-600" />,
            bg: "bg-green-50",
            title: "Public Coupons",
            desc: "Visible on the website to all customers.",
          },
          {
            icon: <Lock size={22} className="text-orange-500" />,
            bg: "bg-orange-50",
            title: "Private Coupons",
            desc: "Hidden from the website — usable only when directly shared.",
          },
        ].map(({ icon, bg, title, desc }) => (
          <div
            key={title}
            className="
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        p-5
        flex items-start gap-4
        h-full
        hover:shadow-md
        transition-all duration-200
      "
          >
            <div
              className={`
          w-12 h-12
          rounded-xl
          flex items-center justify-center
          flex-shrink-0
          ${bg}
        `}
            >
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                {title}
              </p>

              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <GenerateCoupon
          mode={modalMode}
          couponId={selectedCoupon}
          onClose={() => {
            setShowModal(false);
            setSelectedCoupon(null);
            setModalMode("create");
          }}
        />
      )}
    </div>
  );
}
