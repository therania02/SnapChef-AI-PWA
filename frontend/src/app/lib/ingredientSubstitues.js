// Database bahan pengganti untuk masakan Indonesia

const normalizeIngredientName = (
  name
) => {
  return name
    .toLowerCase()
    .replace(
      "bubuk bawang putih",
      "bawang putih"
    )
    .replace(
      "bawang putih bubuk",
      "bawang putih"
    )
    .replace(
      "garam laut",
      "garam"
    )
    .replace(
      "sea salt",
      "garam"
    )
    .replace(
      "garam himalaya",
      "garam"
    )
    .replace(
      "lada hitam",
      "merica"
    )
    .replace(
      "merica hitam",
      "merica"
    )
    .replace(
      "olive oil",
      "minyak zaitun"
    )
    .trim();
};

export const INGREDIENT_SUBSTITUTES = {
  // Gula & Pemanis
  "gula pasir": [
    { name: "Gula aren", ratio: "1:1", note: "Rasa lebih karamel" },
    { name: "Gula merah", ratio: "1:1", note: "Rasa lebih kuat" },
    { name: "Madu", ratio: "1:1.5", note: "Kurangi cairan dalam resep" },
    { name: "Sirup maple", ratio: "1:1", note: "Rasa berbeda" },
  ],
  "gula merah": [
    { name: "Gula aren", ratio: "1:1", note: "Tekstur mirip" },
    { name: "Gula pasir", ratio: "1:1", note: "Tidak ada rasa karamel" },
    { name: "Gula kelapa", ratio: "1:1", note: "Lebih sehat" },
  ],

  // Susu & Dairy
  "susu": [
    { name: "Susu kental manis (diencerkan)", ratio: "1:2", note: "Tambah air 1:1" },
    { name: "Santan", ratio: "1:1", note: "Lebih creamy" },
    { name: "Susu kedelai", ratio: "1:1", note: "Untuk vegan" },
    { name: "Susu almond", ratio: "1:1", note: "Lebih ringan" },
  ],
  "santan": [
    { name: "Susu + mentega", ratio: "1:1 + 1sdm", note: "Per 250ml" },
    { name: "Krim kental", ratio: "1:1", note: "Lebih rich" },
    { name: "Yogurt", ratio: "1:1", note: "Lebih asam" },
  ],
  "mentega": [
    { name: "Margarin", ratio: "1:1", note: "Rasa sedikit berbeda" },
    { name: "Minyak sayur", ratio: "1:1.2", note: "Untuk baking" },
    { name: "Minyak kelapa", ratio: "1:1", note: "Rasa kelapa" },
  ],

  // Telur
  "telur": [
    { name: "Pisang tumbuk", ratio: "1 telur = 1/4 cup", note: "Untuk baking" },
    { name: "Chia seed + air", ratio: "1 telur = 1sdm + 3sdm air", note: "Tunggu 15 menit" },
    { name: "Tahu", ratio: "1 telur = 60g tahu", note: "Untuk tumisan" },
  ],

  // Tepung
  "tepung terigu": [
    { name: "Tepung beras", ratio: "1:1", note: "Lebih renyah" },
    { name: "Tepung maizena", ratio: "1:2", note: "Untuk pengental" },
    { name: "Tepung tapioka", ratio: "1:1", note: "Lebih kenyal" },
    { name: "Tepung sagu", ratio: "1:1", note: "Untuk gorengan" },
  ],
  "tepung maizena": [
    { name: "Tepung terigu", ratio: "2:1", note: "Kurang halus" },
    { name: "Tepung tapioka", ratio: "1:1", note: "Hasil mirip" },
    { name: "Tepung sagu", ratio: "1:1", note: "Tekstur kenyal" },
  ],

  // Bumbu Dasar
  "bawang merah": [
    { name: "Bawang bombay", ratio: "1:1", note: "Rasa lebih manis" },
    { name: "Bawang putih", ratio: "1:2", note: "Rasa berbeda" },
    { name: "Bawang goreng", ratio: "1:1", note: "Sudah matang" },
  ],
  "bawang putih": [
    { name: "Bawang putih bubuk", ratio: "1 siung = 1/4 sdt", note: "Praktis" },
    { name: "Bawang merah", ratio: "1:2", note: "Rasa berbeda" },
  ],
  "bawang bombay": [
    { name: "Bawang merah", ratio: "1:1", note: "Rasa lebih tajam" },
    { name: "Daun bawang", ratio: "1:1", note: "Lebih segar" },
  ],

  // Cabai
  "cabai merah": [
    { name: "Cabai rawit", ratio: "3:1", note: "Lebih pedas" },
    { name: "Paprika merah", ratio: "1:1", note: "Tidak pedas" },
    { name: "Sambal botol", ratio: "1sdm per cabai", note: "Sudah matang" },
  ],
  "cabai rawit": [
    { name: "Cabai merah", ratio: "1:3", note: "Kurang pedas" },
    { name: "Lada bubuk", ratio: "1 cabai = 1/4 sdt", note: "Pedas beda" },
    { name: "Saus sambal", ratio: "1 cabai = 1/2 sdt", note: "Praktis" },
  ],

  // Asam
  "jeruk nipis": [
    { name: "Jeruk lemon", ratio: "1:1", note: "Rasa mirip" },
    { name: "Cuka", ratio: "1:1", note: "Lebih tajam" },
    { name: "Asam jawa", ratio: "1sdm = 1/2 sdt", note: "Larutkan dulu" },
  ],
  "asam jawa": [
    { name: "Jeruk nipis", ratio: "1/2 sdt = 1sdm", note: "Lebih segar" },
    { name: "Cuka apel", ratio: "1:1", note: "Rasa berbeda" },
  ],

  // Kecap & Saus
  "kecap manis": [
    { name: "Kecap asin + gula merah", ratio: "1sdm + 1sdt", note: "Aduk rata" },
    { name: "Saus tiram + gula", ratio: "1sdm + 1/2 sdt", note: "Lebih gurih" },
  ],
  "kecap asin": [
    { name: "Kecap manis (dikurangi gula)", ratio: "1:1", note: "Kurangi garam" },
    { name: "Saus ikan", ratio: "1:1", note: "Rasa berbeda" },
    { name: "Soy sauce", ratio: "1:1", note: "Sama aja" },
  ],
  "saus tiram": [
    { name: "Kecap manis", ratio: "1:1", note: "Kurang umami" },
    { name: "Kecap asin + gula", ratio: "1sdm + 1/2 sdt", note: "Alternatif" },
  ],

  // Minyak
  "minyak goreng": [
    { name: "Minyak sayur", ratio: "1:1", note: "Sama saja" },
    { name: "Minyak kelapa", ratio: "1:1", note: "Aroma kelapa" },
    { name: "Minyak canola", ratio: "1:1", note: "Lebih sehat" },
  ],
  "minyak wijen": [
    { name: "Minyak goreng + wijen sangrai", ratio: "1:1 + sedikit", note: "Tumis wijen dulu" },
    { name: "Minyak kelapa", ratio: "1:1", note: "Rasa berbeda" },
  ],

  // Protein
  "daging ayam": [
    { name: "Daging sapi", ratio: "1:1", note: "Waktu masak lebih lama" },
    { name: "Tahu", ratio: "1:1", note: "Untuk vegetarian" },
    { name: "Tempe", ratio: "1:1", note: "Protein nabati" },
  ],
  "ayam": [
    { name: "Daging sapi", ratio: "1:1", note: "Waktu masak lebih lama" },
    { name: "Tahu", ratio: "1:1", note: "Untuk vegetarian" },
    { name: "Tempe", ratio: "1:1", note: "Protein nabati" },
    { name: "Jamur tiram", ratio: "1:1", note: "Tekstur mirip" },
  ],
  "daging sapi": [
    { name: "Daging ayam", ratio: "1:1", note: "Lebih cepat matang" },
    { name: "Daging kambing", ratio: "1:1", note: "Rasa lebih kuat" },
    { name: "Jamur", ratio: "1:1", note: "Untuk vegetarian" },
  ],
  "udang": [
    { name: "Cumi", ratio: "1:1", note: "Tekstur berbeda" },
    { name: "Ikan fillet", ratio: "1:1", note: "Lebih lembut" },
  ],
  "tahu": [
    { name: "Tempe", ratio: "1:1", note: "Lebih padat" },
    { name: "Daging ayam", ratio: "1:1", note: "Protein hewani" },
  ],
  "tempe": [
    { name: "Tahu", ratio: "1:1", note: "Lebih lembut" },
    { name: "Daging ayam", ratio: "1:1", note: "Non-vegetarian" },
  ],

  // Rempah
  "jahe": [
    { name: "Jahe bubuk", ratio: "1cm = 1/4 sdt", note: "Praktis" },
    { name: "Kunyit", ratio: "1:1", note: "Rasa berbeda" },
  ],
  "kunyit": [
    { name: "Kunyit bubuk", ratio: "1cm = 1/2 sdt", note: "Praktis" },
    { name: "Jahe", ratio: "1:1", note: "Tanpa warna kuning" },
  ],
  "lengkuas": [
    { name: "Jahe", ratio: "1:1", note: "Rasa lebih tajam" },
    { name: "Lengkuas bubuk", ratio: "1cm = 1/4 sdt", note: "Praktis" },
  ],
  "sereh": [
    { name: "Daun jeruk", ratio: "1 batang = 2 lembar", note: "Aroma citrus" },
    { name: "Sereh bubuk", ratio: "1 batang = 1 sdt", note: "Praktis" },
  ],
  "daun salam": [
    { name: "Daun jeruk", ratio: "1:1", note: "Aroma berbeda" },
    { name: "Bay leaves", ratio: "1:1", note: "Mirip" },
  ],

  // Penyedap
  "kaldu bubuk": [
    { name: "Kaldu ayam/sapi cair", ratio: "1 sdt = 100ml", note: "Lebih segar" },
    { name: "Garam + merica", ratio: "1:1", note: "Natural" },
  ],
  "kaldu ayam": [
    { name: "Kaldu bubuk ayam", ratio: "100ml = 1/2 sdt", note: "Praktis" },
    { name: "Air + garam + bawang putih", ratio: "1:1", note: "Natural" },
    { name: "Air rebusan ayam", ratio: "1:1", note: "Lebih segar" },
  ],
  "garam": [
    { name: "Kecap asin", ratio: "1 sdt = 1 sdm", note: "Tambah umami" },
    { name: "Garam laut", ratio: "1:1", note: "Lebih sehat" },
  ],

  // Merica
  "merica": [
    { name: "Lada hitam bubuk", ratio: "1:1", note: "Sama saja" },
    { name: "Lada putih bubuk", ratio: "1:1", note: "Lebih mild" },
    { name: "Cabai bubuk", ratio: "1:2", note: "Lebih pedas" },
  ],

  // Sayuran
  "selada": [
    { name: "Selada romaine", ratio: "1:1", note: "Lebih renyah" },
    { name: "Bayam segar", ratio: "1:1", note: "Lebih bernutrisi" },
    { name: "Kol ungu iris", ratio: "1:1", note: "Lebih warna" },
  ],
  "tomat cherry": [
    { name: "Tomat biasa potong", ratio: "10 buah = 2 buah besar", note: "Potong kecil-kecil" },
    { name: "Tomat anggur", ratio: "1:1", note: "Ukuran mirip" },
  ],
  "timun": [
    { name: "Zucchini", ratio: "1:1", note: "Rasa mirip" },
    { name: "Lobak putih", ratio: "1:1", note: "Lebih renyah" },
  ],
  "tomat": [
    { name: "Saus tomat", ratio: "1 buah = 2 sdm", note: "Lebih pekat" },
    { name: "Tomat kalengan", ratio: "1:1", note: "Praktis" },
  ],
  "daun bawang": [
    { name: "Bawang bombay", ratio: "1:1", note: "Rasa lebih kuat" },
    { name: "Seledri", ratio: "1:1", note: "Aroma berbeda" },
  ],

  // Minyak dan lemak
  "olive oil": [
    { name: "Minyak sayur", ratio: "1:1", note: "Lebih netral" },
    { name: "Minyak canola", ratio: "1:1", note: "Lebih sehat" },
    { name: "Minyak kelapa", ratio: "1:1", note: "Aroma kelapa" },
  ],

  // Buah asam
  "lemon": [
    { name: "Jeruk nipis", ratio: "1:1", note: "Rasa mirip" },
    { name: "Jeruk lemon lokal", ratio: "1:1", note: "Sama" },
    { name: "Cuka apel", ratio: "1 buah = 2 sdm", note: "Lebih tajam" },
  ],

  // Karbohidrat
  "nasi putih": [
    { name: "Nasi merah", ratio: "1:1", note: "Lebih sehat" },
    { name: "Nasi cauliflower", ratio: "1:1", note: "Low carb" },
    { name: "Quinoa", ratio: "1:1", note: "High protein" },
  ],

  // Buah
  "pisang": [
    { name: "Alpukat", ratio: "1:1", note: "Untuk smoothie" },
    { name: "Mangga", ratio: "1:1", note: "Lebih manis" },
    { name: "Ubi ungu kukus", ratio: "1 pisang = 100g", note: "Tekstur creamy" },
  ],
  "strawberry": [
    { name: "Raspberry", ratio: "1:1", note: "Rasa mirip" },
    { name: "Blueberry", ratio: "1:1", note: "Lebih manis" },
    { name: "Naga merah potong", ratio: "1:1", note: "Warna cantik" },
  ],

  // Dairy
  "yogurt": [
    { name: "Greek yogurt", ratio: "1:1", note: "Lebih kental" },
    { name: "Susu + perasan lemon", ratio: "150ml + 1 sdt", note: "Diamkan 5 menit" },
    { name: "Kefir", ratio: "1:1", note: "Probiotik" },
  ],

  // Topping
  "granola": [
    { name: "Oatmeal panggang", ratio: "1:1", note: "Lebih plain" },
    { name: "Kacang cincang", ratio: "1:1", note: "Lebih crunchy" },
    { name: "Sereal cornflakes", ratio: "1:1", note: "Lebih simple" },
  ],

  "kentang": [
    {
      name: "Ubi",
      ratio: "1:1",
      note: "Tekstur mirip"
    },
    {
      name: "Labu kuning",
      ratio: "1:1",
      note: "Lebih manis"
    }
  ],

  "wortel": [
    {
      name: "Labu kuning",
      ratio: "1:1",
      note: "Warna mirip"
    },
    {
      name: "Ubi jalar",
      ratio: "1:1",
      note: "Lebih manis"
    }
  ],

  "minyak zaitun": [
    {
      name: "Minyak sayur",
      ratio: "1:1",
      note: "Lebih netral"
    },
    {
      name: "Minyak canola",
      ratio: "1:1",
      note: "Alternatif sehat"
    }
  ],

  "lada hitam": [
    {
      name: "Merica putih",
      ratio: "1:1",
      note: "Rasa mirip"
    },
    {
      name: "Cabai bubuk",
      ratio: "1:2",
      note: "Lebih pedas"
    }
  ],

  "rosemary kering": [
    {
      name: "Thyme",
      ratio: "1:1",
      note: "Herbal mirip"
    },
    {
      name: "Oregano",
      ratio: "1:1",
      note: "Alternatif herbal"
    }
  ],
};

// Function to get substitutes for an ingredient
export function getSubstitutes(
  ingredientName
) {

  const normalized =
    normalizeIngredientName(
      ingredientName
    );

  if (
    INGREDIENT_SUBSTITUTES[
    normalized
    ]
  ) {
    return INGREDIENT_SUBSTITUTES[
      normalized
    ];
  }

  for (
    const [key, value]
    of Object.entries(
      INGREDIENT_SUBSTITUTES
    )
  ) {

    const normalizedKey =
      normalizeIngredientName(
        key
      );

    if (
      normalized.includes(
        normalizedKey
      ) ||
      normalizedKey.includes(
        normalized
      )
    ) {
      return value;
    }
  }

  return null;
}

// Function to check if ingredient has substitutes
export function hasSubstitutes(ingredientName) {
  return getSubstitutes(ingredientName) !== null;
}
