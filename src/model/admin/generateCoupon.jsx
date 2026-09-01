import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";
import CustomFilter from "../../components/common/filterOption";
import { saveCoupon } from "../../services/coupons";
import { fetchCoupons } from "../../redux/actions/couponsActions";
import { useDispatch } from "react-redux";

const Base_Url = import.meta.env.VITE_BASE_URL;

// ─── Static helpers — MUST stay outside component to prevent focus loss ───────
const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold tracking-[3px] uppercase text-[#c97a1a] mb-4">
    {children}
  </p>
);

const Field = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const IC =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d98a11]/40 focus:border-[#d98a11] bg-white transition";

// Only two discount types — values match the backend's discountType enum exactly
const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "amount", label: "Flat Amount (₹)" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function GenerateCoupon({
  onClose,
  onSuccess,
  couponId = null,
  mode = "create",
}) {
  const couponInputRef = useRef(null);
  const dispatch=useDispatch();

  // Basic info
  const [couponCode, setCouponCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [description, setDescription] = useState("");

  // Discount
  const [discountType, setDiscountType] = useState("all");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");

  // Validity
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Usage
  const [minOrder, setMinOrder] = useState("");
  const [maxOrder, setMaxOrder] = useState("");
  const [usageTotal, setUsageTotal] = useState("");
  const [usagePerUser, setUsagePerUser] = useState("");

  // Applicable On
  const [applicableOn, setApplicableOn] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");

  // Specification data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Visibility / status / extras
  const [visibility, setVisibility] = useState("public"); // "public" | "private" — lowercase, matches backend
  const [isActive, setIsActive] = useState(true); // boolean — matches backend's isActive field
  const [priority, setPriority] = useState(0);
  const [oneTimeOnly, setOneTimeOnly] = useState(false);
  const [stackable, setStackable] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [showInOffers, setShowInOffers] = useState(true);

  const [couponInActive,setCouponInActive] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [error, setError] = useState("");

  // ── Auth headers ────────────────────────────────────────────────
  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchCouponDetails = async () => {
    if (!couponId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${Base_Url}/api/coupon/getDetails/${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const coupon = res.data.data;
        setCouponCode(coupon.code || "");
        setCouponName(coupon.name || "");
        setDescription(coupon.description || "");

        setDiscountType(coupon.discountType || "all");

        if (coupon.discountType === "percentage") {
          setDiscountPercentage(Number(coupon.discountValue) || "");
        }

        if (coupon.discountType === "amount") {
          setDiscountAmount((coupon.discountValue) || "");
        }

        setStartDate(coupon.startDate || "");
        setEndDate(coupon.endDate || "");

        if(coupon.endDate < today){
          setCouponInActive(true);
          setIsActive(false);
        } else{
          setCouponInActive(false);
          setIsActive(true);
        }

        setMinOrder(Number(coupon.minOrderAmount) || "");
        setMaxOrder(Number(coupon.maxOrderAmount) || "");

        setUsageTotal(Number(coupon.usedCount) || "");

        setVisibility(coupon.visibility || "public");
        setIsActive(coupon.isActive ?? true);

        // applicableType is a single top-level field (not nested): "all" | "category" | "product" | "variant"
        setApplicableOn(coupon.applicableType === "all" ? "all" : "specification");

        setSelectedCategory(coupon.categoryIds?.[0] || "");
        setSelectedProduct(coupon.productIds?.[0] || "");
        setSelectedVariant(coupon.variantIds?.[0] || "");
      } else {
        toast.error(res.data.message || "Failed to fetch coupon details");
      }
    } catch (err) {
      console.error("❌ Fetch coupon error:", err);
      toast.error(err.response?.data?.message || "Failed to load coupon details");
    }
  };

  useEffect(() => {
    if (couponId) {
      fetchCouponDetails();
    } 
  }, [couponId]);

  // ── Fetch categories when "Specification" is selected ──────────
  useEffect(() => {
    if (applicableOn !== "specification") return;
    if (categories.length > 0) return; // already loaded
    const run = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(`${Base_Url}/api/category/getCategoryList`);
        // Handle: array, { data: [] }, { success, data: [] }
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setCategories(list);
      } catch (e) {
        console.error("Failed to fetch categories", e);
      } finally {
        setLoadingCategories(false);
      }
    };
    run();
  }, [applicableOn]);

  // ── Fetch products when category changes ────────────────────────
  useEffect(() => {
    if (!selectedCategory && !couponId) {
      setProducts([]);
      setSelectedProduct("");
      setVariants([]);
      setSelectedVariant("");
      return;
    }
    const run = async () => {
      try {
        setLoadingProducts(true);
        // getProductList — filter by category on client side if API doesn't support query param
        const res = await axios.get(`${Base_Url}/api/product/getProductList`);
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        // Filter products belonging to the selected category
        const filtered = list.filter(
          (p) =>
            p.categoryId === selectedCategory ||
            p.category === selectedCategory ||
            p.category?.id === selectedCategory
        );
        setProducts(filtered.length > 0 ? filtered : list); // fallback: show all if no match
      } catch (e) {
        console.error("Failed to fetch products", e);
      } finally {
        setLoadingProducts(false);
      }
    };
    run();
  }, [selectedCategory]);

  // ── Fetch variants when product changes ─────────────────────────
  useEffect(() => {
    if (!selectedProduct && !couponId ) {
      setVariants([]);
      setSelectedVariant("");
      return;
    }
    const run = async () => {
      try {
        setLoadingVariants(true);
        const res = await axios.get(
          `${Base_Url}/api/product/getVarientsByProductId/${selectedProduct}`,
          { headers: authHeaders() }
        );
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setVariants(list);
      } catch (e) {
        console.error("Failed to fetch variants", e);
      } finally {
        setLoadingVariants(false);
      }
    };
    run();
  }, [selectedProduct]);

  useEffect(() => {
    if (endDate && endDate < today) {
      setCouponInActive(true);
      setIsActive(false);
    } else{
      setCouponInActive(false);
      setIsActive(true);
    }
  }, [endDate]);

  // ── Reset spec selections when switching mode ───────────────────
  const handleApplicableChange = (val) => {
    setApplicableOn(val);
    setSelectedCategory("");
    setSelectedProduct("");
    setSelectedVariant("");
  };

  // ── Coupon code cursor-jump fix (manual entry only — no auto-generate) ──
  const handleCodeChange = (e) => {
    const pos = e.target.selectionStart;
    const val = e.target.value.toUpperCase();
    setCouponCode(val);
    requestAnimationFrame(() => {
      couponInputRef.current?.setSelectionRange(pos, pos);
    });
  };

  const isViewMode = mode === "view";

  const activeType = discountType === "all" ? "" : discountType;

  // ── Submit — builds the payload using the backend's exact field names ──
  const handleSubmit = async() => {
    setError("");
    if (!couponCode.trim()) return setError("Coupon code is required.");
    if (!couponName.trim()) return setError("Coupon name is required.");
    if (!activeType) return setError("Please select a discount type.");
    if (activeType === "percentage" && !discountPercentage) return setError("Please enter a discount percentage.");
    if (activeType === "amount" && !discountAmount) return setError("Please enter a discount amount.");
    if (!startDate || !endDate) return setError("Start date and end date are required.");
    if (new Date(endDate) < new Date(startDate)) return setError("End date must be after start date.");
    if (minOrder !== "" && maxOrder !== "" && Number(maxOrder) < Number(minOrder)) {
      return setError("Maximum order amount must be greater than minimum order amount.");
    }

    const resolvedApplicableType =
      applicableOn === "all"
        ? "all"
        : selectedVariant
          ? "variant"
          : selectedProduct
            ? "product"
            : selectedCategory
              ? "category"
              : "all";

    const couponObj = {
      // id: coupon?.id || Date.now().toString(), 

      code: couponCode,
      name: couponName,
      description,

      discountType: activeType, 
      discountValue:
        activeType === "percentage"
          ? Number(discountPercentage)
          : Number(discountAmount),

      applicableType: resolvedApplicableType, 
      productIds: selectedProduct ? [selectedProduct] : [],
      categoryIds: selectedCategory ? [selectedCategory] : [],
      variantIds: selectedVariant ? [selectedVariant] : [],

      minOrderAmount: minOrder !== "" ? Number(minOrder) : 1 ,
      maxOrderAmount: maxOrder !== "" ? Number(maxOrder) : null,

      // usageTotal :usageTotal !== "" ? Number(usageTotal) : 1,
      usedCount :usageTotal !== "" ? Number(usageTotal) : 1,


      visibility, 
      startDate,
      endDate,
      isActive, 
    };

    console.log("coupon data", couponObj);

    try {
        // await saveCoupon({ couponId, couponObj });
        await saveCoupon({ couponId, data: couponObj });
        dispatch(fetchCoupons());
        onClose();
    } catch (err) {
        console.error("Save coupon failed:", err);
    }

    // onSuccess(couponObj);
    
  };

  // ── Dropdown option arrays ─────────────────────────────────────
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.productName,
  }));
  const variantOptions = variants.map((v, i) => ({
    value: v.id,
    label: `${v.weight} (${Number(v.price)})`,
  }));

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 z-50 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition group"
        >
          <X size={16} className="text-gray-600 group-hover:text-red-600" />
        </button>

        {/* Header */}
        <div className="bg-[#FFFDF8] px-8 py-6 border-b border-[#f0dfbb]">
          <p className="uppercase tracking-[4px] text-xs text-[#8E5D4A] font-medium">Melforesta Admin</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#8E5D4A] mt-1 capitalize">{mode==="create" ? "Add New" : mode} Coupon </h1>
        </div>

        <div className="p-6 md:p-8 bg-[#fffdf8] space-y-8">

          {/* ── BASIC INFO ────────────────────────────────────────── */}
          <div>
            <SectionLabel>Basic Information</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <Field label="Coupon Code" required hint="Customers will enter this code at checkout">
                  <input
                    ref={couponInputRef}
                    className={IC}
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={handleCodeChange}
                    disabled={isViewMode}
                  />
                </Field>
              </div>

              <Field label="Coupon Name" required hint="For internal reference only">
                <input className={IC} placeholder="e.g. Summer Sale" value={couponName} onChange={(e) => setCouponName(e.target.value)} disabled={isViewMode} />
              </Field>

              <Field label="Description" hint="Shown to customers (if public)">
                <textarea className={`${IC} resize-none`} rows={3} placeholder="Enter description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isViewMode}/>
              </Field>
            </div>
          </div>

          <div className="border-t border-[#f0dfbb]" />

          {/* ── DISCOUNT DETAILS ──────────────────────────────────── */}
          <div>
            <SectionLabel>Discount Details</SectionLabel>

            {/* Row 1: type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Field label="Discount Type" required>
                <CustomFilter
                  options={DISCOUNT_TYPES}
                  value={discountType}
                  onChange={(val) => {
                    setDiscountType(val);
                    setDiscountPercentage("");
                    setDiscountAmount("");
                  }}
                  allLabel="Select discount type"
                  className="border border-gray-200 rounded-xl text-sm bg-white"
                />
              </Field>

            </div>

            {/* Row 2: value inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Discount Percentage (%)"
                required={activeType === "percentage"}
                hint={activeType && activeType !== "percentage" ? "Not applicable for selected type" : ""}
              >
                <input
                  className={`${IC} ${activeType !== "percentage" ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}`}
                  type="number" min={0} max={100} placeholder="e.g. 10"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  disabled={activeType !== "percentage" || isViewMode}
                />
              </Field>

              <Field
                label="Discount Amount (₹)"
                required={activeType === "amount"}
                hint={activeType && activeType !== "amount" ? "Not applicable for selected type" : ""}
              >
                <input
                  className={`${IC} ${activeType !== "amount" ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}`}
                  type="number" min={0} placeholder="e.g. 50"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  disabled={activeType !== "amount" || isViewMode}
                />
              </Field>
            </div>
          </div>

          <div className="border-t border-[#f0dfbb]" />

          {/* ── VALIDITY ──────────────────────────────────────────── */}
          <div>
            <SectionLabel>Validity Period</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Start Date" required>
                <input className={IC} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isViewMode} />
              </Field>
              <Field label="End Date" required>
                <input className={IC} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isViewMode} />
              </Field>
            </div>
          </div>

          <div className="border-t border-[#f0dfbb]" />

          {/* ── USAGE RESTRICTIONS ────────────────────────────────── */}
          <div>
            <SectionLabel>Usage Restrictions</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Minimum Order Amount (₹)" hint="Leave empty for no minimum">
                <input className={IC} type="number" min={0} placeholder="e.g. 500" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} disabled={isViewMode} />
              </Field>
              <Field label="Maximum Order Amount (₹)" hint="Leave empty for no maximum">
                <input className={IC} type="number" min={0} placeholder="e.g. 5000" value={maxOrder} onChange={(e) => setMaxOrder(e.target.value)} disabled={isViewMode} />
              </Field>
              <Field label="Usage Limit (Total)" hint="Leave empty for unlimited">
                <input className={IC} type="number" min={0} placeholder="e.g. 100" value={usageTotal} onChange={(e) => setUsageTotal(e.target.value)} disabled={isViewMode} />
              </Field>
            </div>
          </div>

          <div className="border-t border-[#f0dfbb]" />

          {/* ── APPLICABLE ON ─────────────────────────────────────── */}
          <div>
            <SectionLabel>Applicable On</SectionLabel>

            {/* Toggle buttons */}
            <div className="flex gap-3 mb-5">
              {[
                { val: "all", label: "All Products" },
                { val: "specification", label: "Specification" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  disabled={isViewMode}
                  onClick={() => handleApplicableChange(val)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 text-sm font-medium transition ${applicableOn === val
                    ? "border-[#d98a11] bg-[#fff4dd] text-[#8b4b00]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#f0dfbb]"
                    }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${applicableOn === val ? "border-[#d98a11]" : "border-gray-300"}`}>
                    {applicableOn === val && <span className="w-2 h-2 rounded-full bg-[#d98a11] block" />}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            {/* Specification dropdowns — only shown when "Specification" is active */}
            {applicableOn === "specification" && (
              <div className="bg-white border border-[#f0dfbb] rounded-2xl p-5 space-y-4">

                {/* Category */}
                <Field label="Category" hint="Select a category to filter products">
                  {loadingCategories ? (
                    <div className={`${IC} text-gray-400`}>Loading categories…</div>
                  ) : (
                    <CustomFilter
                      options={categoryOptions}
                      value={selectedCategory || "all"}
                      onChange={(val) => {
                        setSelectedCategory(val === "all" ? "" : val);
                        setSelectedProduct("");
                        setSelectedVariant("");
                      }}
                      placeholder="Select category"
                      allLabel="Select a category"
                      className="border border-gray-200 rounded-xl text-sm bg-white"
                      disabled={isViewMode}
                    />
                  )}
                </Field>

                {/* Product */}
                <Field label="Product" hint={!selectedCategory ? "Select a category first" : "Optional — leave unselected to apply to whole category"}>
                  <div className={!selectedCategory ? "opacity-50 pointer-events-none" : ""}>
                    {loadingProducts ? (
                      <div className={`${IC} text-gray-400`}>Loading products…</div>
                    ) : (
                      <CustomFilter
                        options={productOptions}
                        value={selectedProduct || "all"}
                        onChange={(val) => {
                          setSelectedProduct(val === "all" ? "" : val);
                          setSelectedVariant("");
                        }}
                        placeholder="Select product"
                        allLabel={selectedCategory ? "All products in category" : "Select a category first"}
                        className="border border-gray-200 rounded-xl text-sm bg-white"
                        disabled={isViewMode}

                      />
                    )}
                  </div>
                </Field>

                {/* Variant */}
                <Field label="Variant" hint={!selectedProduct ? "Select a product first" : "Optional — leave unselected to apply to all variants"}>
                  <div className={!selectedProduct ? "opacity-50 pointer-events-none" : ""}>
                    {loadingVariants ? (
                      <div className={`${IC} text-gray-400`}>Loading variants…</div>
                    ) : (
                      <CustomFilter
                        options={variantOptions}
                        value={selectedVariant || "all"}
                        onChange={(val) => setSelectedVariant(val === "all" ? "" : val)}
                        placeholder="Select variant"
                        allLabel={selectedProduct ? "All variants" : "Select a product first"}
                        className="border border-gray-200 rounded-xl text-sm bg-white"
                        disabled={isViewMode}
                      />
                    )}
                  </div>
                </Field>

                {/* Summary pill */}
                {(selectedCategory || selectedProduct || selectedVariant) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff4dd] border border-[#f0dfbb] text-xs font-medium text-[#8b4b00]">
                        Category: {categoryOptions.find((c) => c.value === selectedCategory)?.label}
                      </span>
                    )}
                    {selectedProduct && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff4dd] border border-[#f0dfbb] text-xs font-medium text-[#8b4b00]">
                        Product: {productOptions.find((p) => p.value === selectedProduct)?.label}
                      </span>
                    )}
                    {selectedVariant && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff4dd] border border-[#f0dfbb] text-xs font-medium text-[#8b4b00]">
                        Variant: {variantOptions.find((v) => v.value === selectedVariant)?.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-[#f0dfbb]" />

          {/* ── VISIBILITY ────────────────────────────────────────── */}
          <div>
            <SectionLabel>Visibility &amp; Display Options</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {[
                { val: "public", label: "Public", desc: "Visible to all customers on the website" },
                { val: "private", label: "Private", desc: "Hidden — only works when shared directly" },
              ].map(({ val, label, desc }) => (
                <button key={val} type="button" onClick={() => setVisibility(val)} disabled={isViewMode}
                  className={`text-left p-4 rounded-xl border-2 transition ${visibility === val ? "border-[#d98a11] bg-[#fff4dd]" : "border-gray-200 bg-white hover:border-[#f0dfbb]"}`}
                >
                  <p className={`text-sm font-semibold ${visibility === val ? "text-[#8b4b00]" : "text-gray-700"}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-1">{desc}</p>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>

              <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {isActive ? "Active" : "Inactive"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isActive
                      ? "Coupon is live and can be redeemed"
                      : "Coupon is disabled and cannot be used"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isViewMode || couponInActive}
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isActive ? "bg-[#d98a11]" : "bg-gray-300"
                    } ${isViewMode ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f0dfbb]" />



          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition text-sm"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>

            {mode !== "view" && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#d98a11] text-white font-semibold hover:bg-[#b96f00] transition text-sm"
              >
                {mode === "edit" ? "Update Coupon" : "Create Coupon"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
