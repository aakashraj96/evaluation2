'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    author: DataTypes.STRING,
    name: DataTypes.STRING,
    rating: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return books;
};