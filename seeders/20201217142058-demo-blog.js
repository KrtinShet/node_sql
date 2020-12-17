'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Blogs', [
      {
        title: 'My first Blog',
        description: "description for my first blog"
      },
      {
        title: 'My Second Blog',
        description: "description for my Second blog"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Blogs', null, {});

  }
};
