const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(auth);

// list stores (with optional search by name/address)
router.get('/stores', userController.listStores);

// get store details + average rating
router.get('/stores/:id', userController.getStore);

// create or update rating
router.post('/stores/:id/rate', permit('Normal','StoreOwner','Admin'), userController.createOrUpdateRating);

// delete own rating
router.delete('/stores/:id/rating', permit('Normal','StoreOwner','Admin'), userController.deleteRating);

// update password
router.put('/me/password', userController.updatePassword);

module.exports = router;
