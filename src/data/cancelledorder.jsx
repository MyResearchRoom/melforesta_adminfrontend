import { Ring, Bangles, Chains, Earrings, Nacklace, Pendent, Braclet } from "../assets/dummy";
export const cancelOrderDummyData = [
  {
    id: "CNL-1001",
    orderId: "ORD-5001",
    reason: "Wrong size delivered",
    status: "pending",
    refundAmount: 1299,
    createdAt: "2025-01-18T10:30:00Z",

    user: {
      name: "john doe",
      mobileNumber: "9876543210",
      email: "john@example.com",
    },

    order: {
      paymentMethod: "online",
    },

    orderItem: {
      quantity: 1,
      price: 1499,
      discount: 200,
      totalPrice: 1299,
      product: {
        productName: "Classic Silver Ring",
        images: [Nacklace, Pendent, Chains, Braclet],
      }
    }
  },

  {
    id: "CNL-1002",
    orderId: "ORD-5008",
    reason: "Product damaged on arrival",
    status: "refunded",
    refundAmount: 2199,
    createdAt: "2025-01-20T15:45:00Z",

    user: {
      name: "anjali sharma",
      mobileNumber: "9087654321",
      email: "anjali@example.com",
    },

    order: {
      paymentMethod: "cod",
    },

    orderItem: {
      quantity: 2,
      price: 1500,
      discount: 801,
      totalPrice: 2199,
      product: {
        productName: "Gold Plated Earrings",
        images: [Pendent, Pendent, Chains, Braclet],
      }
    }
  },

  {
    id: "CNL-1003",
    orderId: "ORD-5015",
    reason: "Found cheaper elsewhere",
    status: "pending",
    refundAmount: 899,
    createdAt: "2025-01-22T12:10:00Z",

    user: {
      name: "rohit verma",
      mobileNumber: "9123456780",
      email: "rohit@example.com",
    },

    order: {
      paymentMethod: "online",
    },

    orderItem: {
      quantity: 1,
      price: 999,
      discount: 100,
      totalPrice: 899,
      product: {
        productName: "Elegant Bracelet",
        images: [Chains, Pendent, Chains, Braclet],
      }
    }
  },

  {
    id: "CNL-1004",
    orderId: "ORD-5022",
    reason: "Color mismatch",
    status: "refunded",
    refundAmount: 1599,
    createdAt: "2025-01-25T14:20:00Z",

    user: {
      name: "meera patil",
      mobileNumber: "9845123760",
      email: "meera@example.com",
    },

    order: {
      paymentMethod: "online",
    },

    orderItem: {
      quantity: 1,
      price: 1799,
      discount: 200,
      totalPrice: 1599,
      product: {
        productName: "Rose Gold Pendant",
        images: [Braclet, Pendent, Chains, Braclet],
      }
    }
  },

  {
    id: "CNL-1005",
    orderId: "ORD-5030",
    reason: "Delivered late",
    status: "pending",
    refundAmount: 2499,
    createdAt: "2025-01-26T09:05:00Z",

    user: {
      name: "sagar naik",
      mobileNumber: "9023456712",
      email: "sagar@example.com",
    },

    order: {
      paymentMethod: "cod",
    },

    orderItem: {
      quantity: 1,
      price: 2799,
      discount: 300,
      totalPrice: 2499,
      product: {
        productName: "Premium Gold Chain",
        images: [Bangles, Pendent, Chains, Braclet],
      }
    }
  },

  {
    id: "CNL-1006",
    orderId: "ORD-5038",
    reason: "Not matching description",
    status: "refunded",
    refundAmount: 1799,
    createdAt: "2025-01-28T16:25:00Z",

    user: {
      name: "priya rathod",
      mobileNumber: "9988776655",
      email: "priya@example.com",
    },

    order: {
      paymentMethod: "online",
    },

    orderItem: {
      quantity: 1,
      price: 1999,
      discount: 200,
      totalPrice: 1799,
      product: {
        productName: "Diamond Stud Earrings",
        images: [Earrings, Ring, Chains, Braclet],
      }
    }
  }
];
