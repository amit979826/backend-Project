const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middleware/auth');
const storeController = require('../controllers/storeController');

router.use(auth);

// create store (Admin or StoreOwner can create)
router.post('/', permit('Admin','StoreOwner'), storeController.createStore);

// update store (owner or admin)
router.put('/:id', permit('Admin','StoreOwner'), storeController.updateStore);

// delete store (admin only)
router.delete('/:id', permit('Admin'), storeController.deleteStore);

// store owner dashboard: get ratings for their stores
router.get('/:id/ratings', permit('StoreOwner','Admin'), storeController.storeRatings);

module.exports = router;
