// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     logging: false
//   }
// );

// const db = { sequelize, Sequelize };

// db.User = require('../models/User')(sequelize);
// db.Store = require('../models/Store')(sequelize);
// db.Rating = require('../models/Rating')(sequelize);

// // Associations
// db.User.hasMany(db.Store, { foreignKey: 'ownerId', as: 'ownedStores' });
// db.Store.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });

// db.User.hasMany(db.Rating, { foreignKey: 'userId' });
// db.Rating.belongsTo(db.User, { foreignKey: 'userId' });

// db.Store.hasMany(db.Rating, { foreignKey: 'storeId' });
// db.Rating.belongsTo(db.Store, { foreignKey: 'storeId' });

// module.exports = db;
// module.exports.sequelize = sequelize;





// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: ":memory:", // in-memory DB
//   logging: false
// });

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:", // in-memory DB
  logging: false
});

// Load models
const User = require("../models/User")(sequelize);
const Store = require("../models/Store")(sequelize);
const Rating = require("../models/Rating")(sequelize);

// REGISTER MODELS INSIDE SEQUELIZE
sequelize.models.User = User;
sequelize.models.Store = Store;
sequelize.models.Rating = Rating;

// Associations
User.hasMany(Store, { foreignKey: "ownerId", as: "ownedStores" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

module.exports = { sequelize, User, Store, Rating };