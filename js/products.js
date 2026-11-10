/*
  NOHÉ — PRODUCT CATALOGUE
  -------------------------------------------------------------
  Edit this file to add / change products. No coding knowledge
  needed beyond copying an entry and changing the values.

  image:   put a photo in /assets/products/ and write its path,
           e.g. "assets/products/aria-dress.jpg".
           Leave it "" to show the illustrated placeholder.
  art:     placeholder illustration: dress | top | skirt | trousers | coord | blazer | kurta
  category: Dresses | Co-ords | Tops | Bottoms | Tailoring | Kurta Sets
  gender:  "women" (later "men" — the site is ready for it)
  colors:  [name, hex] pairs. First colour is the default.
*/
window.NOHE_PRODUCTS = [
  {
    id: "aria-slip-dress",
    name: "Aria Satin Slip Dress",
    category: "Dresses", gender: "women", collection: "Soft Bloom",
    price: 4290, compareAt: null, isNew: true, bestseller: true,
    art: "dress", image: "",
    colors: [["Clay", "#c98b6f"], ["Ivory", "#ece2d3"], ["Ink", "#2b2725"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "A bias-cut slip in fluid satin that skims the body and moves with you. Adjustable straps and a softly draped cowl neckline.",
    details: ["Bias cut, midi length", "Adjustable straps", "100% viscose satin", "Model is 5'7\" wearing S"]
  },
  {
    id: "mira-linen-coord",
    name: "Mira Linen Co-ord Set",
    category: "Co-ords", gender: "women", collection: "Soft Bloom",
    price: 5490, compareAt: 6290, isNew: true, bestseller: false,
    art: "coord", image: "",
    colors: [["Sage", "#8c8f74"], ["Sand", "#d9c3a5"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: ["XS"],
    description: "Relaxed button-front shirt paired with a high-waisted wide-leg trouser. Wear them together or style separately.",
    details: ["Pure washed linen", "Coconut shell buttons", "Elasticated back waist", "Sold as a set"]
  },
  {
    id: "lena-poplin-blouse",
    name: "Lena Poplin Blouse",
    category: "Tops", gender: "women", collection: "Essentials",
    price: 2190, compareAt: null, isNew: false, bestseller: true,
    art: "top", image: "",
    colors: [["Ivory", "#efe6d8"], ["Powder Blue", "#b9c7cf"], ["Blush", "#e3bfb2"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "Crisp cotton poplin with softly gathered sleeves and a relaxed fit. The blouse you'll wear on repeat.",
    details: ["100% cotton poplin", "Balloon sleeves", "Mother-of-pearl buttons", "Relaxed fit"]
  },
  {
    id: "sienna-midi-skirt",
    name: "Sienna Pleated Midi Skirt",
    category: "Bottoms", gender: "women", collection: "Soft Bloom",
    price: 2890, compareAt: null, isNew: true, bestseller: false,
    art: "skirt", image: "",
    colors: [["Ink", "#3f3a36"], ["Clay", "#b9806a"]],
    sizes: ["XS", "S", "M", "L"], soldOut: ["L"],
    description: "Soft knife pleats that swing as you walk. Sits at the natural waist with a concealed side zip.",
    details: ["Midi length", "Concealed side zip", "Poly-viscose blend", "Fully lined"]
  },
  {
    id: "noor-kurta-set",
    name: "Noor Chanderi Kurta Set",
    category: "Kurta Sets", gender: "women", collection: "Festive Edit",
    price: 6490, compareAt: null, isNew: true, bestseller: true,
    art: "kurta", image: "",
    colors: [["Rose Clay", "#d7b8a0"], ["Mint", "#bfcdb8"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "A modern straight kurta in airy chanderi with hand-finished neckline, paired with slim pants and a sheer dupatta.",
    details: ["Chanderi silk-cotton", "3-piece set", "Hand-finished detailing", "Dry clean recommended"]
  },
  {
    id: "elle-tailored-blazer",
    name: "Elle Tailored Blazer",
    category: "Tailoring", gender: "women", collection: "Essentials",
    price: 5990, compareAt: null, isNew: false, bestseller: false,
    art: "blazer", image: "",
    colors: [["Ink", "#2f2b28"], ["Camel", "#b8926c"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "A softly structured single-breasted blazer with a slightly oversized fit. Over a slip dress or with denim — it just works.",
    details: ["Soft shoulder", "Single button closure", "Wool-blend suiting", "Fully lined"]
  },
  {
    id: "rhea-wide-leg-trousers",
    name: "Rhea Wide-Leg Trousers",
    category: "Bottoms", gender: "women", collection: "Essentials",
    price: 3290, compareAt: null, isNew: false, bestseller: true,
    art: "trousers", image: "",
    colors: [["Olive", "#a7a58c"], ["Ink", "#2f2b28"], ["Ivory", "#ece2d3"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: ["XL"],
    description: "High-rise, floor-grazing and endlessly flattering. Front pleats and deep side pockets.",
    details: ["High rise", "Front pleats", "Side pockets", "Linen-viscose blend"]
  },
  {
    id: "tara-wrap-dress",
    name: "Tara Wrap Midi Dress",
    category: "Dresses", gender: "women", collection: "Soft Bloom",
    price: 3990, compareAt: 4590, isNew: false, bestseller: false,
    art: "dress", image: "",
    colors: [["Terracotta", "#b9806a"], ["Sage", "#8c8f74"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "A true wrap dress that flatters every shape, with a tie waist and fluttery sleeves.",
    details: ["True wrap, tie waist", "Flutter sleeves", "Crepe viscose", "Midi length"]
  },
  {
    id: "isla-knit-top",
    name: "Isla Ribbed Knit Top",
    category: "Tops", gender: "women", collection: "Essentials",
    price: 1790, compareAt: null, isNew: true, bestseller: false,
    art: "top", image: "",
    colors: [["Oat", "#ddc7b0"], ["Ink", "#3f3a36"], ["Rose", "#d9a99a"]],
    sizes: ["XS", "S", "M", "L"], soldOut: [],
    description: "Soft, stretchy rib knit with a gentle square neck. Tuck it, layer it, live in it.",
    details: ["Fine rib knit", "Square neckline", "Cotton-modal blend", "Slim fit"]
  },
  {
    id: "zoya-satin-coord",
    name: "Zoya Satin Shirt & Skirt Set",
    category: "Co-ords", gender: "women", collection: "Festive Edit",
    price: 5790, compareAt: null, isNew: false, bestseller: true,
    art: "coord", image: "",
    colors: [["Champagne", "#e2cbb6"], ["Wine", "#7a3b3b"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "Liquid satin shirt with a matching bias midi skirt — evening ready, effortlessly.",
    details: ["Viscose satin", "Relaxed shirt + bias skirt", "Covered buttons", "Sold as a set"]
  },
  {
    id: "ava-linen-dress",
    name: "Ava Linen Shirt Dress",
    category: "Dresses", gender: "women", collection: "Essentials",
    price: 3690, compareAt: null, isNew: false, bestseller: false,
    art: "dress", image: "",
    colors: [["Ivory", "#ece2d3"], ["Sky", "#b9c7cf"]],
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [],
    description: "A breezy button-through shirt dress with a removable belt. Holiday, office, weekend.",
    details: ["Washed linen", "Removable belt", "Side pockets", "Midi length"]
  },
  {
    id: "maya-mini-skirt",
    name: "Maya A-Line Mini Skirt",
    category: "Bottoms", gender: "women", collection: "Soft Bloom",
    price: 2390, compareAt: null, isNew: true, bestseller: false,
    art: "skirt", image: "",
    colors: [["Blush", "#e3bfb2"], ["Ink", "#3f3a36"]],
    sizes: ["XS", "S", "M", "L"], soldOut: [],
    description: "A clean A-line mini in structured cotton twill. Pair with the Lena blouse for the perfect day look.",
    details: ["Cotton twill", "Back zip", "A-line shape", "Mini length"]
  }
];
