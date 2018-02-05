
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    author: DataTypes.STRING,
    bookid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
    like: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return books;
};
