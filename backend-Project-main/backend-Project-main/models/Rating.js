const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.STRING(500), allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    storeId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'ratings',
    indexes: [
      { unique: true, fields: ['userId', 'storeId'] } // one rating per user per store, optional - remove if multiple allowed
    ]
  });

  return Rating;
};
