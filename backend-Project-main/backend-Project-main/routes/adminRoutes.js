const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(auth);
router.use(permit('Admin'));

// dashboard stats
router.get('/dashboard', adminController.dashboard);

// users CRUD
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// stores list (all)
router.get('/stores', adminController.listStores);

module.exports = router;
