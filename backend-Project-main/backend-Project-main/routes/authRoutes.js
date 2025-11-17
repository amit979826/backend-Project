const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { signup, login } = require('../controllers/authController');

router.post('/signup',
  [
    body('name').isLength({ min: 2, max: 60 }).withMessage('Name 2-60 chars'),
    body('email').isEmail(),
    body('password')
      .isLength({ min: 8, max: 10 })
      .matches(/[A-Z]/).withMessage('Must have uppercase')
      .matches(/[^A-Za-z0-9]/).withMessage('Must have special char')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  signup
);

router.post('/login', login);

module.exports = router;
