const express = require('express');
const {body} =require('express-validator');

const ordersController = require('../controllers/orders')
const isUserAuth = require('../middleware/is-userAuth');
const isDeriverAuth = require('../middleware/is-userAuth');

const router =express.Router();

router.post('/createOrder',
isUserAuth,
[
    body('gifts').trim().not().isEmpty(),
    body('location').trim().not().isEmpty(),
    body('destinationAddress').trim().not().isEmpty(),
    body('date').trim().not().isEmpty()
    .matches('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]')

],ordersController.createOrder);

router.get('/getOrders/',isUserAuth, ordersController.getOrders);

 router.put(
    '/updateOrder/:orderId',
     isUserAuth,
    [
      body('gifts').trim().not().isEmpty(),
      body('location').trim().not().isEmpty(),
      body('destinationAddress').trim().not().isEmpty(),
      body('date').trim().not().isEmpty()
      .matches('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]')
  
  ],
  ordersController.updateOrder
  );

  router.put(
    '/isOrderDeliverd/:orderId',
    isDeriverAuth,
  ordersController.isOrderDeliverd
  );
  
  router.delete('/deleteOrder/:orderId',isUserAuth, ordersController.deleteOrder);

module.exports = router;