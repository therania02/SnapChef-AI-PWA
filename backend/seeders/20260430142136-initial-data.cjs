'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Seed User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await queryInterface.bulkInsert('Users', [
      {
        name: 'Dosen Penilai',
        email: 'dosen@mikroskil.ac.id',
        password: hashedPassword,
        role: 'user',
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
      }
    ], { returning: true });

    // 3. Seed Ingredient (Stok Bahan)
    await queryInterface.bulkInsert('Ingredients', [
      { name: 'Telur Ayam', amount: 5, unit: 'butir', userId: userId, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tomat', amount: 3, unit: 'buah', userId: userId, createdAt: new Date(), updatedAt: new Date() }
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