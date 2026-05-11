const sequelize = require("./config/database");
const ProductCreation = require("./api/model/productCreation");
const UserSignUp = require("./api/model/userModel");
const bcrypt = require("bcryptjs");

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    // ─── ADMIN USER ───────────────────────────────────────
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    await UserSignUp.bulkCreate([
      {
        fullName: "Akshaya Sri",
        phoneNumber: "9876543210",
        email: "akshaya@accsintouch.com",
        password: hashedPassword,
        gender: "Female",
        cityName: "Hyderabad",
        districtName: "Rangareddy",
        stateName: "Telangana",
        pinCode: "500081",
        role: "admin",
        image_url: null,
      },
    ], { ignoreDuplicates: true });
    console.log("✅ Admin user seeded");

    // ─── CLOUDINARY IMAGE URLS ────────────────────────────
    const img = {
      bow1:         "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361868/bow1_bvjgnt.png",
      bowred:       "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361870/bowred_zvjvxw.png",
      goldbow:      "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361871/goldbow_eagatx.png",
      bow4:         "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361868/bow4_tbbvkm.png",
      bow5:         "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361868/bow5_gxejne.png",
      bow6:         "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361869/bow6_f8tf3x.png",
      bow8:         "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361869/bow8_dn9dhp.png",
      bow9:         "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361869/bow9_zgicwz.jpg",
      violetclip:   "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361873/violetclip_gtalkz.png",
      whiteclip:    "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361874/whiteclip_oa7w10.png",
      trending3:    "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361873/trending3_galkvf.png",
      claw4:        "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361864/claw4_jdz2wy.png",
      claw5:        "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361867/claw5_mkl0eb.jpg",
      claw7:        "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361865/claw7_idbixj.png",
      claw8:        "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361865/claw8_dscvt2.png",
      claw9:        "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361865/claw9_tfr2tc.png",
      earring1:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361866/earring1_wnmiux.png",
      earring2:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361866/earring2_ipy4ib.png",
      earring3:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361866/earring3_ut5u4r.png",
      earring4:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361867/earring4_o6zld9.png",
      earring5:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361867/earring5_ascz2y.png",
      earring6:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361868/earring6_a6wbmw.png",
      earring7:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361868/earring7_saw45w.png",
      earring8:     "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361868/earring8_l4gync.png",
      fluffyredband:"https://res.cloudinary.com/dy67uxay7/image/upload/v1777361869/fluffyredband_iyck9v.png",
      bands:        "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361866/bands_ktyipg.png",
      bands2:       "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361867/bands2_co4oqy.png",
      scrunchie4:   "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361872/scrunchie4_p4toa6.png",
      scrunchie5:   "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361872/scrunchie5_kvgfws.png",
      scrunchie6:   "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361873/scrunchie6_zcoij0.png",
      scrunchie7:   "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361876/scrunchie7_rkxnxt.png",
      scrunchie8:   "https://res.cloudinary.com/dy67uxay7/image/upload/v1777361873/scrunchie8_ogdxlr.png",
    };

    // ─── ALL 40 PRODUCTS ──────────────────────────────────
    await ProductCreation.bulkCreate([

      // ── HAIR BOWS (8) ──
      { productName: "Organza Bow", productDescription: "Beautiful organza bow for elegant looks", productCategory: "hairBows", productTags: "organza,bow,elegant", productStatus: "inStock", basicPricing: "299", discountType: "10%", productSKU: "BOW-001", productBarcode: "8901234560001", productQuantity: "50", productWeight: "20g", productHeight: "8cm", productLength: "6cm", productWidth: "2cm", image_url: [{ url: img.goldbow }], isPhysical: true },
      { productName: "Velvet Bow", productDescription: "Soft velvet bow in rich red color", productCategory: "hairBows", productTags: "velvet,bow,red", productStatus: "inStock", basicPricing: "249", discountType: "5%", productSKU: "BOW-002", productBarcode: "8901234560002", productQuantity: "45", productWeight: "18g", productHeight: "7cm", productLength: "5cm", productWidth: "2cm", image_url: [{ url: img.bowred }], isPhysical: true },
      { productName: "Classic Bow", productDescription: "Timeless classic bow for everyday use", productCategory: "hairBows", productTags: "classic,bow,everyday", productStatus: "inStock", basicPricing: "199", discountType: "0%", productSKU: "BOW-003", productBarcode: "8901234560003", productQuantity: "60", productWeight: "15g", productHeight: "6cm", productLength: "5cm", productWidth: "2cm", image_url: [{ url: img.bow1 }], isPhysical: true },
      { productName: "Satin Bow", productDescription: "Luxurious satin bow for a chic look", productCategory: "hairBows", productTags: "satin,bow,luxury", productStatus: "inStock", basicPricing: "349", discountType: "15%", productSKU: "BOW-004", productBarcode: "8901234560004", productQuantity: "40", productWeight: "20g", productHeight: "8cm", productLength: "6cm", productWidth: "2cm", image_url: [{ url: img.bow4 }], isPhysical: true },
      { productName: "Ribbon Bow", productDescription: "Delicate ribbon bow for special occasions", productCategory: "hairBows", productTags: "ribbon,bow,special", productStatus: "inStock", basicPricing: "279", discountType: "10%", productSKU: "BOW-005", productBarcode: "8901234560005", productQuantity: "35", productWeight: "16g", productHeight: "7cm", productLength: "5cm", productWidth: "2cm", image_url: [{ url: img.bow5 }], isPhysical: true },
      { productName: "Silk Bow", productDescription: "Premium silk bow with smooth finish", productCategory: "hairBows", productTags: "silk,bow,premium", productStatus: "inStock", basicPricing: "399", discountType: "20%", productSKU: "BOW-006", productBarcode: "8901234560006", productQuantity: "30", productWeight: "18g", productHeight: "8cm", productLength: "6cm", productWidth: "2cm", image_url: [{ url: img.bow6 }], isPhysical: true },
      { productName: "Designer Bow", productDescription: "Trendy designer bow for fashion lovers", productCategory: "hairBows", productTags: "designer,bow,trendy", productStatus: "lowStock", basicPricing: "449", discountType: "25%", productSKU: "BOW-007", productBarcode: "8901234560007", productQuantity: "10", productWeight: "22g", productHeight: "9cm", productLength: "7cm", productWidth: "2cm", image_url: [{ url: img.bow8 }], isPhysical: true },
      { productName: "Premium Bow", productDescription: "Handcrafted premium bow for gifting", productCategory: "hairBows", productTags: "premium,bow,gift", productStatus: "inStock", basicPricing: "499", discountType: "30%", productSKU: "BOW-008", productBarcode: "8901234560008", productQuantity: "25", productWeight: "25g", productHeight: "10cm", productLength: "8cm", productWidth: "3cm", image_url: [{ url: img.bow9 }], isPhysical: true },

      // ── CLAWS (8) ──
      { productName: "Claw Clip", productDescription: "Stylish claw clip for all hair types", productCategory: "claws", productTags: "claw,clip,stylish", productStatus: "inStock", basicPricing: "149", discountType: "0%", productSKU: "CLW-001", productBarcode: "8901234561001", productQuantity: "80", productWeight: "15g", productHeight: "6cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.violetclip }], isPhysical: true },
      { productName: "White Clip", productDescription: "Clean white clip for minimal looks", productCategory: "claws", productTags: "white,clip,minimal", productStatus: "inStock", basicPricing: "149", discountType: "0%", productSKU: "CLW-002", productBarcode: "8901234561002", productQuantity: "70", productWeight: "14g", productHeight: "6cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.whiteclip }], isPhysical: true },
      { productName: "Designer Clip", productDescription: "Eye-catching designer clip", productCategory: "claws", productTags: "designer,clip,trendy", productStatus: "inStock", basicPricing: "179", discountType: "5%", productSKU: "CLW-003", productBarcode: "8901234561003", productQuantity: "55", productWeight: "16g", productHeight: "6cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.trending3 }], isPhysical: true },
      { productName: "Violet Clip", productDescription: "Bold violet clip for statement looks", productCategory: "claws", productTags: "violet,clip,bold", productStatus: "inStock", basicPricing: "159", discountType: "0%", productSKU: "CLW-004", productBarcode: "8901234561004", productQuantity: "65", productWeight: "15g", productHeight: "6cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.claw4 }], isPhysical: true },
      { productName: "Elegant Clip", productDescription: "Elegant clip for formal occasions", productCategory: "claws", productTags: "elegant,clip,formal", productStatus: "inStock", basicPricing: "199", discountType: "10%", productSKU: "CLW-005", productBarcode: "8901234561005", productQuantity: "50", productWeight: "17g", productHeight: "7cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.claw5 }], isPhysical: true },
      { productName: "Trendy Clip", productDescription: "Latest trendy clip for fashionistas", productCategory: "claws", productTags: "trendy,clip,fashion", productStatus: "inStock", basicPricing: "169", discountType: "5%", productSKU: "CLW-006", productBarcode: "8901234561006", productQuantity: "60", productWeight: "15g", productHeight: "6cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.claw7 }], isPhysical: true },
      { productName: "Classic Clip", productDescription: "Classic clip that never goes out of style", productCategory: "claws", productTags: "classic,clip,timeless", productStatus: "inStock", basicPricing: "139", discountType: "0%", productSKU: "CLW-007", productBarcode: "8901234561007", productQuantity: "90", productWeight: "13g", productHeight: "5cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.claw9 }], isPhysical: true },
      { productName: "Modern Clip", productDescription: "Modern clip with premium finish", productCategory: "claws", productTags: "modern,clip,premium", productStatus: "inStock", basicPricing: "189", discountType: "10%", productSKU: "CLW-008", productBarcode: "8901234561008", productQuantity: "45", productWeight: "16g", productHeight: "6cm", productLength: "4cm", productWidth: "3cm", image_url: [{ url: img.claw8 }], isPhysical: true },

      // ── EARRINGS (8) ──
      { productName: "Gold Earring", productDescription: "Lightweight gold-toned earrings for daily wear", productCategory: "Earrings", productTags: "gold,earring,daily", productStatus: "inStock", basicPricing: "399", discountType: "10%", productSKU: "EAR-001", productBarcode: "8901234562001", productQuantity: "60", productWeight: "8g", productHeight: "4cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring1 }], isPhysical: true },
      { productName: "Designer Earring", productDescription: "Handcrafted designer earrings", productCategory: "Earrings", productTags: "designer,earring,handcrafted", productStatus: "inStock", basicPricing: "499", discountType: "15%", productSKU: "EAR-002", productBarcode: "8901234562002", productQuantity: "45", productWeight: "10g", productHeight: "5cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring3 }], isPhysical: true },
      { productName: "Triangle Earring", productDescription: "Geometric triangle earrings for modern look", productCategory: "Earrings", productTags: "triangle,earring,geometric", productStatus: "inStock", basicPricing: "349", discountType: "0%", productSKU: "EAR-003", productBarcode: "8901234562003", productQuantity: "55", productWeight: "9g", productHeight: "4cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring4 }], isPhysical: true },
      { productName: "Silver Earring", productDescription: "Classic silver earrings for all occasions", productCategory: "Earrings", productTags: "silver,earring,classic", productStatus: "inStock", basicPricing: "449", discountType: "20%", productSKU: "EAR-004", productBarcode: "8901234562004", productQuantity: "40", productWeight: "9g", productHeight: "4cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring5 }], isPhysical: true },
      { productName: "Pearl Earring", productDescription: "Elegant pearl drop earrings", productCategory: "Earrings", productTags: "pearl,earring,elegant", productStatus: "inStock", basicPricing: "549", discountType: "10%", productSKU: "EAR-005", productBarcode: "8901234562005", productQuantity: "35", productWeight: "10g", productHeight: "5cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring2 }], isPhysical: true },
      { productName: "Diamond Earring", productDescription: "Sparkling diamond-look earrings", productCategory: "Earrings", productTags: "diamond,earring,sparkling", productStatus: "inStock", basicPricing: "599", discountType: "25%", productSKU: "EAR-006", productBarcode: "8901234562006", productQuantity: "30", productWeight: "11g", productHeight: "5cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring6 }], isPhysical: true },
      { productName: "Crystal Earring", productDescription: "Shimmering crystal earrings for parties", productCategory: "Earrings", productTags: "crystal,earring,party", productStatus: "inStock", basicPricing: "479", discountType: "15%", productSKU: "EAR-007", productBarcode: "8901234562007", productQuantity: "42", productWeight: "10g", productHeight: "5cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring7 }], isPhysical: true },
      { productName: "Elegant Earring", productDescription: "Sophisticated earrings for formal events", productCategory: "Earrings", productTags: "elegant,earring,formal", productStatus: "inStock", basicPricing: "529", discountType: "20%", productSKU: "EAR-008", productBarcode: "8901234562008", productQuantity: "38", productWeight: "10g", productHeight: "5cm", productLength: "1cm", productWidth: "1cm", image_url: [{ url: img.earring8 }], isPhysical: true },

      // ── SCRUNCHIES (8) ──
      { productName: "Red Scrunchie", productDescription: "Fluffy red scrunchie for bold looks", productCategory: "scrunchies", productTags: "red,scrunchie,fluffy", productStatus: "inStock", basicPricing: "99", discountType: "0%", productSKU: "SCR-001", productBarcode: "8901234563001", productQuantity: "100", productWeight: "20g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.fluffyredband }], isPhysical: true },
      { productName: "Fluffy Band", productDescription: "Super soft fluffy hair band", productCategory: "scrunchies", productTags: "fluffy,band,soft", productStatus: "inStock", basicPricing: "119", discountType: "5%", productSKU: "SCR-002", productBarcode: "8901234563002", productQuantity: "90", productWeight: "22g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.bands }], isPhysical: true },
      { productName: "Designer Band", productDescription: "Patterned designer scrunchie band", productCategory: "scrunchies", productTags: "designer,band,pattern", productStatus: "inStock", basicPricing: "149", discountType: "10%", productSKU: "SCR-003", productBarcode: "8901234563003", productQuantity: "75", productWeight: "25g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.bands2 }], isPhysical: true },
      { productName: "Pink Scrunchie", productDescription: "Cute pink scrunchie for casual days", productCategory: "scrunchies", productTags: "pink,scrunchie,cute", productStatus: "inStock", basicPricing: "129", discountType: "0%", productSKU: "SCR-004", productBarcode: "8901234563004", productQuantity: "85", productWeight: "20g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.scrunchie4 }], isPhysical: true },
      { productName: "Velvet Band", productDescription: "Soft velvet scrunchie in pastel colors", productCategory: "scrunchies", productTags: "velvet,band,pastel", productStatus: "inStock", basicPricing: "159", discountType: "5%", productSKU: "SCR-005", productBarcode: "8901234563005", productQuantity: "70", productWeight: "23g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.scrunchie5 }], isPhysical: true },
      { productName: "Satin Band", productDescription: "Shiny satin scrunchie for special occasions", productCategory: "scrunchies", productTags: "satin,band,shiny", productStatus: "inStock", basicPricing: "179", discountType: "10%", productSKU: "SCR-006", productBarcode: "8901234563006", productQuantity: "60", productWeight: "24g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.scrunchie6 }], isPhysical: true },
      { productName: "Classic Scrunchie", productDescription: "All-time favourite classic scrunchie", productCategory: "scrunchies", productTags: "classic,scrunchie,favourite", productStatus: "inStock", basicPricing: "109", discountType: "0%", productSKU: "SCR-007", productBarcode: "8901234563007", productQuantity: "110", productWeight: "20g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.scrunchie7 }], isPhysical: true },
      { productName: "Premium Band", productDescription: "Premium quality scrunchie gift set", productCategory: "scrunchies", productTags: "premium,band,gift", productStatus: "inStock", basicPricing: "199", discountType: "15%", productSKU: "SCR-008", productBarcode: "8901234563008", productQuantity: "50", productWeight: "28g", productHeight: "5cm", productLength: "5cm", productWidth: "5cm", image_url: [{ url: img.scrunchie8 }], isPhysical: true },

    ], { ignoreDuplicates: true });

    console.log("✅ All 40 products seeded with Cloudinary images!");
    console.log("🎉 Done! Login: akshaya@accsintouch.com / Admin@123");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();