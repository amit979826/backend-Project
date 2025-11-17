const { Store, Rating, User, sequelize } = require('../config/db');
const { Op } = require('sequelize');

exports.listStores = async (req, res) => {
  try {
    const q = req.query.q || '';
    const stores = await Store.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { address: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [{
        model: Rating,
        attributes: ['value']
      }]
    });

    // compute avg rating
    const result = stores.map(s => {
      const values = s.Ratings.map(r => r.value);
      const avg = values.length ? (values.reduce((a,b)=>a+b,0)/values.length).toFixed(2) : null;
      return { id: s.id, name: s.name, address: s.address, ownerId: s.ownerId, averageRating: avg };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [{ model: Rating, include: [{ model: User, attributes:['id','name','email'] }] }]
    });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const avg = store.Ratings.length ? (store.Ratings.reduce((a,b)=>a+b.value,0)/store.Ratings.length).toFixed(2) : null;
    res.json({ store, averageRating: avg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrUpdateRating = async (req, res) => {
  try {
    const storeId = req.params.id;
    const userId = req.user.id;
    const { value, comment } = req.body;
    if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Rating 1-5' });

    // upsert: if rating exists by this user for this store, update else create
    let rating = await Rating.findOne({ where: { userId, storeId } });
    if (rating) {
      rating.value = value;
      rating.comment = comment;
      await rating.save();
      return res.json({ message: 'Rating updated', rating });
    } else {
      rating = await Rating.create({ userId, storeId, value, comment });
      return res.status(201).json({ message: 'Rating created', rating });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const storeId = req.params.id;
    const userId = req.user.id;
    const rating = await Rating.findOne({ where: { userId, storeId } });
    if (!rating) return res.status(404).json({ message: 'No rating found' });
    await rating.destroy();
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Provide old and new password' });

    const user = await User.findByPk(req.user.id);
    const valid = await user.comparePassword(oldPassword);
    if (!valid) return res.status(400).json({ message: 'Old password incorrect' });

    user.password = newPassword; // hook will hash
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
