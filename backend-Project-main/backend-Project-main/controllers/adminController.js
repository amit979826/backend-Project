const { User, Store, Rating, sequelize } = require('../config/db');
const { Op } = require('sequelize');

exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const q = req.query.q || '';
    const where = q ? { [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { email: { [Op.like]: `%${q}%` } }] } : {};
    const users = await User.findAll({ where, attributes: ['id','name','email','address','role'] });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id','name','email','address','role'] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const user = await User.create({ name, email, address, password, role: role || 'Normal' });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, address, role } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.role = role || user.role;
    await user.save();
    res.json({ message: 'User updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    // include avg rating for each store
    const result = await Promise.all(stores.map(async s => {
      const ratings = await Rating.findAll({ where: { storeId: s.id } });
      const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.value,0)/ratings.length).toFixed(2) : null;
      return { id: s.id, name: s.name, address: s.address, ownerId: s.ownerId, averageRating: avg };
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
