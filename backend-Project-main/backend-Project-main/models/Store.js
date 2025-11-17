const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.STRING(200), allowNull: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'stores'
  });

  return Store;
};
