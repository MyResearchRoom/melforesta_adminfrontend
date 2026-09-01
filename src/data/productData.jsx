import { Ring, Bangles, Chains, Earrings, Nacklace, Pendent, Braclet } from "../assets/dummy";

export const jewelleryProducts = [
  // RINGS -----------------------------------------
  {
    id: 1,
    model: "JR001",
    specifications: {
      design: "Intricate rose-gold handcrafted engagement design",
      stoneSetting: "Enhanced sparkle stone setting",
      coating: "Smooth anti-tarnish coating"
    },
    title: "Elegant Diamond Ring",
    category: "Rings",
    price: 24999,
    discountPrice: 19999,
    discountPercent: 20,
    images: [Ring, Bangles, Chains, Earrings],
    rating: 3,
    inStock: true,
    description:
      "A beautifully crafted diamond ring made with 18K yellow gold. Designed for elegance and daily wear, this ring features a sparkling solitaire diamond that adds a timeless charm.",
    attributes: {
      purity: "18K Gold",
      material: "Yellow Gold",
      weight: "3.2g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size", "Small", "Medium", "Large"],
      designStyle: "Solitaire Ring",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Casual Wear", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 2,
    model: "JR002",
    specifications: {
      design: "Premium solitaire diamond with high-shine polish",
      durability: "Scratch-resistant long-lasting shine",
      comfort: "Comfort-fit band for daily wear"
    },
    title: "Rose Gold Engagement Ring",
    category: "Rings",
    price: 28999,
    discountPrice: 22999,
    discountPercent: 21,
    images: [Ring, Chains, Earrings, Braclet],
    rating: 5,
    inStock: true,
    description:
      "A romantic rose-gold engagement ring designed with intricate craftsmanship. Its premium stone setting ensures a striking sparkle for every occasion.",
    attributes: {
      purity: "14K Gold",
      material: "Rose Gold",
      weight: "2.9g",
      color: ["Rose Gold", "White Gold", "Yellow Gold"],
      size: ["Free Size", "Small", "Medium", "Large"],
      designStyle: "Engagement Ring",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Engagement", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },

  // EARRINGS -----------------------------------------
  {
    id: 3,
    model: "JE003",
    specifications: {
      weight: "Ultra-lightweight 22K studs for daily comfort",
      material: "Skin-friendly hypoallergenic material",
      closure: "Secure screw-back design"
    },
    title: "Classic Gold Stud Earrings",
    category: "Earrings",
    price: 15999,
    discountPrice: 12999,
    discountPercent: 19,
    images: [Earrings, Ring, Chains, Braclet],
    rating: 4,
    inStock: true,
    description:
      "A timeless pair of 22K gold stud earrings perfect for everyday wear. Lightweight, durable, and elegant — ideal for both traditional and western outfits.",
    attributes: {
      purity: "22K Gold",
      material: "Gold",
      weight: "5.1g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size"],
      designStyle: "Stud Earrings",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Daily Wear", "Festive Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 4,
    model: "JE004",
    specifications: {
      pearls: "Premium freshwater pearls with 18K gold finish",
      design: "Elegant long-drop design",
      comfort: "Lightweight daily-wear comfort"
    },
    title: "Pearl Drop Earrings",
    category: "Earrings",
    price: 11999,
    discountPrice: 9499,
    discountPercent: 21,
    images: [Earrings, Pendent, Braclet, Bangles],
    rating: 4,
    inStock: true,
    description:
      "Graceful pearl drop earrings crafted from 18K gold, featuring premium freshwater pearls for a rich and sophisticated look.",
    attributes: {
      purity: "18K Gold",
      material: "Gold + Pearl",
      weight: "4.3g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size"],
      designStyle: "Drop Earrings",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Festive Wear", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },

  // NECKLACES -----------------------------------------
  {
    id: 5,
    model: "JN005",
    specifications: {
      pendant: "Natural diamond pendant with 18K gold setting",
      cut: "High-reflection diamond cut",
      chain: "Tangle-free premium chain"
    },
    title: "Diamond Pendant Necklace",
    category: "Necklaces",
    price: 35999,
    discountPrice: 29999,
    discountPercent: 17,
    images: [Nacklace, Pendent, Chains, Braclet],
    rating: 5,
    inStock: true,
    description:
      "An elegant diamond pendant necklace designed with premium natural diamonds set in 18K gold. A perfect blend of luxury and sophistication.",
    attributes: {
      purity: "18K Gold",
      material: "Gold + Diamond",
      weight: "6.5g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      length: "18 inches",
      size: ["Free Size"],
      designStyle: "Pendant Necklace",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Festive Wear", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 6,
    model: "JN006",
    specifications: {
      design: "Traditional 22K handcrafted premium necklace",
      finish: "Rich antique finishing",
      clasp: "Extra-strong clasp locking"
    },
    title: "Traditional Gold Necklace",
    category: "Necklaces",
    price: 54999,
    discountPrice: 46999,
    discountPercent: 15,
    images: [Nacklace, Bangles, Braclet, Chains],
    rating: 5,
    inStock: false,
    description:
      "A statement 22K gold necklace with a traditional handcrafted pattern. Perfect for weddings, festive occasions, and celebrations.",
    attributes: {
      purity: "22K Gold",
      material: "Gold",
      weight: "18g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      length: "20 inches",
      size: ["Free Size"],
      designStyle: "Traditional Necklace",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Weddings", "Festive Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },

  // CHAINS -----------------------------------------
  {
    id: 7,
    model: "JC007",
    specifications: {
      durability: "Durable 22K gold chain for everyday use",
      finish: "Sweat-resistant smooth finish",
      shine: "Long-lasting shine coating"
    },
    title: "Lightweight Gold Chain",
    category: "Chains",
    price: 22999,
    discountPrice: 18999,
    discountPercent: 17,
    images: [Chains, Braclet, Nacklace, Bangles],
    rating: 4,
    inStock: true,
    description:
      "A subtle and stylish 22K gold chain suitable for everyday wear. Durable design with a fine finish to complement any attire.",
    attributes: {
      purity: "22K Gold",
      material: "Gold",
      weight: "7.9g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      length: "20 inches",
      size: ["Free Size"],
      designStyle: "Chain Necklace",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Men", "Women"],
      occasion: ["Daily Wear", "Casual Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 8,
    model: "JC008",
    specifications: {
      design: "Premium box-style chain with long-lasting strength",
      style: "Modern unisex design",
      durability: "Break-resistant chain links"
    },
    title: "Box Chain Gold Necklace",
    category: "Chains",
    price: 27999,
    discountPrice: 23999,
    discountPercent: 14,
    images: [Chains, Braclet, Ring, Bangles],
    rating: 4,
    inStock: true,
    description:
      "A premium box-style gold chain crafted with precision for long-lasting durability. Its bold yet minimal look suits both men and women.",
    attributes: {
      purity: "18K Gold",
      material: "Gold",
      weight: "9.2g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      length: "22 inches",
      size: ["Free Size"],
      designStyle: "Box Chain Necklace",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Men", "Women"],
      occasion: ["Daily Wear", "Casual Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },

  // BRACELETS -----------------------------------------
  {
    id: 9,
    model: "JB009",
    specifications: {
      design: "Elegant link design crafted in premium 22K gold",
      clasp: "Sturdy lobster-clasp locking",
      comfort: "Smooth edge design for comfort"
    },
    title: "Gold Link Bracelet",
    category: "Bracelets",
    price: 19999,
    discountPrice: 16999,
    discountPercent: 15,
    images: [Braclet, Bangles, Chains, Ring],
    rating: 4,
    inStock: true,
    description:
      "A beautifully linked 22K gold bracelet featuring a modern yet classic design. Ideal for gifting and daily style.",
    attributes: {
      purity: "22K Gold",
      material: "Gold",
      weight: "8.1g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      claspType: "Lobster Clasp",
      length: "7 inches",
      width: "3mm",
      size: ["Free Size", "Small", "Medium", "Large"],
      designStyle: "Link Bracelet",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women", "Girls"],
      occasion: ["Daily Wear", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 10,
    model: "JB010",
    specifications: {
      design: "Delicate gold charm bracelet with modern accents",
      comfort: "Lightweight, easy-to-wear design",
      coating: "Anti-tarnish finishing"
    },
    title: "Charm Gold Bracelet",
    category: "Bracelets",
    price: 24999,
    discountPrice: 20999,
    discountPercent: 16,
    images: [Braclet, Bangles, Ring, Chains],
    rating: 5,
    inStock: true,
    description:
      "A delicate charm bracelet crafted in 18K gold, featuring small ornamental elements for a cute and stylish appearance.",
    attributes: {
      purity: "18K Gold",
      material: "Gold",
      weight: "7.4g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      claspType: "Lobster Clasp",
      length: "7 inches",
      width: "2mm",
      size: ["Free Size", "Small", "Medium", "Large"],
      designStyle: "Charm Bracelet",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women", "Girls"],
      occasion: ["Festive Wear", "Casual Wear", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },

  // BANGLES -----------------------------------------
  {
    id: 11,
    model: "JBA011",
    specifications: {
      design: "Traditional handcrafted 22K gold carving",
      detailing: "Intricate detailing with antique look",
      durability: "Durable non-bend structure"
    },
    title: "Traditional Gold Bangles",
    category: "Bangles",
    price: 45999,
    discountPrice: 39999,
    discountPercent: 13,
    images: [Bangles, Braclet, Ring, Chains],
    rating: 5,
    inStock: true,
    description:
      "A pair of handcrafted 22K gold bangles with intricate traditional artistry, perfect for cultural events and weddings.",
    attributes: {
      purity: "22K Gold",
      material: "Gold",
      weight: "22g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size", "Small", "Medium", "Large"],
      designStyle: "Traditional Bangles",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Weddings", "Festive Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 12,
    model: "JBA012",
    specifications: {
      design: "Modern carved 18K gold designer pattern",
      comfort: "Soft inner lining for all-day comfort",
      style: "Luxury lightweight design"
    },
    title: "Designer Gold Bangles",
    category: "Bangles",
    price: 49999,
    discountPrice: 42999,
    discountPercent: 14,
    images: [Bangles, Ring, Chains, Braclet],
    rating: 4,
    inStock: true,
    description:
      "Stylish 18K gold bangles featuring a modern carved design. Lightweight yet elegant for daily wear and celebrations.",
    attributes: {
      purity: "18K Gold",
      material: "Gold",
      weight: "19g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size", "Small", "Medium", "Large"],
      designStyle: "Designer Bangles",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Casual Wear", "Festive Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },

  // PENDANTS -----------------------------------------
  {
    id: 13,
    model: "JP013",
    specifications: {
      design: "Heart-shaped diamond charm in 18K gold",
      clarity: "High-clarity stone setting",
      comfort: "Minimalist lightweight design"
    },
    title: "Heart-Shaped Diamond Pendant",
    category: "Pendants",
    price: 16999,
    discountPrice: 13999,
    discountPercent: 18,
    images: [Pendent, Nacklace, Ring, Chains],
    rating: 5,
    inStock: true,
    description:
      "A romantic heart-shaped pendant crafted in 18K gold with a sparkling diamond centerpiece. An ideal gift for loved ones.",
    attributes: {
      purity: "18K Gold",
      material: "Gold + Diamond",
      weight: "3g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size"],
      designStyle: "Heart Pendant",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women"],
      occasion: ["Engagement", "Gifting"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  },
  {
    id: 14,
    model: "JP014",
    specifications: {
      design: "Spiritual Om design crafted in pure 22K gold",
      finish: "High-polish finish for lasting shine",
      usage: "Compact design ideal for daily wear"
    },
    title: "Om Gold Pendant",
    category: "Pendants",
    price: 11999,
    discountPrice: 9999,
    discountPercent: 17,
    images: [Pendent, Bangles, Braclet, Ring],
    rating: 4,
    inStock: true,
    description:
      "A spiritual 'Om' gold pendant made in 22K purity. Symbolic, elegant, and suitable for daily spiritual wear.",
    attributes: {
      purity: "22K Gold",
      material: "Gold",
      weight: "4.5g",
      color: ["Yellow Gold", "White Gold", "Rose Gold"],
      size: ["Free Size"],
      designStyle: "Om Pendant",
      hallmarkCertified: true,
      warranty: "1 Year Warranty",
      suitableFor: ["Women", "Men"],
      occasion: ["Spiritual Wear", "Daily Wear"],
      manufacturingType: "Handcrafted",
      plating: "High Polish Finish"
    }
  }
];
