export const products = [
  // Skincare Products
  {
    id: 1,
    name: "Hydrating Vitamin C Serum",
    category: "skincare",
    price: 600,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    description:
      "A powerful vitamin C serum that brightens and hydrates your skin for a radiant glow.",
    ingredients: ["Vitamin C", "Hyaluronic Acid", "Niacinamide"],
    inStock: true,
    rating: 4.8,
    reviews: 324,
  },
  {
    id: 2,
    name: "Gentle Cleansing Foam",
    category: "skincare",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    description:
      "A gentle, sulfate-free cleanser that removes makeup and impurities without stripping your skin.",
    ingredients: ["Ceramides", "Glycerin", "Chamomile Extract"],
    inStock: true,
    rating: 4.6,
    reviews: 189,
  },
  {
    id: 3,
    name: "Retinol Night Cream",
    category: "skincare",
    price: 1280,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    description:
      "Anti-aging night cream with retinol to reduce fine lines and improve skin texture.",
    ingredients: ["Retinol", "Peptides", "Shea Butter"],
    inStock: true,
    rating: 4.9,
    reviews: 456,
  },
  {
    id: 4,
    name: "Hydrating Face Mask",
    category: "skincare",
    price: 455,
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
    description:
      "Intensive hydrating mask with hyaluronic acid for plump, moisturized skin.",
    ingredients: ["Hyaluronic Acid", "Aloe Vera", "Cucumber Extract"],
    inStock: true,
    rating: 4.7,
    reviews: 267,
  },

  // Makeup Products
  {
    id: 5,
    name: "Full Coverage Foundation",
    category: "makeup",
    price: 1520,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    description:
      "Long-lasting, full coverage foundation available in 40 shades.",
    ingredients: ["Titanium Dioxide", "Iron Oxides", "Dimethicone"],
    inStock: true,
    rating: 4.5,
    reviews: 892,
  },
  {
    id: 6,
    name: "Matte Liquid Lipstick",
    category: "makeup",
    price: 289,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    description:
      "Long-wearing matte liquid lipstick that doesn't dry out your lips.",
    ingredients: ["Vitamin E", "Jojoba Oil", "Carnauba Wax"],
    inStock: true,
    rating: 4.4,
    reviews: 634,
  },
  {
    id: 7,
    name: "Eyeshadow Palette",
    category: "makeup",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1650664370914-f026578ec2a4?q=80&w=769&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop",
    description: "18-shade eyeshadow palette with matte and shimmer finishes.",
    ingredients: ["Mica", "Talc", "Magnesium Stearate"],
    inStock: true,
    rating: 4.8,
    reviews: 445,
  },
  {
    id: 8,
    name: "Volumizing Mascara",
    category: "makeup",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1619168213439-8af6b0fd5956?q=80&w=707&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop",
    description:
      "Waterproof volumizing mascara for dramatic, long-lasting lashes.",
    ingredients: ["Beeswax", "Carnauba Wax", "Iron Oxides"],
    inStock: false,
    rating: 4.6,
    reviews: 523,
  },

  // Haircare Products
  {
    id: 9,
    name: "Nourishing Hair Oil",
    category: "haircare",
    price: 1750,
    image:
      "https://images.unsplash.com/photo-1669281393011-c335050cf0e9?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop",
    description:
      "Lightweight hair oil that nourishes and adds shine without weighing hair down.",
    ingredients: ["Argan Oil", "Jojoba Oil", "Vitamin E"],
    inStock: true,
    rating: 4.7,
    reviews: 298,
  },
  {
    id: 10,
    name: "Repair Shampoo",
    category: "haircare",
    price: 2085,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    description:
      "Sulfate-free shampoo that repairs and strengthens damaged hair.",
    ingredients: ["Keratin", "Biotin", "Coconut Oil"],
    inStock: true,
    rating: 4.5,
    reviews: 412,
  },
  {
    id: 11,
    name: "Deep Conditioning Mask",
    category: "haircare",
    price: 550,
    image:
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=400&h=400&fit=crop",
    description: "Weekly deep conditioning treatment for dry and damaged hair.",
    ingredients: ["Shea Butter", "Avocado Oil", "Protein Complex"],
    inStock: true,
    rating: 4.9,
    reviews: 356,
  },
  {
    id: 12,
    name: "Heat Protection Spray",
    category: "haircare",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1651763473748-f3674427ade3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop",
    description:
      "Protects hair from heat damage up to 450°F while adding shine.",
    ingredients: ["Silicones", "UV Filters", "Panthenol"],
    inStock: true,
    rating: 4.4,
    reviews: 278,
  },

  {
    id: 13,
    name: "Brightening Eye Cream",
    category: "skincare",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop",
    description:
      "Reduces dark circles and puffiness while firming the delicate eye area.",
    ingredients: ["Caffeine", "Peptides", "Hyaluronic Acid"],
    inStock: true,
    rating: 4.6,
    reviews: 203,
  },
  {
    id: 14,
    name: "Contouring Kit",
    category: "makeup",
    price: 580,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    description:
      "Professional contouring kit with 6 shades for sculpting and highlighting.",
    ingredients: ["Mica", "Silica", "Dimethicone"],
    inStock: true,
    rating: 4.3,
    reviews: 167,
  },
  {
    id: 15,
    name: "Dry Shampoo",
    category: "haircare",
    price: 1490,
    image:
      "https://images.unsplash.com/photo-1630398917451-1a409990fbc5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop",
    description: "Refreshes hair between washes and adds volume at the roots.",
    ingredients: ["Rice Starch", "Tapioca Starch", "Fragrance"],
    inStock: true,
    rating: 4.2,
    reviews: 389,
  },
  {
    id: 16,
    name: "Exfoliating Scrub",
    category: "skincare",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1589504695518-a9a9ac06c2e9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop",
    description:
      "Gentle exfoliating scrub that removes dead skin cells for smoother skin.",
    ingredients: ["Jojoba Beads", "Glycolic Acid", "Aloe Vera"],
    inStock: true,
    rating: 4.5,
    reviews: 445,
  },
];

export const categories = [
  { name: "skincare", label: "Skincare", icon: "✨" },
  { name: "makeup", label: "Makeup", icon: "💄" },
  { name: "haircare", label: "Haircare", icon: "💇‍♀️" },
];

export const getProductById = (id) => {
  return products.find((product) => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  if (!category || category === "all") return products;
  return products.filter((product) => product.category === category);
};

export const searchProducts = (query, category = "all") => {
  let filteredProducts = getProductsByCategory(category);

  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  return filteredProducts;
};

export const filterProductsByPrice = (products, minPrice, maxPrice) => {
  return products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
};
