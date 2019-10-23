const express = require('express');
const {body} =require('express-validator');

const ordersController = require('../controllers/orders')
const isUserAuth = require('../middleware/is-userAuth');
const isDeriverAuth = require('../middleware/is-driverAuth');

const router =express.Router();

//User create/Order
router.post('/createOrder',
isUserAuth,
[
    body('gifts').trim().not().isEmpty(),
    body('location').trim().not().isEmpty(),
    body('destinationAddress').trim().not().isEmpty(),
    body('date').trim().not().isEmpty()
    .matches('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]')

],ordersController.createOrder);

//User Get/Orders
router.get('/getOrders/',isUserAuth, ordersController.getOrders);

//User Update/Orders
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
//Dieriver Deliverd/Orders
  router.get(
    '/isOrderDeliverd/:orderId',
    isDeriverAuth,
  ordersController.isOrderDeliverd
  );

//User Delete/Orders
  router.delete('/deleteOrder/:orderId',isUserAuth, ordersController.deleteOrder);

module.exports = router;