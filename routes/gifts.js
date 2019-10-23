const express = require('express');
const { body } = require('express-validator');

const giftsController = require('../controllers/gifts');
const isAdminAuth = require('../middleware/is-adminAuth');

const router = express.Router();

//Puplic GET /Gifts 
router.get('/getGifts', giftsController.getGifts);

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
  
  //Admin GET/Gift by id
  router.get('/getGift',isAdminAuth, giftsController.getGift);

//Admin update/Gift
  router.put(
    '/put/:giftId',
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

  //Admin update/Gift
  router.delete('/deleteGift/:giftId',isAdminAuth, giftsController.deleteGift);

  
  module.exports = router;
