const Item = require("./models/item");
const Category = require("./models/category");
const Brand = require("./models/brand");

const items = [];
const categories = [];
const brands = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createBrands();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function brandCreate(index, name) {
  const brand = new Brand({ name: name });
  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${name}`);
}

async function categoryCreate(index, name, description) {
  const categoryDetails = {
    name: name,
    description: description,
  };
  const category = new Category(categoryDetails);
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  price,
  description,
  category,
  brand,
  number_in_stock,
  image_url
) {
  const itemDetails = {
    name: name,
    price: price,
    description: description,
    category: category,
    brand: brand,
    number_in_stock: number_in_stock,
    image_url: image_url,
  };

  const item = new Item(itemDetails);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createBrands() {
  console.log("Adding brands");
  await Promise.all([
    brandCreate(0, "Fjallraven"),
    brandCreate(1, "John Hardy"),
    brandCreate(2, "WD"),
    brandCreate(3, "Sandisk"),
    brandCreate(4, "Acer"),
    brandCreate(5, "Samsung"),
    brandCreate(6, "BIYLACLESEN"),
    brandCreate(7, "Lock and Love"),
    brandCreate(8, "MBJ"),
    brandCreate(9, "Opna"),
    brandCreate(10, "DANVOUY"),
    brandCreate(11, "fashion"),
  ]);
}

async function createCategories() {
  console.log("Adding Categories.");
  await Promise.all([
    categoryCreate(
      0,
      "Electronics",
      "Monitors, Harddisks and other electronic devices."
    ),
    categoryCreate(1, "Jwelery", "Wearables like bracelet, necklace rings"),
    categoryCreate(2, "Men", "Men's clothes and other accessories"),
    categoryCreate(3, "Women", "Women's clothes and other accessories"),
  ]);
}

async function createItems() {
  console.log("Adding Items.");
  await Promise.all([
    itemCreate(
      0,
      "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      109.95,
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      categories[2],
      brands[0],
      120,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859700/shoppingInventory/Fjallraven_-_Foldsack_No._1_Backpack_Fits_15_Laptops_tvls83.jpg"
    ),
    itemCreate(
      1,
      "Mens Casual Premium Slim Fit T-Shirts",
      22.3,
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
      categories[2],
      brands[11],
      259,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859701/shoppingInventory/Mens_Casual_Premium_Slim_Fit_T-Shirts_wpssmy.jpg"
    ),
    itemCreate(
      2,
      "Mens Cotton Jacket",
      55.99,
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
      categories[2],
      brands[11],
      500,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859698/shoppingInventory/Mens_Cotton_Jacket_cyhntk.jpg"
    ),
    itemCreate(
      3,
      "Mens Casual Slim Fit",
      15.99,
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
      categories[2],
      brands[11],
      430,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859701/shoppingInventory/Mens_Casual_Slim_Fit_i1ce36.jpg"
    ),
    itemCreate(
      4,
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
      695,
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
      categories[1],
      brands[1],
      400,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859699/shoppingInventory/John_Hardy_Women_s_Legends_Naga_Gold_Silver_Dragon_Station_Chain_Bracelet_uvknn0.jpg"
    ),
    itemCreate(
      5,
      "Solid Gold Petite Micropave",
      168,
      "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
      categories[1],
      brands[1],
      70,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859702/shoppingInventory/Solid_Gold_Petite_Micropave_hrnhgg.jpg"
    ),
    itemCreate(
      6,
      "White Gold Plated Princess",
      9.99,
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
      categories[1],
      brands[1],
      400,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859703/shoppingInventory/White_Gold_Plated_Princess_ecrt8z.jpg"
    ),
    itemCreate(
      7,
      "Pierced Owl Rose Gold Plated Stainless Steel Double",
      10.99,
      "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
      categories[1],
      brands[1],
      100,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859700/shoppingInventory/Pierced_Owl_Rose_Gold_Plated_Stainless_Steel_Double_olv2od.jpg"
    ),
    itemCreate(
      8,
      "WD 2TB Elements Portable External Hard Drive - USB 3.0",
      64,
      "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
      categories[0],
      brands[2],
      203,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859702/shoppingInventory/WD_2TB_Elements_Portable_External_Hard_Drive_-_USB_3.0_p8wuft.jpg"
    ),
    itemCreate(
      9,
      "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
      109,
      "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
      categories[0],
      brands[3],
      470,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859702/shoppingInventory/WD_2TB_Elements_Portable_External_Hard_Drive_-_USB_3.0_p8wuft.jpg"
    ),
    itemCreate(
      10,
      "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
      109,
      "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
      categories[0],
      brands[3],
      319,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859702/shoppingInventory/Silicon_Power_256GB_SSD_3D_NAND_A55_SLC_Cache_Performance_Boost_SATA_III_2.5_yy5vjm.jpg"
    ),
    itemCreate(
      11,
      "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
      114,
      "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
      categories[0],
      brands[2],
      400,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859702/shoppingInventory/WD_4TB_Gaming_Drive_Works_with_Playstation_4_Portable_External_Hard_Drive_ipdlef.jpg"
    ),
    itemCreate(
      12,
      "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
      599,
      "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
      categories[0],
      brands[4],
      250,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859698/shoppingInventory/Acer_SB220Q_bi_21.5_inches_Full_HD_1920_x_1080_IPS_Ultra-Thin_zfwuon.jpg"
    ),
    itemCreate(
      13,
      "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
      999,
      "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
      categories[0],
      brands[5],
      140,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859701/shoppingInventory/Samsung_49-Inch_CHG90_144Hz_Curved_Gaming_Monitor_LC49HG90DMNXZA_Super_Ultrawide_Screen_QLED_lfbbqe.jpg"
    ),
    itemCreate(
      14,
      "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
      56.99,
      "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
      categories[3],
      brands[6],
      235,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859697/shoppingInventory/BIYLACLESEN_Women_s_3-in-1_Snowboard_Jacket_Winter_Coats_gdsjgo.jpg"
    ),
    itemCreate(
      15,
      "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
      26.95,
      "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
      categories[3],
      brands[7],
      340,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859698/shoppingInventory/Lock_and_Love_Women_s_Removable_Hooded_Faux_Leather_Moto_Biker_Jacket_sijqym.jpg"
    ),
    itemCreate(
      16,
      "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
      36.99,
      "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
      categories[3],
      brands[7],
      679,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859701/shoppingInventory/Rain_Jacket_Women_Windbreaker_Striped_Climbing_Raincoats_q154pt.jpg"
    ),
    itemCreate(
      17,
      "MBJ Women's Solid Short Sleeve Boat Neck V",
      9.85,
      "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
      categories[3],
      brands[8],
      130,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859701/shoppingInventory/MBJ_Women_s_Solid_Short_Sleeve_Boat_Neck_V_bynsdy.jpg"
    ),
    itemCreate(
      18,
      "Opna Women's Short Sleeve Moisture",
      7.95,
      "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
      categories[3],
      brands[9],
      146,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859699/shoppingInventory/Opna_Women_s_Short_Sleeve_Moisture_ml6ybl.jpg"
    ),
    itemCreate(
      19,
      "DANVOUY Womens T Shirt Casual Cotton Short",
      12.99,
      "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
      categories[3],
      brands[10],
      145,
      "https://res.cloudinary.com/rohithashok/image/upload/v1717859698/shoppingInventory/DANVOUY_Womens_T_Shirt_Casual_Cotton_Short_xuzwng.jpg"
    ),
  ]);
}
