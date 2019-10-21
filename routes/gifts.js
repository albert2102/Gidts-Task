const express = require('express');
const { body } = require('express-validator');

const giftsController = require('../controllers/gifts');
const isUserAuth = require('../middleware/is-userAuth');
const isAdminAuth = require('../middleware/is-adminAuth');

const router = express.Router();

//User GET /Gifts
router.get('/getGifts', isUserAuth, giftsController.getGifts);

//Admin POST/Gift
router.post(
    '/createGift',isAdminAuth,

    [
      body('title')
        .trim()
        .isLength({ min: 5 }),
      body('description')
        .trim()
        .isLength({ min: 10 })
    ],
    giftsController.createGifts
  );
  
  //Admin GET/Gift
  router.get('/gift/:giftId',isAdminAuth, giftsController.getGift);

  router.put(
    '/gift/:giftId',
    isAdminAuth,
    [
      body('title')
        .trim()
        .isLength({ min: 5 }),
      body('description')
        .trim()
        .isLength({ min: 10 })
    ],
    giftsController.updateGift
  );
  
  router.delete('/gift/:giftId',isAdminAuth, giftsController.deleteGift);
  module.exports = router;
