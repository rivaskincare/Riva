(() => {
  const launcher = document.getElementById("riva-chat-launcher");
  const panel = document.getElementById("riva-chat-panel");
  const closeBtn = document.getElementById("riva-chat-close");
  const messages = document.getElementById("riva-chat-messages");
  const form = document.getElementById("riva-chat-form");
  const input = document.getElementById("riva-chat-input");

  if (!launcher || !panel || !messages || !form || !input) return;

  const safeProducts = () => {
    try {
      return typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : [];
    } catch (_) {
      return [];
    }
  };

  function addMessage(text, who) {
    const bubble = document.createElement("div");
    bubble.className = "riva-chat-msg " + (who === "user" ? "user" : "bot");
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  const sendBtn = document.getElementById("riva-chat-send");

  function showTyping() {
    const bubble = document.createElement("div");
    bubble.className = "riva-chat-msg bot typing";
    bubble.setAttribute("aria-label", "RIVA AI is typing");
    bubble.innerHTML = "<i></i><i></i><i></i>";
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function openChat() {
    panel.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    if (!messages.dataset.started) {
      addMessage("Hi! I'm RIVA AI 🌿\n\nI can help with RIVA facewashes, how to use a cleanser, skin-type basics, ingredients and common skincare questions. I'm a simple built-in helper (not a live AI model), so I only share verified information from this website.", "bot");
      messages.dataset.started = "true";
    }
    input.focus();
  }

  function closeChat() {
    panel.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  function productSummary(products) {
    if (!products.length) return "I can't access the product list right now. Please visit the Shop section of the Riva website.";
    return "Here are the Riva products currently listed on this website:\n\n" +
      products.map(p => {
        const price = p.price == null ? "Price not listed" : "Rs. " + Number(p.price).toLocaleString("en-PK");
        return "• " + (p.name || "Riva facewash") + " — " + (p.category || "Facewash") + "\n  " +
          (p.description || "Product details are being updated.") + "\n  Listed price: " + price;
      }).join("\n\n") +
      "\n\nYou can open the Shop section to view product pages and details.";
  }

  const clean = t => String(t || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
  const money = p => p.price == null ? "price to be confirmed" : "Rs. " + Number(p.price).toLocaleString("en-PK");
  const TBC = "that detail still needs to be confirmed by the RIVA team";
  const NOTE = "\n\nThis is general skincare information, not medical advice.";
  const named = (q, list) => list.filter(p => q.includes(String(p.name || "").toLowerCase()));
  const STEPS = "1. Wash your hands.\n2. Wet your face with lukewarm water.\n3. Apply the recommended amount of cleanser.\n4. Gently massage over the face without scrubbing aggressively.\n5. Rinse thoroughly.\n6. Pat the skin dry with a clean towel.\n7. Apply a suitable moisturizer.\n8. In the daytime, use a broad-spectrum sunscreen with SPF 30 or higher.\n\nAvoid getting cleanser in your eyes, and always follow the directions on the product label.";
  const TERMS = [
    { re: /glycerin/, name: "Glycerin", txt: "Glycerin is a humectant that helps attract and retain moisture in the outer skin layer." },
    { re: /hyaluron/, name: "Hyaluronic acid", txt: "Hyaluronic acid is a humectant used in skincare to help maintain hydration." },
    { re: /niacinamide|vitamin b3/, name: "Niacinamide", txt: "Niacinamide is a form of vitamin B3 used in some skincare formulations. Depending on the formulation and concentration, it may help support the skin barrier and improve the appearance of uneven skin tone." },
    { re: /salicylic/, name: "Salicylic acid", txt: "Salicylic acid is an exfoliating ingredient used in some cleansers and acne-care products. It may help unclog pores, but suitability depends on concentration, formulation, and skin sensitivity." },
    { re: /aloe/, name: "Aloe vera", txt: "Aloe-derived ingredients are used in skincare formulations, often for their moisturizing or soothing properties. Benefits depend on the ingredient and the overall formula." },
    { re: /vitamin c|ascorb/, name: "Vitamin C", txt: "Vitamin C and its derivatives are used in some skincare products to support antioxidant protection and improve the appearance of uneven skin tone." }
  ];

  function rivaCheck(term, products) {
    return products.map(p => {
      const t = clean(p.ingredients).toLowerCase();
      const partial = !t || /full ingredient list will be added/.test(t);
      if (term.re.test(t)) return "• " + p.name + ": mentioned in the ingredient information I have" + (partial ? " (as printed on the pack; the full list is still to come)." : ".");
      return "• " + p.name + (partial ? ": the full ingredient list isn't available to me yet, so I can't confirm this." : ": not listed in its ingredient list.");
    }).join("\n");
  }

  function productCard(p) {
    return [
      p.name + " — " + (p.category || "Facewash"),
      p.description || "",
      "Size: " + (p.size || TBC),
      "Price: " + money(p),
      "Suggested for: " + (Array.isArray(p.skin) ? p.skin.join(", ") + " skin (a suggestion based on this website's product information, not a verified claim)." : "not yet verified — " + TBC + "."),
      "Fragrance: not specified — " + TBC + ".",
      "Main ingredients: " + (clean(p.ingredients) || TBC),
      "Directions: " + (clean(p.usage) || "follow the directions on the product label."),
      "Availability: please check the product page or cart — I can't see live stock."
    ].filter(Boolean).join("\n");
  }

  function suggest(type, why) {
    const list = safeProducts().filter(p => Array.isArray(p.skin) && p.skin.includes(type));
    if (!list.length) return "";
    return "\n\nA suggestion to start with: " + list.map(p => p.name + " (" + money(p) + ")").join(" or ") + (why ? " — " + why : "") + ". This is a suggestion based on the product information on this website, not a verified claim about suitability — please check the ingredient list and patch-test first.";
  }

  function guide() {
    const rows = safeProducts().filter(p => Array.isArray(p.skin)).map(p => "• " + p.name + " — " + p.skin.join(", "));
    return rows.length ? "\n\nQuick guide (suggestions only):\n" + rows.join("\n") : "";
  }

  function answer(raw) {
    const q = raw.toLowerCase().trim();
    const qn = q.replace(/aloe fresh|aqua fresh|rose fresh/g, " ");
    const products = safeProducts();
    const has = r => r.test(q);

    if (has(/^(hi|hello|hey|salam|assalam|good morning|good evening)\b/)) {
      return "Hello! 🌿 Welcome to RIVA. I can help with our facewashes, how to use a cleanser, skin-type basics, ingredients and common skincare questions. What would you like to know?";
    }
    if (has(/\b(thank|thanks|thx)\b/)) {
      return "You're welcome! 🌿 If you'd like, I can show you the RIVA facewash range or help you find product information.";
    }
    if (has(/\b(burn|burning|itch|itching|itchy|redness|rash|swelling|swollen|allerg\w*|irritat\w*|reaction|hives|stinging)\b/)) {
      return "I'm sorry to hear that. Stop using the product and rinse the area gently with clean water. If the reaction is severe, persistent, or getting worse, please seek medical advice. I can't diagnose skin conditions." + NOTE;
    }
    if (has(/\b(eye|eyes)\b/)) {
      return "Avoid getting facewash into your eyes unless the product is specifically designed for that area. If it does get into your eyes, rinse thoroughly with clean water.";
    }
    if (has(/\b(fair|fairness|whiten\w*|lighter skin|skin tone)\b/)) {
      return "Facewash helps cleanse your skin, but it does not necessarily change your natural skin tone, and RIVA doesn't promise skin whitening. RIVA encourages healthy-looking skin and a skincare routine suited to your individual needs.";
    }
    if (has(/\b(dark spots?|pigmentation|scars?|wrinkles?|marks)\b/)) {
      return "A regular cleanser may help keep your skin clean, but it usually can't remove dark spots by itself, and I can't promise results with any RIVA product. Sun protection and suitable skincare ingredients may help improve the appearance of uneven pigmentation over time. Wrinkles and scars also can't be guaranteed to change with a cleanser. For persistent concerns, a qualified healthcare professional can advise you." + NOTE;
    }
    if (has(/\b(acne|pimples?|breakouts?|zits?)\b/)) {
      return "A suitable cleanser can help remove excess oil and dirt, but a regular facewash may not treat acne on its own, and I can't promise that any RIVA product cures acne. The right recommendation depends on a product's ingredients. Persistent or severe acne may need advice from a qualified healthcare professional." + NOTE;
    }
    if (has(/(how long|how soon|how quickly|how fast).*(result|work|see|notice|improv)|results? (in|within)/)) {
      return "That depends on the product, your skin and the concern being addressed. I can't promise results within a specific number of days.";
    }
    if (has(/\bsensitive\b/)) {
      return "That depends on the product's ingredients and your skin's sensitivities. Check the ingredient list before use, patch-test the product first, and stop using it if irritation develops. No cleanser is guaranteed to suit everyone." + suggest("sensitive", "its full ingredient list is available on this website, so you can review it first") + NOTE;
    }
    if (has(/\b(tested|testing|safe|safety|certified|certification|dermatolog\w*|clinical\w*|halal|organic)\b/)) {
      return "Please check the specific product packaging or official RIVA product information for testing details. I don't have verified testing or certification information, and I don't want to give you inaccurate information. You can also ask the RIVA team through the Contact section.";
    }
    if (has(/(don'?t know|do not know|not sure|unsure|what is my|figure out|find out|identify).*skin|skin type.*(don'?t know|not sure)/)) {
      return "Of course! Tell me what your skin usually feels like after washing your face. Does it become oily, feel tight or dry, get oily mainly around your nose and forehead, or sometimes feel irritated? Your answers can help you understand your skin type — though I can't diagnose it." + NOTE;
    }
    if (has(/\b(tight|tightness|stripped|squeaky)\b|feels? (dry|rough) after/)) {
      return "A tight or uncomfortable feeling may mean your cleanser is too drying for your skin. Consider using a gentler cleanser, washing with lukewarm water, and applying moisturizer. Stop using a product if it causes persistent irritation." + NOTE;
    }
    if (has(/\b(make ?up|waterproof|mascara|lipstick)\b/)) {
      return "Some cleansers can remove light makeup, but not all facewashes are designed for that purpose. Please check the product instructions — I can't confirm that any RIVA facewash is made to remove makeup. You may need a separate makeup remover for long-lasting or waterproof makeup.";
    }
    if (has(/\b(black ?heads?|whiteheads?|pores?)\b/)) {
      return "A cleanser can help remove surface oil and impurities, but an ordinary facewash may not eliminate blackheads. Products with suitable active ingredients may help, depending on their formulation and your skin's tolerance. I can't confirm that any RIVA facewash targets blackheads." + NOTE;
    }
    if (has(/why (should|do|would) (i|we).*(choose|buy|pick|use|trust)|why riva|why choose/)) {
      return "RIVA aims to make skincare easier to understand by helping customers learn about our products and choose options based on their needs. I'd be happy to help you explore the available RIVA facewashes.";
    }
    if (has(/\boily\b/)) {
      return "If you have oily skin, look for a cleanser that helps remove excess oil, dirt and impurities without making your skin feel excessively dry, and avoid washing repeatedly to remove every trace of oil." + suggest("oily") + NOTE;
    }
    if (has(/\bdry\b/)) {
      return "If you have dry skin, look for a gentle cleanser that cleanses without stripping away too much moisture. Avoid harsh cleansing products and follow up with a moisturizer to keep your skin hydrated." + suggest("dry", "its listed ingredients include glycerin, sodium hyaluronate and aloe leaf juice") + NOTE;
    }
    if (has(/\bcombination\b/)) {
      return "Combination skin often has an oily T-zone (forehead, nose and chin) and drier areas elsewhere. Choose a gentle facewash that cleanses effectively without leaving the drier areas feeling tight." + suggest("combination") + NOTE;
    }
    if (has(/\bnormal skin\b/)) {
      return "Normal skin generally feels comfortable, without persistent oiliness or dryness. A gentle cleanser that suits your skin is a sensible starting point." + suggest("normal") + NOTE;
    }
    if (has(/all skin types|every skin/)) {
      return "Different products may suit different skin types. Tell me which RIVA facewash you're considering so I can check its intended use and ingredient information. Right now the intended skin types for RIVA's facewashes haven't been confirmed, and no cleanser is guaranteed to suit everyone.";
    }
    if (has(/(two|2|multiple|more than one|different|both) (face ?wash(es)?|cleansers?)/)) {
      return "Some people use different cleansers for different situations, but using more than one isn't always necessary. Avoid introducing several new products at once, especially if your skin is sensitive.";
    }
    if (has(/moisturi[sz]er/)) {
      return "Yes! Moisturizer helps maintain your skin's moisture barrier. Choose one suited to your skin type — a lightweight, non-comedogenic option if your skin is oily.";
    }
    if (has(/\b(sunscreen|spf)\b/)) {
      return "During the daytime, a broad-spectrum sunscreen with SPF 30 or higher is a good final step after cleansing and moisturizing.";
    }
    if (has(/(how often|every day|everyday|twice|once a day|before (sleep|bed)|at night|morning|evening|daily)/)) {
      return "Most people can start by washing their face twice daily, in the morning and evening, and most facial cleansers are designed for regular use. The ideal frequency depends on your skin and the product's formulation, so follow the instructions on your RIVA product label. If your skin becomes dry or irritated, reduce washing — over-cleansing isn't better. Evening cleansing helps remove dirt, sweat, excess oil and sunscreen.";
    }
    if (has(/(what is|what's) (a |an |the )?(face ?wash|cleanser)\b|how does (a |an )?(face ?wash|cleanser) work|benefits? of (cleansing|face ?wash)/)) {
      return "A facewash is a cleansing product designed to remove dirt, excess oil, sweat and other impurities. Mixed with water and rinsed away, it helps loosen and remove them. Cleansing keeps skin clean and prepares it for moisturizer — but it can't guarantee the removal of acne, dark spots or wrinkles.";
    }
    if (has(/\b(how)\b.*\b(use|apply|wash)\b|\busage\b|\bdirections?\b|\bsteps\b/)) {
      const found = named(q, products);
      const extra = found.map(p => p.name + ": " + (clean(p.usage) || "follow the directions on the product label.")).join("\n\n");
      return (extra ? extra + "\n\nGeneral steps:\n" : "General steps:\n") + STEPS;
    }
    const term = TERMS.find(t => t.re.test(qn));
    if (term) {
      return term.txt + "\n\nIn RIVA products (based on the ingredient information I have):\n" + rivaCheck(term, products);
    }
    if (has(/\b(ingredients?|contains?|made of|formula)\b/)) {
      const found = named(q, products);
      const list = found.length ? found : products;
      return list.map(p => p.name + ": " + (clean(p.ingredients) || "The full ingredient information has not been provided yet.")).join("\n\n");
    }
    if (has(/\b(discounts?|sale|promo\w*|coupons?|deals?)\b|(any|special) offers?/)) {
      return "Yes! Use coupon code INSTA at the cart or checkout to get 15% off your order. I can't confirm any other offers — please check the product pages or contact the RIVA team.";
    }
    if (has(/\b(price|cost|how much|rupees|rs\.?|pkr)\b/)) {
      const list = named(q, products).length ? named(q, products) : products;
      if (!list.length) return "I don't have verified price information right now. Please check the Shop section.";
      return "Prices currently listed on the website:\n\n" + list.map(p => p.name + ": " + money(p)).join("\n") + "\n\nPlease check the product page for the latest listing.";
    }
    if (has(/\b(size|ml|quantity|volume|fl oz)\b/)) {
      const list = named(q, products).length ? named(q, products) : products;
      return list.map(p => p.name + ": " + (p.size || TBC)).join("\n");
    }
    if (has(/\b(fragrance|fragrance-free|scent|scented|smell|perfume)\b/)) {
      return "I don't have verified fragrance information for RIVA products yet — " + TBC + ".";
    }
    if (has(/\b(stock|in stock|sold out|availability|available now)\b/)) {
      return "I can't see live stock. Please check the product page or cart, or contact the RIVA team to confirm availability.";
    }
    if (has(/\b(manufacturer|manufactured|made by|made in)\b|who (makes|made|manufactures)/)) {
      return "I don't have verified manufacturer information yet — " + TBC + ".";
    }
    if (has(/\b(cash on delivery|cod)\b/)) {
      return "Cash on delivery availability depends on RIVA's payment options and your delivery location. This website is still being set up, so the payment methods aren't available yet — please check back later or contact RIVA customer support.";
    }
    if (has(/\b(deliver\w*|shipping|ship|arrive|dispatch)\b/)) {
      return "A flat courier charge of Rs. 250 applies to each RIVA order. Delivery times depend on your location and the shipping service, and this website is still being set up, so exact delivery times aren't available yet — please contact RIVA customer support.";
    }
    if (has(/\b(returns?|refund|exchange)\b/)) {
      return "This website is still being set up, so there is no return or refund policy available yet. Please use the Contact section to ask.";
    }
    if (has(/\b(order|buy|purchase|payment|pay|track\w*)\b/)) {
      return "You can browse the available products on the RIVA website, select your preferred facewash and add it to your cart. This website is still being set up, so checkout, payment and returns aren't live yet (a Rs. 250 courier charge applies to each order). If you need help finding a product, I can guide you.";
    }
    if (has(/\b(what is riva|about riva|your brand|who are you|what can you do)\b|^help$/)) {
      return "RIVA is a skincare brand focused on facial cleansing and skincare. Our goal is to help customers discover products that suit their individual skincare needs. I'm RIVA AI — ask me about our products, their uses, and how to choose a suitable option. I'm a simple built-in helper, not a live AI model, so I only share verified information and may not understand every question.";
    }
    if (has(/\b(which|best|recommend\w*|suggest\w*|suit\w*|choose|right for me)\b/)) {
      return "The best option depends on your skin type, concerns and each product's formulation. Tell me whether your skin is oily, dry, combination, normal or sensitive and I'll suggest a starting point. I can't diagnose skin types or guarantee that a product will suit you." + guide() + NOTE;
    }
    const one = named(q, products);
    if (one.length === 1 && has(/\b(tell|about|detail|details|info|information|describe|more|explain|what is)\b/)) {
      return productCard(one[0]);
    }
    if (has(/\b(show|list|which|what|available|range|products|facewash|face wash|cleanser|shop)\b/)) {
      return productSummary(products);
    }
    if (has(/\b(contact|email|support|talk to|human|customer service)\b/)) {
      return "You can contact the RIVA team using the form in the Contact section of this website.";
    }
    return "I can help with RIVA products (names, prices, sizes and ingredient information on file), how to use a facewash, skin-type basics, common skincare questions and ordering information. I'm a simple built-in helper, not a live AI model, so I may not understand every question — try rephrasing, or use the Contact section.";
  }

  launcher.addEventListener("click", () => panel.classList.contains("open") ? closeChat() : openChat());
  closeBtn.addEventListener("click", closeChat);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    sendBtn.classList.remove("pop"); void sendBtn.offsetWidth; sendBtn.classList.add("pop");
    const reply = answer(text);
    const typing = showTyping();
    const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = calm ? 200 : Math.min(1600, 650 + reply.length * 3);
    window.setTimeout(() => { typing.remove(); addMessage(reply, "bot"); }, wait);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && panel.classList.contains("open")) closeChat();
  });
})();
