'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const minutesAgo = (count) => new Date(now.getTime() - count * 60 * 1000);

    await queryInterface.bulkInsert('Messages', [
      {
        chatId: '1-2',
        senderId: 1,
        senderName: 'Pak Gilbert Fernando Situmorang',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        text: 'Halo Carita, sudah sempat coba resep baru dari SnapChef?',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(45),
        updatedAt: minutesAgo(45)
      },
      {
        chatId: '1-2',
        senderId: 2,
        senderName: 'Carita Angel Samudra Tjoatja',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        text: 'Sudah Pak, hasilnya enak banget.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(42),
        updatedAt: minutesAgo(42)
      },
      {
        chatId: '2-3',
        senderId: 2,
        senderName: 'Carita Angel Samudra Tjoatja',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        text: 'Therania, nanti malam masak bareng yuk?',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(28),
        updatedAt: minutesAgo(28)
      },
      {
        chatId: '2-3',
        senderId: 3,
        senderName: 'Therania',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        text: 'Boleh, jam 7 ya.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(25),
        updatedAt: minutesAgo(25)
      },
      {
        chatId: '2-4',
        senderId: 4,
        senderName: 'Sastrawan',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        text: 'Carita, resep soup kemarin enak sekali.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(22),
        updatedAt: minutesAgo(22)
      },
      {
        chatId: '2-4',
        senderId: 2,
        senderName: 'Carita Angel Samudra Tjoatja',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        text: 'Makasih, nanti aku share versi lainnya ya.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(20),
        updatedAt: minutesAgo(20)
      },
      {
        chatId: '2-5',
        senderId: 5,
        senderName: 'Steven Lienardi',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        text: 'Ada ide topping buat mie goreng? ',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(18),
        updatedAt: minutesAgo(18)
      },
      {
        chatId: '2-5',
        senderId: 2,
        senderName: 'Carita Angel Samudra Tjoatja',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        text: 'Coba tambah telur mata sapi, enak banget.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(16),
        updatedAt: minutesAgo(16)
      },
      {
        chatId: 'group-1',
        senderId: 1,
        senderName: 'Pak Gilbert Fernando Situmorang',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        text: 'Selamat datang di Grup Masak Bareng!',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(14),
        updatedAt: minutesAgo(14)
      },
      {
        chatId: 'group-1',
        senderId: 2,
        senderName: 'Carita Angel Samudra Tjoatja',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        text: 'Halo semua, siap sharing resep!',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(12),
        updatedAt: minutesAgo(12)
      },
      {
        chatId: 'group-1',
        senderId: 3,
        senderName: 'Therania',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        text: 'Aku ikut, aku bawa resep dessert.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(10),
        updatedAt: minutesAgo(10)
      },
      {
        chatId: 'group-1',
        senderId: 4,
        senderName: 'Sastrawan',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        text: 'Mantap, aku bawa menu utama.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(8),
        updatedAt: minutesAgo(8)
      },
      {
        chatId: 'group-1',
        senderId: 5,
        senderName: 'Steven Lienardi',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        text: 'Siap, kita lengkap timnya.',
        image: null,
        reactions: JSON.stringify([]),
        createdAt: minutesAgo(6),
        updatedAt: minutesAgo(6)
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};