const couponData = [
  {
    id: "1",
    code: "WINTER50",
    name: "Winter Clearance",
    description: "50% off on your winter wardrobe essentials",

    usedCount: 500, // Maximum usage limit
    totalUsedCount: 0, // Used so far

    discountType: "percentage",
    discountValue: 50,

    applicableType: "category",

    minOrderAmount: 2000,
    maxOrderAmount: 10000,

    visibility: "Public",

    startDate: "2026-12-01",
    endDate: "2027-01-31",

    isActive: true,

    productIds: [40],
    categoryIds: [4],
    variantIds: [],
  },

  {
    id: "2",
    code: "FLAT500",
    name: "Mega Festive Bonanza",
    description: "Flat ₹500 off on high-value orders",

    usedCount: 100,
    totalUsedCount: 12,

    discountType: "amount",
    discountValue: 500,

    applicableType: "product",

    minOrderAmount: 5000,
    maxOrderAmount: 20000,

    visibility: "Public",

    startDate: "2026-10-20",
    endDate: "2026-10-30",

    isActive: true,

    productIds: [40],
    categoryIds: [],
    variantIds: [],
  },

  {
    id: "3",
    code: "VIPSECRET",
    name: "Exclusive Member Discount",
    description: "Special 25% off for private community members",

    usedCount: 50,
    totalUsedCount: 45,

    discountType: "percentage",
    discountValue: 25,

    applicableType: "variant",

    minOrderAmount: 0,
    maxOrderAmount: 15000,

    visibility: "Private",

    startDate: "2026-08-15",
    endDate: "2026-09-15",

    isActive: true,

    productIds: [40],
    categoryIds: [4],
    variantIds: [58],
  },

  {
    id: "4",
    code: "FIRST150",
    name: "First Order Deal",
    description: "Flat ₹150 off for your first purchase",

    usedCount: 1000,
    totalUsedCount: 150,

    discountType: "amount",
    discountValue: 150,

    applicableType: "all",

    minOrderAmount: 750,
    maxOrderAmount: null,

    visibility: "Public",

    startDate: "2026-01-01",
    endDate: "2026-12-31",

    isActive: false,

    productIds: [],
    categoryIds: [],
    variantIds: [],
  },

  {
    id: "5",
    code: "FLASH10",
    name: "Midnight Flash Sale",
    description: "Quick 10% off during midnight rush hours",

    usedCount: 100,
    totalUsedCount: 89,

    discountType: "percentage",
    discountValue: 10,

    applicableType: "product",

    minOrderAmount: 1000,
    maxOrderAmount: 5000,

    visibility: "Public",

    startDate: "2026-06-18",
    endDate: "2026-06-19",

    isActive: true,

    productIds: [25],
    categoryIds: [],
    variantIds: [],
  },
];

export default couponData;