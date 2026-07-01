'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Seed User
    const passwordA = await bcrypt.hash('password123', 10);
    const passwordB = await bcrypt.hash('cincai', 10);
    const passwordC = await bcrypt.hash('nia', 10);
    const passwordD = await bcrypt.hash('sastra', 10);
    const passwordE = await bcrypt.hash('steven', 10);
    const users = await queryInterface.bulkInsert('Users', [
      {
        name: 'Pak Gilbert Fernando Situmorang',
        email: 'gilbert.situmorang@mikroskil.ac.id',
        password: passwordA,
        role: 'premium',
        scanLimit: 3,
        lastScanDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Carita Angel Samudra Tjoatja',
        email: 'carita.angel@students.mikroskil.ac.id',
        password: passwordB,
        role: 'user',
        scanLimit: 3,
        lastScanDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Therania',
        email: 'therania@students.mikroskil.ac.id',
        password: passwordC,
        role: 'user',
        scanLimit: 3,
        lastScanDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sastrawan',
        email: 'sastrawan@students.mikroskil.ac.id',
        password: passwordD,
        role: 'user',
        scanLimit: 3,
        lastScanDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Steven Lienardi',
        email: 'steven.lienardi@students.mikroskil.ac.id',
        password: passwordE,
        role: 'user',
        scanLimit: 3,
        lastScanDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true }); // Minta ID yang di-generate

    // Asumsi ID user pertama adalah 1 (jika DB kosong sebelumnya)
    const userId = 1;

    // 2. Seed Recipe
    const recipes = await queryInterface.bulkInsert('Recipes', [
      {
        title: 'Nasi Goreng Sisa Semalam',
        ingredients: '2 piring nasi putih\n1 butir telur\n2 siung bawang putih\nKecap manis secukupnya',
        instructions: '1. Tumis bawang putih hingga harum.\n2. Masukkan telur, orak-arik.\n3. Masukkan nasi dan kecap, aduk rata.\n4. Sajikan hangat.',
        calories: 350,
        protein: 10,
        carbs: 45,
        prepTime: 15,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mie Goreng',
        ingredients: '1 bungkus mie \n1 butir telur\n2 siung bawang putih\nKecap manis secukupnya',
        instructions: '1. Tumis bawang putih hingga harum.\n2. Masukkan telur, orak-arik.\n3. Masukkan mie yang sudah di rebus dan kecap, aduk rata.\n4. Sajikan hangat.',
        calories: 250,
        protein: 5,
        carbs: 50,
        prepTime: 10,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ayam Kecap Bawang Bombay',
        ingredients: '500 gram ayam potong\n1 buah bawang bombay, iris\n3 siung bawang putih, cincang\n4 sdm kecap manis\n1 sdt garam dan lada',
        instructions: '1. Tumis bawang putih dan bombay hingga harum.\n2. Masukkan ayam, masak hingga berubah warna.\n3. Tambahkan kecap manis, garam, lada, dan sedikit air.\n4. Masak hingga bumbu meresap dan ayam matang.',
        calories: 320,
        protein: 25,
        carbs: 15,
        prepTime: 30,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Sayur Sop Bening Bakso',
        ingredients: '2 buah wortel, potong\n1/2 bonggol kubis, potong\n5 buah bakso sapi, belah\n2 siung bawang putih, memarkan\nKaldu bubuk dan seledri secukupnya',
        instructions: '1. Didihkan air, masukkan bawang putih memar.\n2. Masukkan wortel dan bakso, masak hingga setengah empuk.\n3. Tambahkan kubis, kaldu bubuk, dan seledri.\n4. Masak sebentar hingga sayuran matang, angkat dan sajikan.',
        calories: 150,
        protein: 8,
        carbs: 20,
        prepTime: 20,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Telur Dadar Khas Padang',
        ingredients: '3 butir telur ayam/bebek\n2 sdm kelapa parut sangrai\n2 sdm tepung beras\n3 butir bawang merah, iris tipis\n1 sdt bumbu kari bubuk',
        instructions: '1. Campur semua bahan dalam mangkuk, kocok hingga rata dan sedikit mengembang.\n2. Panaskan minyak yang cukup banyak di wajan.\n3. Tuang adonan telur, masak dengan api sedang.\n4. Balik perlahan saat bagian bawah sudah kokoh, masak hingga kecoklatan.',
        calories: 280,
        protein: 18,
        carbs: 10,
        prepTime: 15,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // 3. Seed Ingredient (Stok Bahan)
    await queryInterface.bulkInsert('Ingredients', [
      { name: 'Telur Ayam', amount: 5, unit: 'butir', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tomat', amount: 3, unit: 'buah', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bawang Putih', amount: 10, unit: 'siung', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bawang Merah', amount: 15, unit: 'siung', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bawang Bombay', amount: 2, unit: 'buah', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daging Ayam', amount: 500, unit: 'gram', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kecap Manis', amount: 1, unit: 'botol', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Wortel', amount: 4, unit: 'buah', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kubis', amount: 1, unit: 'bonggol', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Minyak Goreng', amount: 1, unit: 'liter', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mie Telur Kuning', amount: 2, unit: 'bungkus', userId: userId, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 4. Seed Post (Galeri Masakan)
    const posts = await queryInterface.bulkInsert('Posts', [
      {
        recipeName: 'Nasi Goreng Sisa Semalam',
        description: 'Menu andalan akhir bulan! Cepat dan enak.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500',
        privacy: 'public',
        likes: 12,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        recipeName: 'Ayam Kecap Bawang Bombay',
        description: 'Masak ayam kecap kesukaan keluarga. Bumbunya meresap sampai ke dalam daging, mantap!',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500',
        privacy: 'public',
        likes: 24,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        recipeName: 'Sayur Sop Bening Bakso',
        description: 'Cuaca lagi mendung begini paling pas makan yang hangat dan berkuah. Kuahnya seger banget!',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500',
        privacy: 'friends',
        likes: 8,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        recipeName: 'Telur Dadar Khas Padang',
        description: 'Nyobain resep telur dadar tebal ala rumah makan Padang dari AI SnapChef. Ternyata berhasil dong, tebal dan gurih!',
        image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500',
        privacy: 'public',
        likes: 35,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        recipeName: 'Mie Goreng Spesial',
        description: 'Bikin mie goreng sendiri pakai topping seadanya di kulkas. Kenyang dan praktis buat makan malam.',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
        privacy: 'private',
        likes: 0, // Sengaja 0 karena private
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // 5. Seed Comment
    await queryInterface.bulkInsert('Comments', [
      {
        text: 'Wah, kelihatannya enak banget! Nanti mau coba bikin juga ah.',
        postId: 1, // Asumsi ID post pertama adalah 1
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Resep andalan nih, bumbunya bikin ngiler. Izin save resepnya ya!',
        postId: 2, // Komentar untuk Ayam Kecap
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Cocok banget dimakan pas hujan-hujan gini. Seger kelihatannya!',
        postId: 3, // Komentar untuk Sayur Sop
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Tebal banget telurnya! Rahasianya biar nggak hancur pas dibalik apa ya?',
        postId: 4, // Komentar untuk Telur Dadar
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Udah nyobain resep ini semalam, keluarga pada suka semua. Makasih idenya!',
        postId: 2, // Komentar kedua untuk Ayam Kecap biar kelihatan lebih ramai
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk membatalkan seeder (menghapus data)
    await queryInterface.bulkDelete('Comments', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('Ingredients', null, {});
    await queryInterface.bulkDelete('Recipes', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};