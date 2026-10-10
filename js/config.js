/* =====================================================================
   RIVA — SITE SETTINGS & PRODUCTS
   Edit this file to change prices, text, coupons and courier charges.
   You never need to write image paths: images are found automatically
   from their FILE NAMES (see README.md).  For a product with id
   "rose-fresh", upload  rose-fresh.jpg, rose-fresh-2.jpg, rose-fresh-3.jpg …
   ===================================================================== */

const SHIPPING = 250;            // flat courier charge per order (Rs.)
const COUPONS  = { INSTA: 15 };  // coupon code -> % off the products
const SLOTS    = 3;              // grid shows "Coming Soon" cards until this many products exist

const PRODUCTS = [
  {
    id: "aqua-fresh",            // <- image files are named after this id
    name: "Aqua Fresh",
    category: "Hydrating Facewash",
    description: "An everyday refreshing cleanser designed to leave skin feeling clean and fresh.",
    price: 1000,
    size: "50 ml / 1.7 fl oz",
    tone: "#9DBA9D",             // colour of the placeholder art shown if no photo has been uploaded yet
    skin: ["oily", "combination"],
    hover: 1,                    // which photo appears when hovering a catalog card (0 = first photo, 1 = second …)
    pos: { 1: "72% 50%" },       // optional crop focus per photo number (0-based) for square crops
    details: `Hydrating &amp; Refreshing Gel Cleanser with Rose Water, Aloe Vera &amp; Hyaluronic Acid.<br>On the box: gently cleanses, hydrates skin, refreshes daily.<br>Net content: 50 ml / 1.7 fl oz.`,
    usage: `Apply a small amount to damp skin, massage gently in circular motions, and rinse thoroughly with water. Use morning and evening as part of your daily routine.<br><br><b>Caution:</b> For external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Keep out of reach of children.`,
    ingredients: `Key ingredients (as printed on the pack): Rose Water, Aloe Vera &amp; Hyaluronic Acid. The full ingredient list will be added soon.`
  },
  {
    id: "aloe-fresh",
    name: "Aloe Fresh",
    category: "Aloe Facewash",
    description: "A refreshing aloe-inspired cleanser created for a simple daily skincare routine.",
    price: 1000,
    size: "50 ml / 1.7 fl oz",
    tone: "#3F7048",
    skin: ["dry", "normal", "sensitive"],
    hover: 2,
    pos: { 2: "58% 50%" },
    details: `A gentle, refreshing gel cleanser formulated with natural botanicals to cleanse away impurities while keeping your skin hydrated, soft and balanced. With Rose Water, Aloe Vera &amp; Hyaluronic Acid.<br><br><b>Deeply hydrates:</b> helps maintain skin's moisture balance.<br><b>Gently cleanses:</b> removes impurities without dryness.<br><b>Soothes &amp; refreshes:</b> leaves skin feeling soft, smooth and revitalized.<br><br>Net content: 50 ml / 1.7 fl oz.`,
    usage: `Apply a small amount to damp skin, massage gently in circular motions, and rinse thoroughly with water.<br><br><b>Caution:</b> For external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Keep out of reach of children.`,
    ingredients: `Aqua (Water), Rosa Damascena Flower Water, Aloe Barbadensis Leaf Juice, Sodium Hyaluronate, Glycerin, Coco-Glucoside, Sodium Chloride, Citric Acid, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.`
  },
  {
    id: "rose-fresh",
    name: "Rose Fresh",
    category: "Hydrating Facewash",
    description: "A rose-inspired gel cleanser for a soft, refreshing daily skincare routine.",
    price: 1000,
    size: "50 ml / 1.7 fl oz",
    tone: "#E9B8C2",
    skin: ["normal", "combination"],
    hover: 1,
    pos: { 1: "50% 55%", 2: "50% 52%" },
    details: `Hydrating &amp; Refreshing Gel Cleanser with Rose Water, Aloe Vera &amp; Hyaluronic Acid.<br>Net content: 50 ml / 1.7 fl oz.`,
    usage: `Apply a small amount to damp skin, massage gently in circular motions, and rinse thoroughly with water. Use morning and evening as part of your daily routine.<br><br><b>Caution:</b> For external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Keep out of reach of children.`,
    ingredients: `Key ingredients (as printed on the pack): Rose Water, Aloe Vera &amp; Hyaluronic Acid. The full ingredient list will be added soon.`
  }
  // To add a product: copy one block above, give it a new unique "id", then
  // upload  <id>.jpg  (and <id>-2.jpg, <id>-3.jpg … for more photos).
];
