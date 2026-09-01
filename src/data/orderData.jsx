import { Ring, Bangles, Chains, Earrings, Nacklace, Pendent, Braclet } from "../assets/dummy";
export const processedProductsDummy = [
  {
    orderId: "ORD1001",
    createdAt: "2025-01-10T10:30:00Z",
    paymentMethod: "online",
    totalAmount: 1899.50,
    status: "newRequest",
    user: { name: "Amit Sharma", mobileNumber: "9876543210", email: "amit@example.com" },
    subTotal: 2000,
    discountAmount: 100,
    gstAmount: 120,
    handlingCharges: 20,

    address: {
      buildingBlock: "A",
      flatNo: "203",
      buildingName: "Sunshine Residency",
      streetName: "MG Road",
      landmark: "Near City Mall",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },

    shipment: {
      trackingId: "https://tracknow.com/SH1001",
      estimatedDeliveryDate: "2025-01-20T00:00:00Z",
    },

    items: [
      {
        quantity: 1,
        price: 1099,
        discount: 100,
        name: "Diamond Ring",
        product: {
          productName: "Diamond Ring",
          images: [Nacklace, Pendent, Chains, Braclet],
        },
      },
      {
        quantity: 1,
        price: 900,
        discount: 100,
        name: "Gold Bracelet",
        product: {
          productName: "Gold Bracelet",
          images: [Nacklace, Pendent, Earrings, Braclet],
        },
      },
    ],
  },

  {
    orderId: "ORD1002",
    createdAt: "2025-01-12T14:20:00Z",
    paymentMethod: "cod",
    totalAmount: 2499,
    status: "processing",
    user: { name: "Priya Gupta", mobileNumber: "9876501234", email: "priya@example.com" },

    subTotal: 2600,
    discountAmount: 100,
    gstAmount: 150,
    handlingCharges: 20,

    address: {
      buildingBlock: "B",
      flatNo: "101",
      buildingName: "Green Valley",
      streetName: "Baner Road",
      landmark: "Opp. D-Mart",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
    },

    shipment: {
      trackingId: "https://tracknow.com/SH1002",
      estimatedDeliveryDate: "2025-01-22T00:00:00Z",
    },

    items: [
      {
        quantity: 2,
        price: 1200,
        discount: 50,
        name: "Silver Anklet",
        product: {
          productName: "Silver Anklet",
          images: [Nacklace, Pendent, Chains, Bangles],
        },
      },
    ],
  },

  {
    orderId: "ORD1003",
    createdAt: "2025-01-13T09:50:00Z",
    paymentMethod: "online",
    totalAmount: 3499.75,
    status: "shipped",
    user: { name: "Rajesh Kumar", mobileNumber: "9822345678", email: "rajesh@example.com" },

    subTotal: 3600,
    discountAmount: 100,
    gstAmount: 200,
    handlingCharges: 50,

    address: {
      buildingBlock: "C",
      flatNo: "19B",
      buildingName: "Skyline Tower",
      streetName: "FC Road",
      landmark: "Near Coffee House",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },

    shipment: {
      trackingId: "https://tracknow.com/SH1003",
      estimatedDeliveryDate: "2025-01-25T00:00:00Z",
    },

    items: [
      {
        quantity: 1,
        price: 1800,
        discount: 100,
        name: "Rose Gold Earrings",
        product: {
          productName: "Rose Gold Earrings",
          images: [Ring, Pendent, Chains, Braclet],
        },
      },
      {
        quantity: 1,
        price: 1900,
        discount: 200,
        name: "Platinum Pendant",
        product: {
          productName: "Platinum Pendant",
          images: [Chains, Pendent, Chains, Braclet],
        },
      },
    ],
  },

  {
    orderId: "ORD1004",
    createdAt: "2025-01-14T13:05:00Z",
    paymentMethod: "upi",
    totalAmount: 999.0,
    status: "outForDelivery",
    user: { name: "Sneha Patil", mobileNumber: "9123456780", email: "sneha@example.com" },

    subTotal: 1100,
    discountAmount: 100,
    gstAmount: 50,
    handlingCharges: 20,

    address: {
      buildingBlock: "D",
      flatNo: "504",
      buildingName: "Palm Heights",
      streetName: "JM Road",
      landmark: "Near Star Bazaar",
      city: "Nashik",
      state: "Maharashtra",
      pincode: "422001",
    },

    shipment: {
      trackingId: "https://tracknow.com/SH1004",
      estimatedDeliveryDate: "2025-01-21T00:00:00Z",
    },

    items: [
      {
        quantity: 1,
        price: 999,
        discount: 50,
        name: "Pearl Necklace",
        product: {
          productName: "Pearl Necklace",
          images: [Bangles, Pendent, Chains, Braclet],
        },
      },
    ],
  },

  {
    orderId: "ORD1005",
    createdAt: "2025-01-15T16:40:00Z",
    paymentMethod: "online",
    totalAmount: 2799.2,
    status: "delivered",
    user: { name: "Rohan Joshi", mobileNumber: "9090909090", email: "rohan@example.com" },

    subTotal: 2900,
    discountAmount: 100,
    gstAmount: 150,
    handlingCharges: 20,

    address: {
      buildingBlock: "E",
      flatNo: "12A",
      buildingName: "Golden Nest",
      streetName: "Link Road",
      landmark: "Near Hotel Plaza",
      city: "Thane",
      state: "Maharashtra",
      pincode: "400602",
    },

    shipment: {
      trackingId: "https://tracknow.com/SH1005",
      estimatedDeliveryDate: "2025-01-23T00:00:00Z",
    },

    items: [
      {
        quantity: 1,
        price: 1600,
        discount: 100,
        name: "Diamond Nose Pin",
        product: {
          productName: "Diamond Nose Pin",
          images: [Chains, Pendent, Chains, Braclet],
        },
      },
      {
        quantity: 1,
        price: 1300,
        discount: 50,
        name: "Silver Chain",
        product: {
          productName: "Silver Chain",
          images: [Pendent, Pendent, Chains, Braclet],
        },
      },
    ],
  },

  {
    orderId: "ORD1006",
    createdAt: "2025-01-16T11:15:00Z",
    paymentMethod: "cod",
    totalAmount: 1599,
    status: "cancelled",
    user: { name: "Kunal Singh", mobileNumber: "9999999999", email: "kunal@example.com" },

    subTotal: 1700,
    discountAmount: 100,
    gstAmount: 80,
    handlingCharges: 20,

    address: {
      buildingBlock: "F",
      flatNo: "301",
      buildingName: "Silver Oak",
      streetName: "Tilak Road",
      landmark: "Near Old Bus Stand",
      city: "Nagpur",
      state: "Maharashtra",
      pincode: "440001",
    },

    shipment: {
      trackingId: "https://tracknow.com/SH1006",
      estimatedDeliveryDate: "2025-01-24T00:00:00Z",
    },

    items: [
      {
        quantity: 1,
        price: 1599,
        discount: 100,
        name: "Gold Bangle",
        product: {
          productName: "Gold Bangle",
          images: [Pendent, Pendent, Chains, Braclet],
        },
      },
    ],
  },
];
