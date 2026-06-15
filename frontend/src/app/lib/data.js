export const mockIngredients = [
  "Tomat",
  "Telur",
  "Daun Bawang",
  "Bawang Putih",
  "Garam",
  "Merica",
];

export const mockRecipes = [
  {
    id: "1",
    title: "Sup Tomat Telur Hangat 🍅",
    emoji: "🍅",
    type: "Sup",
    image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHNvdXAlMjBib3dsfGVufDF8fHx8MTc3NDU0MDU3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    calories: 180,
    protein: 12,
    carbs: 15,
    prepTime: 20,
    servings: 2,
    isHalal: true,
    isVegetarian: true,
    isVegan: false,
    createdAt: "2023-10-01T12:00:00Z",
    tags: ["no-peanuts", "low-sugar"],
    ingredients: [
      { name: "Tomat", amount: 3, unit: "buah", available: true },
      { name: "Telur", amount: 2, unit: "butir", available: true },
      { name: "Daun Bawang", amount: 1, unit: "batang", available: true },
      { name: "Bawang Putih", amount: 2, unit: "siung", available: true },
      { name: "Kaldu Ayam", amount: 500, unit: "ml", available: false },
      { name: "Garam", amount: 1, unit: "sdt", available: true },
      { name: "Merica", amount: 0.5, unit: "sdt", available: true },
    ],
    steps: [
      {
        instruction: "Siapkan panci berisi air 500ml (sekitar 2.5 gelas). Nyalakan kompor dengan api sedang dan tunggu hingga air mulai mendidih. Setelah mendidih, tambahkan 1 sendok teh kaldu ayam bubuk, aduk hingga larut sempurna.",
        timer: 300, // 5 menit
        ingredients: ["500ml air", "1 sdt kaldu ayam bubuk"],
        image: "https://images.unsplash.com/photo-1768912742570-e10b7d2b755b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2lsaW5nJTIwd2F0ZXIlMjBwb3QlMjBzdG92ZXxlbnwxfHx8fDE3NzU0ODY1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Gunakan panci dengan diameter 18-20cm agar sup tidak terlalu cepat menguap. Air mendidih ditandai dengan gelembung besar yang naik ke permukaan."
      },
      {
        instruction: "Ambil 2 siung bawang putih, kupas kulitnya. Cincang halus bawang putih di atas talenan sampai berukuran sekitar 2-3mm. Panaskan 1 sendok makan minyak goreng dalam wajan kecil dengan api kecil, masukkan bawang putih cincang. Tumis sambil diaduk terus selama 2-3 menit hingga harum dan berwarna keemasan (jangan sampai gosong).",
        timer: 180, // 3 menit
        ingredients: ["2 siung bawang putih", "1 sdm minyak goreng"],
        image: "https://images.unsplash.com/photo-1677223069581-5f9136331304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5jaW5nJTIwZ2FybGljJTIwY2hvcHBpbmclMjBib2FyZHxlbnwxfHx8fDE3NzU0ODY1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Bawang putih mudah gosong, jadi gunakan api kecil dan aduk terus. Bawang putih harum ketika sudah mengeluarkan aroma khas dan berubah warna sedikit kecoklatan."
      },
      {
        instruction: "Cuci bersih 3 buah tomat di bawah air mengalir. Keringkan dengan tissue atau lap bersih. Letakkan tomat di atas talenan, potong menjadi 4 bagian sama besar (berbentuk seperti kuarter jeruk). Buang bagian tangkai yang keras. Masukkan semua potongan tomat ke dalam panci kaldu yang sudah mendidih. Tambahkan juga bawang putih yang sudah ditumis tadi beserta minyaknya.",
        timer: 0,
        ingredients: ["3 buah tomat ukuran sedang"],
        image: "https://images.unsplash.com/photo-1566045023481-8d1a32510f95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXR0aW5nJTIwdG9tYXRvJTIwa25pZmUlMjBib2FyZHxlbnwxfHx8fDE3NzU0ODY1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Pilih tomat yang masih segar dan tidak terlalu lunak. Potongan tidak perlu sempurna, yang penting ukurannya tidak terlalu besar agar cepat matang."
      },
      {
        instruction: "Ambil mangkuk kecil, pecahkan 2 butir telur ke dalamnya. Kocok telur menggunakan garpu atau pengocok telur selama 30 detik hingga kuning dan putih telur tercampur rata. Pastikan api kompor masih menyala dengan api sedang dan sup dalam keadaan mendidih. Pegang mangkuk telur dengan tangan kanan, tuangkan telur secara perlahan sambil tangan kiri mengaduk sup dengan gerakan memutar. Telur akan membentuk pita-pita cantik di dalam sup.",
        timer: 120, // 2 menit
        ingredients: ["2 butir telur ayam"],
        image: "https://images.unsplash.com/photo-1578121786255-aa255d1cff6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2luZyUyMGVnZ3MlMjBib3dsJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzU0ODY1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Kunci penting: tuang telur PERLAHAN seperti membuat garis tipis, dan aduk sup secara bersamaan. Jangan tuang sekaligus atau telur akan menggumpal. Sup harus tetap mendidih saat menuang telur."
      },
      {
        instruction: "Cuci 1 batang daun bawang, keringkan. Iris tipis-tipis daun bawang dengan ketebalan sekitar 3-5mm (baik bagian putih maupun hijaunya bisa digunakan semua). Masukkan irisan daun bawang ke dalam sup. Tambahkan 1 sendok teh garam dan 1/2 sendok teh merica bubuk. Aduk rata menggunakan sendok kayu atau spatula. Cicipi kuahnya, jika kurang asin bisa tambahkan sedikit garam lagi sesuai selera.",
        timer: 60, // 1 menit
        ingredients: ["1 batang daun bawang", "1 sdt garam", "1/2 sdt merica"],
        image: "https://images.unsplash.com/photo-1759689975472-c302b63b3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGRpbmclMjBoZXJicyUyMHNvdXAlMjBjb29raW5nfGVufDF8fHx8MTc3NTQ4NjU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Daun bawang tidak perlu dimasak terlalu lama, cukup 1 menit saja agar tetap segar dan renyah. Selalu cicipi dulu sebelum menambah garam karena kaldu bubuk sudah mengandung garam."
      },
      {
        instruction: "Tunggu sup mendidih kembali selama 2-3 menit dengan api sedang, biarkan semua bumbu meresap sempurna. Matikan kompor. Siapkan 2 mangkuk saji, tuangkan sup panas ke dalam mangkuk dengan hati-hati menggunakan sendok sayur. Pastikan tomat dan telur terbagi rata di kedua mangkuk. Sajikan segera selagi hangat. Sup ini cocok dimakan dengan nasi putih atau dimsum.",
        timer: 180, // 3 menit
        ingredients: [],
        image: "https://images.unsplash.com/photo-1763905145546-60bacfea6c9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aW5nJTIwc291cCUyMGJvd2wlMjBob3R8ZW58MXx8fHwxNzc1NDg2NTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Jika ingin lebih fancy, bisa tambahkan taburan bawang goreng atau minyak wijen di atasnya. Sup ini paling enak dimakan dalam 30 menit setelah dimasak."
      },
    ],
  },
  {
    id: "2",
    title: "Tumis Telur Tomat ala Resto 🍳",
    emoji: "🍳",
    type: "Tumis",
    image: "https://images.unsplash.com/photo-1599297915539-1f3448af2580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzdGlyJTIwZnJ5JTIwY29va2luZ3xlbnwxfHx8fDE3NzQ1NDA1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    calories: 220,
    protein: 14,
    carbs: 12,
    prepTime: 15,
    servings: 2,
    isHalal: true,
    isVegetarian: true,
    isVegan: false,
    createdAt: "2023-10-02T12:00:00Z",
    tags: ["no-peanuts", "low-sugar"],
    ingredients: [
      { name: "Telur", amount: 3, unit: "butir", available: true },
      { name: "Tomat", amount: 2, unit: "buah", available: true },
      { name: "Daun Bawang", amount: 2, unit: "batang", available: true },
      { name: "Bawang Putih", amount: 3, unit: "siung", available: true },
      { name: "Saus Tiram", amount: 1, unit: "sdm", available: false },
      { name: "Kecap Manis", amount: 1, unit: "sdt", available: false },
      { name: "Minyak Goreng", amount: 2, unit: "sdm", available: true },
      { name: "Garam", amount: 0.5, unit: "sdt", available: true },
    ],
    steps: [
      {
        instruction: "Ambil mangkuk berukuran sedang, pecahkan 3 butir telur ke dalamnya. Tambahkan 1/4 sendok teh garam (sedikit saja). Kocok telur menggunakan garpu atau pengocok telur selama 30-45 detik hingga kuning dan putih telur tercampur rata dan sedikit berbusa. Sisihkan di samping kompor.",
        timer: 60,
        ingredients: ["3 butir telur", "1/4 sdt garam"],
        image: "https://images.unsplash.com/photo-1612544409798-799ab134af91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2luZyUyMGVnZ3MlMjBzYWx0JTIwYm93bHxlbnwxfHx8fDE3NzU0ODY5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Telur yang dikocok rata akan menghasilkan tekstur yang lebih lembut. Jangan kocok terlalu lama karena akan terlalu berbusa."
      },
      {
        instruction: "Cuci 2 buah tomat, keringkan. Letakkan di talenan, potong menjadi 8 bagian (seperti memotong pizza menjadi 8 slice). Cuci 2 batang daun bawang, keringkan. Iris daun bawang tipis-tipis dengan ketebalan sekitar 5mm, gunakan bagian putih dan hijau semuanya.",
        timer: 0,
        ingredients: ["2 buah tomat", "2 batang daun bawang"],
        image: "https://images.unsplash.com/photo-1677751632736-f0e9800186d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9wcGluZyUyMHZlZ2V0YWJsZXMlMjBjdXR0aW5nJTIwYm9hcmR8ZW58MXx8fHwxNzc1NDg2OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Siapkan semua bahan terlebih dahulu (mise en place) karena proses memasak akan sangat cepat. Pastikan talenan kering agar aman saat memotong."
      },
      {
        instruction: "Kupas 3 siung bawang putih. Cincang halus bawang putih hingga ukuran 2-3mm. Panaskan wajan dengan api sedang, tuang 2 sendok makan minyak goreng. Tunggu 30 detik hingga minyak panas (tes dengan memasukkan 1 potongan bawang putih, jika mengeluarkan bunyi 'sssss' berarti sudah panas). Masukkan semua bawang putih cincang, tumis sambil diaduk terus selama 1-2 menit hingga berwarna keemasan dan harum.",
        timer: 120,
        ingredients: ["3 siung bawang putih", "2 sdm minyak goreng"],
        image: "https://images.unsplash.com/photo-1751151497803-baad38515fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlyJTIwZnJ5aW5nJTIwd29rJTIwY29va2luZ3xlbnwxfHx8fDE3NzU0ODY5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Jangan tinggalkan kompor! Bawang putih bisa gosong dalam hitungan detik. Jika sudah harum dan kecoklatan, langsung lanjut ke step berikutnya."
      },
      {
        instruction: "Dengan api yang masih sedang, tuangkan kocokan telur ke dalam wajan yang sudah ada bawang putih. JANGAN diaduk dulu, biarkan selama 10 detik agar bagian bawah mulai mengeras. Setelah itu, aduk cepat dengan spatula atau sendok kayu menggunakan gerakan melingkar dan mengangkat dari bawah. Aduk terus selama 1-2 menit hingga telur setengah matang (masih sedikit basah dan lembek).",
        timer: 120,
        ingredients: ["Kocokan telur dari step 1"],
        image: "https://images.unsplash.com/photo-1612251232294-82bf287fa349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3JhbWJsZWQlMjBlZ2dzJTIwY29va2luZyUyMHBhbnxlbnwxfHx8fDE3NzU0ODY5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Kunci telur tumis yang enak adalah jangan sampai terlalu matang! Angkat saat masih sedikit basah karena telur akan terus matang setelah diangkat dari kompor."
      },
      {
        instruction: "Tambahkan potongan tomat ke dalam wajan. Tuangkan 1 sendok makan saus tiram dan 1 sendok teh kecap manis. Aduk rata dengan gerakan cepat selama 30-45 detik. Pastikan saus tiram dan kecap manis merata di semua bagian telur dan tomat. Tomat akan sedikit layu tapi masih ada teksturnya.",
        timer: 45,
        ingredients: ["Potongan tomat", "1 sdm saus tiram", "1 sdt kecap manis"],
        image: "https://images.unsplash.com/photo-1751151497803-baad38515fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlyJTIwZnJ5aW5nJTIwd29rJTIwY29va2luZ3xlbnwxfHx8fDE3NzU0ODY5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Masak cepat dengan api sedang-besar agar tomat tidak terlalu lembek. Kita mau tomat tetap segar dan sedikit renyah."
      },
      {
        instruction: "Matikan kompor. Tambahkan irisan daun bawang, aduk cepat 2-3 kali saja (daun bawang tidak perlu dimasak lama). Cicipi, jika kurang asin bisa tambah sedikit garam. Pindahkan ke piring saji. Hidangkan selagi hangat dengan nasi putih hangat atau nasi goreng.",
        timer: 0,
        ingredients: ["Irisan daun bawang"],
        image: "https://images.unsplash.com/photo-1775379995350-0647951b9f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aW5nJTIwcGxhdGUlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzc1NDg2OTA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Daun bawang ditambahkan terakhir agar tetap hijau segar dan renyah. Tumisan ini paling enak dimakan dalam 15 menit setelah dimasak."
      },
    ],
  },
  {
    id: "3",
    title: "Telur Dadar Tomat Praktis 🥚",
    emoji: "🥚",
    type: "Goreng",
    image: "https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzc0NTAzMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    calories: 250,
    protein: 15,
    carbs: 8,
    prepTime: 10,
    servings: 2,
    isHalal: true,
    isVegetarian: true,
    isVegan: false,
    createdAt: "2023-10-03T12:00:00Z",
    tags: ["no-peanuts", "low-sugar"],
    ingredients: [
      { name: "Telur", amount: 4, unit: "butir", available: true },
      { name: "Tomat", amount: 1, unit: "buah", available: true },
      { name: "Daun Bawang", amount: 2, unit: "batang", available: false },
      { name: "Bawang Putih", amount: 2, unit: "siung", available: true },
      { name: "Minyak Goreng", amount: 3, unit: "sdm", available: true },
      { name: "Garam", amount: 1, unit: "sdt", available: true },
      { name: "Merica", amount: 0.5, unit: "sdt", available: true },
    ],
    steps: [
      {
        instruction: "Cuci 1 buah tomat, keringkan. Potong tomat menjadi dadu kecil (sekitar 5x5mm). Cuci 2 batang daun bawang, iris tipis-tipis. Kupas 2 siung bawang putih lalu cincang halus hingga ukuran 2-3mm. Siapkan semua bahan dalam wadah terpisah supaya mudah saat memasak.",
        timer: 0,
        ingredients: ["1 buah tomat", "2 batang daun bawang", "2 siung bawang putih"],
        image: "https://images.unsplash.com/photo-1584699006748-1e77dca77d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWNpbmclMjB2ZWdldGFibGVzJTIwa25pZmUlMjBib2FyZHxlbnwxfHx8fDE3NzU0ODY5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Potong dadu kecil agar bahan merata di dalam telur dadar. Jika dadu terlalu besar, telur dadar akan mudah sobek saat dibalik."
      },
      {
        instruction: "Ambil mangkuk besar, pecahkan 4 butir telur ke dalamnya. Tambahkan potongan tomat, irisan daun bawang, cincangan bawang putih, 1 sendok teh garam, dan 1/2 sendok teh merica bubuk. Kocok semua bahan menggunakan garpu atau pengocok telur selama 1 menit hingga rata dan semua bumbu tercampur sempurna.",
        timer: 60,
        ingredients: ["4 butir telur", "Tomat cincang", "Daun bawang iris", "Bawang putih cincang", "1 sdt garam", "1/2 sdt merica"],
        image: "https://images.unsplash.com/photo-1580238047261-8d74523636a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhpbmclMjBlZ2dzJTIwYm93bCUyMHdoaXNraW5nfGVufDF8fHx8MTc3NTQ4Njk2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Pastikan semua bahan tercampur rata agar setiap gigitan telur dadar punya rasa yang sama. Jangan kocok terlalu keras agar telur tidak terlalu berbusa."
      },
      {
        instruction: "Panaskan wajan berdiameter 20-25cm dengan api sedang. Tuangkan 3 sendok makan minyak goreng, tunggu 30-45 detik hingga minyak panas. Tes dengan memasukkan 1 tetes adonan telur, jika langsung mengembang berarti minyak sudah siap.",
        timer: 60,
        ingredients: ["3 sdm minyak goreng"],
        image: "https://images.unsplash.com/photo-1653806347022-d40d152ca3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF0aW5nJTIwb2lsJTIwcGFuJTIwc2tpbGxldHxlbnwxfHx8fDE3NzU0ODY5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Gunakan wajan anti lengket agar telur dadar tidak lengket. Minyak yang cukup panas penting agar telur langsung matang dan tidak menyerap terlalu banyak minyak."
      },
      {
        instruction: "Tuangkan semua adonan telur ke dalam wajan. Ratakan adonan dengan menggoyang-goyangkan wajan atau menggunakan spatula. Pastikan ketebalan merata sekitar 1-1.5cm. Kecilkan api menjadi sedang-kecil, masak selama 3-4 menit hingga bagian bawah mulai kecoklatan dan bagian atas setengah matang.",
        timer: 240,
        ingredients: ["Adonan telur dari step 2"],
        image: "https://images.unsplash.com/photo-1613425662920-b957a1e979e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VyaW5nJTIwYmF0dGVyJTIwcGFuJTIwb21lbGV0dGV8ZW58MXx8fHwxNzc1NDg2OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Jangan tergesa-gesa membalik! Tunggu sampai bagian bawah benar-benar set agar tidak hancur saat dibalik. Ciri-ciri siap dibalik: bagian tepi sudah kering dan mudah dilepas dari wajan."
      },
      {
        instruction: "Dengan spatula lebar, balik telur dadar dengan hati-hati. Cara mudah: tutup wajan dengan piring datar, balik wajan sehingga telur dadar pindah ke piring, lalu geser kembali ke wajan dengan sisi yang belum matang di bawah. Masak sisi satunya lagi selama 2-3 menit hingga kecoklatan.",
        timer: 180,
        ingredients: [],
        image: "https://images.unsplash.com/photo-1613425662920-b957a1e979e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGlwcGluZyUyMG9tZWxldHRlJTIwc3BhdHVsYXxlbnwxfHx8fDE3NzU0ODY5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Trick untuk pemula: gunakan teknik piring untuk membalik! Ini lebih aman dan telur dadar tidak akan hancur. Atau bisa juga menggunakan 2 spatula lebar."
      },
      {
        instruction: "Setelah kedua sisi kecoklatan sempurna, angkat telur dadar ke piring. Biarkan dingin selama 1-2 menit agar mudah dipotong. Potong telur dadar menjadi 4-6 bagian seperti memotong pizza. Sajikan hangat sebagai lauk dengan nasi putih atau sebagai isian roti.",
        timer: 0,
        ingredients: [],
        image: "https://images.unsplash.com/photo-1722261207970-934c5dcef1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBvbWVsZXR0ZSUyMHBsYXRlJTIwc2VydmluZ3xlbnwxfHx8fDE3NzU0ODY5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Telur dadar ini bisa disimpan dalam kulkas dan dipanaskan kembali besoknya. Paling enak dimakan 10-15 menit setelah diangkat saat masih hangat tapi tidak terlalu panas."
      },
    ],
  },
  {
    id: "4",
    title: "Salad Sayur Segar 🥗",
    emoji: "🥗",
    type: "Tumis",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1080",
    calories: 120,
    protein: 5,
    carbs: 18,
    prepTime: 8,
    servings: 2,
    isHalal: true,
    isVegetarian: true,
    isVegan: true,
    createdAt: "2026-03-30T12:00:00Z",
    tags: ["no-peanuts", "low-sugar", "gluten-free"],
    ingredients: [
      { name: "Selada", amount: 100, unit: "gram", available: true },
      { name: "Tomat Cherry", amount: 10, unit: "buah", available: true },
      { name: "Timun", amount: 1, unit: "buah", available: true },
      { name: "Olive Oil", amount: 2, unit: "sdm", available: true },
      { name: "Lemon", amount: 1, unit: "buah", available: true },
    ],
    steps: [
      {
        instruction: "Cuci bersih 100 gram selada di bawah air mengalir, pastikan tidak ada kotoran. Keringkan selada dengan spinner salad atau lap bersih. Sobek-sobek selada dengan tangan menjadi ukuran sekitar 5x5cm. Jangan potong dengan pisau karena akan membuat selada cepat layu.",
        timer: 0,
        ingredients: ["100g selada"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        tips: "Selada yang masih basah akan membuat dressing tidak menempel. Pastikan benar-benar kering sebelum dicampur dengan bahan lain."
      },
      {
        instruction: "Cuci 10 buah tomat cherry dan 1 buah timun. Potong setiap tomat cherry menjadi 2 bagian. Kupas timun (boleh dikupas sebagian saja untuk warna), lalu iris tipis membentuk bulatan dengan ketebalan sekitar 3mm.",
        timer: 0,
        ingredients: ["10 buah tomat cherry", "1 buah timun"],
        image: "https://images.unsplash.com/photo-1584699006748-1e77dca77d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWNpbmclMjB2ZWdldGFibGVzJTIwa25pZmUlMjBib2FyZHxlbnwxfHx8fDE3NzU0ODY5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Tomat cherry yang dibelah akan lebih mudah menyerap dressing. Iris timun tipis agar renyah dan mudah dimakan."
      },
      {
        instruction: "Siapkan mangkuk salad besar. Masukkan selada yang sudah disobek, tomat cherry yang sudah dibelah, dan irisan timun. Aduk perlahan dengan tangan atau sendok salad besar hingga semua bahan tercampur merata.",
        timer: 0,
        ingredients: ["Selada sobek", "Tomat cherry belah", "Irisan timun"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        tips: "Jangan aduk terlalu keras agar selada tidak rusak. Cukup campur saja hingga merata."
      },
      {
        instruction: "Belah 1 buah lemon menjadi 2 bagian. Peras lemon di atas mangkuk kecil, saring bijinya. Tambahkan 2 sendok makan olive oil extra virgin ke dalam perasan lemon. Tambahkan sejumput garam dan merica sesuai selera (opsional). Kocok dengan garpu hingga dressing tercampur rata membentuk emulsi.",
        timer: 0,
        ingredients: ["1 buah lemon", "2 sdm olive oil", "Garam dan merica secukupnya"],
        image: "https://images.unsplash.com/photo-1580238047261-8d74523636a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhpbmclMjBlZ2dzJTIwYm93bCUyMHdoaXNraW5nfGVufDF8fHx8MTc3NTQ4Njk2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Perbandingan ideal dressing: 1 bagian asam (lemon) dan 2 bagian minyak (olive oil). Kocok sampai sedikit kental dan berwarna lebih terang."
      },
      {
        instruction: "Tuangkan dressing ke atas salad. Aduk perlahan dengan 2 sendok salad menggunakan gerakan mengangkat dari bawah ke atas (toss) agar dressing merata di semua sayuran. Jangan diaduk seperti mengaduk nasi, tapi diangkat-angkat. Cicipi, tambah garam atau lemon jika perlu. Sajikan segera!",
        timer: 0,
        ingredients: ["Dressing dari step 4"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        tips: "Salad paling enak dimakan dalam 5 menit setelah dressing ditambahkan. Jika terlalu lama, selada akan layu. Kalau mau disimpan, taruh dressing terpisah dan campur sesaat sebelum dimakan."
      },
    ],
  },
  {
    id: "5",
    title: "Nasi Goreng Spesial 🍚",
    emoji: "🍚",
    type: "Goreng",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1080",
    calories: 420,
    protein: 18,
    carbs: 52,
    prepTime: 25,
    servings: 2,
    isHalal: true,
    isVegetarian: false,
    isVegan: false,
    createdAt: "2026-03-29T12:00:00Z",
    tags: ["no-peanuts"],
    ingredients: [
      { name: "Nasi Putih", amount: 400, unit: "gram", available: true },
      { name: "Telur", amount: 2, unit: "butir", available: true },
      { name: "Ayam", amount: 150, unit: "gram", available: true },
      { name: "Bawang Putih", amount: 4, unit: "siung", available: true },
      { name: "Kecap Manis", amount: 2, unit: "sdm", available: true },
    ],
    steps: [
      {
        instruction: "Potong 150 gram daging ayam (fillet dada atau paha) menjadi dadu kecil ukuran 1x1cm. Masukkan ke dalam mangkuk, tambahkan 1 sendok makan kecap manis dan sejumput merica. Aduk rata dan diamkan selama 10 menit agar bumbu meresap.",
        timer: 600,
        ingredients: ["150g ayam", "1 sdm kecap manis", "Merica secukupnya"],
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        tips: "Marinasi membuat ayam lebih beraroma. Kalau punya waktu lebih, marinasi selama 30 menit di kulkas untuk hasil lebih maksimal."
      },
      {
        instruction: "Kupas dan cincang halus 4 siung bawang putih hingga ukuran 2-3mm. Panaskan wajan besar atau wok dengan api sedang-besar. Tuang 2 sendok makan minyak goreng, tunggu 20 detik. Masukkan bawang putih cincang, tumis sambil diaduk cepat selama 30-45 detik hingga harum dan keemasan. Jangan sampai gosong!",
        timer: 60,
        ingredients: ["4 siung bawang putih", "2 sdm minyak goreng"],
        image: "https://images.unsplash.com/photo-1751151497803-baad38515fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlyJTIwZnJ5aW5nJTIwd29rJTIwY29va2luZ3xlbnwxfHx8fDE3NzU0ODY5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Api harus cukup besar untuk menumis nasi goreng agar nasinya tidak lengket. Bawang putih adalah kunci aroma nasi goreng yang enak!"
      },
      {
        instruction: "Masukkan potongan ayam yang sudah dimarinasi beserta sisa kecapnya. Tumis dengan api besar sambil diaduk terus selama 3-4 menit hingga ayam berubah warna menjadi putih dan matang sempurna (tidak ada lagi warna merah muda). Pastikan ayam tidak menempel di wajan.",
        timer: 240,
        ingredients: ["Ayam marinasi dari step 1"],
        image: "https://images.unsplash.com/photo-1751151497803-baad38515fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlyJTIwZnJ5aW5nJTIwd29rJTIwY29va2luZ3xlbnwxfHx8fDE3NzU0ODY5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Ayam harus benar-benar matang sebelum lanjut ke tahap berikutnya. Ciri ayam matang: warnanya putih semua dan jika ditekan keluar cairan bening (bukan merah muda)."
      },
      {
        instruction: "Sisihkan ayam ke pinggir wajan. Di tengah wajan yang kosong, pecahkan 2 butir telur langsung. Aduk cepat telur dengan spatula atau sendok kayu seperti membuat orak-arik. Masak 30-45 detik hingga telur setengah matang (masih sedikit basah). Campur telur dengan ayam, aduk rata.",
        timer: 60,
        ingredients: ["2 butir telur"],
        image: "https://images.unsplash.com/photo-1612251232294-82bf287fa349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3JhbWJsZWQlMjBlZ2dzJTIwY29va2luZyUyMHBhbnxlbnwxfHx8fDE3NzU0ODY5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        tips: "Telur tidak perlu matang sempurna karena akan dimasak lagi bersama nasi. Telur yang terlalu matang akan keras dan tidak enak."
      },
      {
        instruction: "Masukkan 400 gram nasi putih (gunakan nasi yang sudah dingin atau nasi kemarin dari kulkas agar tidak lengket). Aduk rata dengan ayam dan telur menggunakan spatula, tekan-tekan nasi yang menggumpal. Tuang 1 sendok makan kecap manis dan 1/2 sendok teh garam. Aduk terus dengan api besar selama 3-4 menit hingga nasi berubah warna kecoklatan dan tidak ada yang menggumpal. Setiap butir nasi harus terpisah.",
        timer: 240,
        ingredients: ["400g nasi putih dingin", "1 sdm kecap manis", "1/2 sdt garam"],
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        tips: "Kunci nasi goreng pulen: gunakan nasi yang sudah dingin/kemarin. Nasi hangat akan lengket. Aduk dengan gerakan mengangkat dan menekan, bukan mengaduk biasa."
      },
      {
        instruction: "Cicipi nasi goreng, tambahkan garam atau kecap manis jika kurang. Matikan kompor. Pindahkan ke piring saji. Nasi goreng bisa dihias dengan irisan timun, tomat, dan kerupuk. Sajikan selagi panas. Enak dimakan dengan acar atau sambal!",
        timer: 0,
        ingredients: [],
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        tips: "Nasi goreng paling enak dimakan langsung setelah dimasak saat masih panas dan ngebul. Jika ada sisa, simpan dalam wadah kedap udara di kulkas, tahan 1-2 hari."
      },
    ],
  },
  {
    id: "6",
    title: "Smoothie Bowl Sehat 🥥",
    emoji: "🥥",
    type: "Sup",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1080",
    calories: 280,
    protein: 8,
    carbs: 45,
    prepTime: 5,
    servings: 1,
    isHalal: true,
    isVegetarian: true,
    isVegan: true,
    createdAt: "2026-03-31T12:00:00Z",
    tags: ["no-peanuts", "gluten-free"],
    ingredients: [
      { name: "Pisang", amount: 2, unit: "buah", available: true },
      { name: "Strawberry", amount: 100, unit: "gram", available: true },
      { name: "Yogurt", amount: 150, unit: "ml", available: true },
      { name: "Granola", amount: 50, unit: "gram", available: true },
    ],
    steps: [
      {
        instruction: "Kupas 2 buah pisang (pilih yang sudah matang dengan kulit agak berbintik agar lebih manis). Potong pisang menjadi 4-5 bagian. Jika ingin tekstur lebih kental dan dingin seperti ice cream, gunakan pisang beku (potong lalu simpan di freezer minimal 3 jam sebelumnya).",
        timer: 0,
        ingredients: ["2 buah pisang matang"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        tips: "Pisang beku membuat smoothie bowl lebih thick dan creamy seperti es krim. Kalau tidak punya, pisang biasa juga ok, tapi tambahkan es batu 3-4 buah."
      },
      {
        instruction: "Cuci bersih 100 gram strawberry di bawah air mengalir. Buang bagian daunnya. Potong strawberry menjadi 2-4 bagian tergantung ukurannya. Sisihkan 3-4 buah strawberry untuk topping nanti, sisanya akan diblender.",
        timer: 0,
        ingredients: ["100g strawberry segar"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        tips: "Strawberry yang manis akan membuat smoothie bowl lebih enak. Kalau strawberry terlalu asam, bisa tambahkan 1 sendok madu saat blender."
      },
      {
        instruction: "Masukkan potongan pisang, strawberry (kecuali yang untuk topping), dan 150ml yogurt plain atau yogurt rasa vanila ke dalam blender. Blender dengan kecepatan tinggi selama 30-45 detik hingga halus sempurna dan teksturnya creamy seperti soft ice cream. Jika terlalu kental, tambahkan 1-2 sendok makan susu atau air.",
        timer: 45,
        ingredients: ["Pisang potong", "Strawberry (sebagian besar)", "150ml yogurt"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        tips: "Jangan blender terlalu lama karena akan mencair. Kita mau tekstur thick yang bisa dimakan dengan sendok, bukan diminum. Konsistensi ideal: seperti es krim yang agak lembek."
      },
      {
        instruction: "Tuangkan smoothie ke dalam mangkuk (bowl) yang agak dalam. Ratakan permukaannya dengan sendok. Sekarang waktunya berkreasi dengan topping! Taburi 50 gram granola di atas smoothie. Hias dengan irisan strawberry yang tadi disisihkan. Bisa tambahkan topping lain seperti: irisan pisang, chia seeds, kacang almond, atau madu.",
        timer: 0,
        ingredients: ["50g granola", "Strawberry untuk topping", "Topping tambahan (opsional)"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        tips: "Topping granola sebaiknya ditabur sesaat sebelum dimakan agar tetap renyah. Kalau ditabur terlalu lama, granola akan lembek kena smoothie."
      },
      {
        instruction: "Smoothie bowl sudah siap! Sajikan segera selagi dingin. Makan dengan sendok, nikmati kombinasi tekstur smoothie yang lembut dengan granola yang crunchy. Smoothie bowl ini sempurna untuk sarapan sehat atau snack sore yang menyegarkan.",
        timer: 0,
        ingredients: [],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        tips: "Smoothie bowl paling enak dimakan dalam 10 menit setelah dibuat karena akan mulai mencair. Jika ingin lebih kenyang, bisa tambahkan protein powder atau selai kacang saat blender."
      },
    ],
  },
];

export const mockScanHistory = [
  {
    id: "1",
    date: "2026-03-26",
    ingredients: ["Tomat", "Telur", "Daun Bawang"],
    image: "https://images.unsplash.com/photo-1710389205434-1ecc531d364d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwaW5ncmVkaWVudHMlMjB0b21hdG8lMjBlZ2d8ZW58MXx8fHwxNzc0NTQwNTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    recipesGenerated: 3,
  },
  {
    id: "2",
    date: "2026-03-25",
    ingredients: ["Ayam", "Brokoli", "Wortel", "Bawang Bombay"],
    image: "https://images.unsplash.com/photo-1604835070732-aec3563c26c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwZnJpZGdlJTIwZnJlc2glMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3NDU0MDU3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    recipesGenerated: 3,
  },
];


export const dietaryPreferences = [
  {
    id: "no-preference",
    label: "Tanpa Preferensi",
    description: "Semua jenis resep",
    icon: "🍽️",
  },
  {
    id: "halal",
    label: "Halal",
    description: "Hanya resep halal",
    icon: "✓",
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    description: "Tanpa daging",
    icon: "🥗",
  },
  {
    id: "vegan",
    label: "Vegan",
    description: "Tanpa produk hewani",
    icon: "🥬",
  },
  {
    id: "no-peanuts",
    label: "Tanpa Kacang",
    description: "Alergi kacang",
    icon: "🚫",
  },
  {
    id: "low-sugar",
    label: "Rendah Gula",
    description: "Diet gula",
    icon: "🍬",
  },
  {
    id: "gluten-free",
    label: "Bebas Gluten",
    description: "Tanpa gluten",
    icon: "🌾",
  },
];

// Messages & Chat Data



export const mockContacts = [
  {
    id: "1",
    name: "Sarah Chef",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    isOnline: true,
  },
  {
    id: "2",
    name: "Budi Kuliner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    isOnline: true,
  },
  {
    id: "3",
    name: "Rina Kitchen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    isOnline: false,
    lastSeen: "2 jam lalu",
  },
  {
    id: "4",
    name: "Chef Andre",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    isOnline: true,
  },
  {
    id: "5",
    name: "Lisa Food",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    isOnline: false,
    lastSeen: "5 menit lalu",
  },
];

export const mockChats = [
  {
    id: "1",
    name: "Grup Masak Bareng",
    avatar: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200",
    isGroup: true,
    participants: [mockContacts[0], mockContacts[1], mockContacts[2]],
    lastMessage: "Sarah: Resep nasi goreng nya enak banget! 🍳",
    lastMessageTime: "10:30",
    unreadCount: 3,
  },
  {
    id: "2",
    name: "Sarah Chef",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    isGroup: false,
    participants: [mockContacts[0]],
    lastMessage: "Makasih ya resepnya! 😊",
    lastMessageTime: "09:15",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "3",
    name: "Chef Andre",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    isGroup: false,
    participants: [mockContacts[3]],
    lastMessage: "Foto: IMG_1234.jpg",
    lastMessageTime: "Kemarin",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "4",
    name: "Komunitas Foodies",
    avatar: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200",
    isGroup: true,
    participants: [mockContacts[1], mockContacts[3], mockContacts[4]],
    lastMessage: "Budi: Ada yang mau coba resep baru?",
    lastMessageTime: "Kemarin",
    unreadCount: 0,
  },
];

export const mockChatMessages = {
  "1": [
    {
      id: "1",
      senderId: "2",
      senderName: "Budi Kuliner",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      text: "Halo teman-teman! Ada yang punya resep nasi goreng spesial?",
      timestamp: "10:00",
    },
    {
      id: "2",
      senderId: "1",
      senderName: "Sarah Chef",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      text: "Aku punya! Nanti aku share resepnya ya 😊",
      timestamp: "10:05",
      reactions: [{ emoji: "👍", userIds: ["2", "3"] }],
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Sarah Chef",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
      text: "Ini hasilnya! 🍳",
      timestamp: "10:10",
      reactions: [
        { emoji: "❤️", userIds: ["2", "3", "me"] },
        { emoji: "🔥", userIds: ["2"] },
      ],
    },
    {
      id: "4",
      senderId: "me",
      senderName: "You",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      text: "Wah kelihatan enak banget Sarah!",
      timestamp: "10:15",
    },
    {
      id: "5",
      senderId: "1",
      senderName: "Sarah Chef",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      text: "Resep nasi goreng nya enak banget! 🍳",
      timestamp: "10:30",
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "1",
      senderName: "Sarah Chef",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      text: "Hai! Aku baru coba resep dari SnapChef AI",
      timestamp: "09:00",
    },
    {
      id: "2",
      senderId: "me",
      senderName: "You",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      text: "Oh ya? Hasilnya gimana?",
      timestamp: "09:10",
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Sarah Chef",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      text: "Makasih ya resepnya! 😊",
      timestamp: "09:15",
      reactions: [{ emoji: "❤️", userIds: ["me"] }],
    },
  ],
};