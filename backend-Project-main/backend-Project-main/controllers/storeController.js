const { Store, Rating, User } = require('../config/db');

exports.createStore = async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;
    // if store owner created, default ownerId to the current user's id if role is StoreOwner
    const owner = ownerId || (req.user.role === 'StoreOwner' ? req.user.id : null);
    const store = await Store.create({ name, address, ownerId: owner });
    res.status(201).json({ message: 'Store created', store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // only owner or admin can update
    if (req.user.role !== 'Admin' && req.user.id !== store.ownerId) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const { name, address } = req.body;
    store.name = name || store.name;
    store.address = address || store.address;
    await store.save();
    res.json({ message: 'Store updated', store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    await store.destroy();
    res.json({ message: 'Store deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.storeRatings = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, { include: [{ model: Rating, include: [{ model: User, attributes: ['id','name','email'] }] }] });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // owner check
    if (req.user.role !== 'Admin' && req.user.id !== store.ownerId) return res.status(403).json({ message: 'Forbidden' });

    const avg = store.Ratings.length ? (store.Ratings.reduce((a,b)=>a+b.value,0)/store.Ratings.length).toFixed(2) : null;
    res.json({ storeId: store.id, name: store.name, averageRating: avg, ratings: store.Ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
