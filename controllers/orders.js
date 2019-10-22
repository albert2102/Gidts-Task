const { validationResult } =require('express-validator');

const drivers = require('../models/drivers');
const orders = require('../models/orders');
const user = require('../models/users');

let index;

exports.createOrder = (req,res,next)=>{
    const errors = validationResult(req) ;
        if(!errors.isEmpty()){
             const error =new Error('Validation Failed!');
             error.statusCode = 422;
             error.data =errors.array();
             throw error; 
        }
        if (  typeof req.body.gifts !== 'string' && typeof req.body.location !== 'string' && typeof req.body.destinationAddress !== 'string' &&typeof date !== 'string'  ) {
          const error = new Error('It must be string.');
          error.statusCode = 401;
          throw error;
        }
    const gifts =  req.body.gifts.split(',');
    const location = req.body.location.split(',');
    const destinationAddress = req.body.destinationAddress.split(',');
    const date = formatDate(req.body.date);
    let userID=req.userId ;
    let order;  
    let driverInfo; 
    let choosenDriver;
    let orderedUser ;
    let orderDate = date.split('-');
    let driversdates = new Array();
      drivers.find({})
      .sort({deliveryDates: -1})
      .then(driver => {
        let counter = 0;
        let driverDates ;
        for(let i=0;i<driver.length;i++)
        {
          driversdates[i] = driver[i].deliveryDates.length;
        }
        const availableDriver = Math.min(...driversdates);
        index = driversdates.indexOf(availableDriver);
        for(let i=0;i<driver.length;i++)
          {
            if(driver[i].deliveryDates.length !==0){
              for(let y=0;y<driver[i].deliveryDates.length;y++){
                driverDates = driver[i].deliveryDates[y].split('-');
                if(orderDate[0] === driverDates[0] && orderDate[1] === driverDates [1] && orderDate[2] === driverDates [2]){
                   counter++;
                }
                if(orderDate[3] !== driverDates[3]){
                    if (counter < 8 ){
                        driverInfo = driver[index]._id;
                        choosenDriver = driver[index];
                        break;
                  }
                }  
            }
            } 
            else if(driver[i].deliveryDates.length === 0){
              driverInfo = driver[i]._id;
              choosenDriver = driver[i];
              break;
            }
        }
        if (!choosenDriver) {
            const error = new Error('No driver available at this time.');
            error.statusCode = 406;
            throw error;
          }
          return user.find({ _id :userID});
      }).then(user =>{
        if (!user) {
            const error = new Error('ID is not exsist.');
            error.statusCode = 406;
            throw error;
          }
        order = new orders({
            gifts: gifts,
            location: location,
            date: date,
            destinationAddress: {
              street:destinationAddress[1],
              block:destinationAddress[0],
              floor:destinationAddress[2]
            },
            driverInfo:driverInfo,
            userInfo:userID
          });
         orderedUser= user[0];
          return order.save();
      })
      .then(result => {
        choosenDriver.deliveryDates.push(date);
        choosenDriver.ordersToDeliver.push(result);
        return choosenDriver.save();
    }) 
    .then(result =>{
       orderedUser.giftOrders.push(order);
        return orderedUser.save();
    })
    .then(result =>{
        res.status(201).json({
        status:200,
        message: 'order created successfully!',
        order: order 
    });
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

exports.getOrders = (req, res, next) => {
  const orderedUserId = req.userId;
  user.findById(orderedUserId)
    .then(user => {
      if (!user) {
        const error = new Error('You donot have this permission');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status:200,message: 'Orders fetched.', userOrders: user.giftOrders });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

if (typeof req.body.gifts !== 'string' &&typeof req.body.location !== 'string'&& typeof req.body.destinationAddress !== 'string'   ) {
  const error = new Error('It must be string.');
  error.statusCode = 401;
  throw error;
}
  const gifts =  req.body.gifts.split(',');
  const location = req.body.location.split(',');
  const destinationAddress = req.body.destinationAddress.split(',');
  const date = formatDate( req.body.date);
  orders.findById(orderId)
    .then(order => {
      if (!order) {
        const error = new Error('Could not find Order.');
        error.statusCode = 404;
        throw error;
      }
      order.gifts = gifts;
      order.location = location;
      order.date = date; 
      order.destinationAddress.street = destinationAddress[1];
      order.destinationAddress.block = destinationAddress[0];
      order.destinationAddress.floor = destinationAddress[2];
    
      return order.save();
    })
    .then(result => {
      res.status(200).json({ status:200, message: 'Order updated!', order: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.isOrderDeliverd = (req, res, next) => {
  const orderId = req.params.orderId;
if (typeof req.body.isdeliveried !== "string" ) {
  const error = new Error('It must be string.');
  error.statusCode = 407;
  throw error;
}
 const isdeliveried = true;
  orders.findById(orderId)
    .then(order => {
      if (!order) {
        const error = new Error('Could not find Order.');
        error.statusCode = 404;
        throw error;
      }
      order.isdeliveried = isdeliveried
      return order.save();
    })
    .then(result => {
      res.status(200).json({ status:200, message: 'Order deliverd!', order: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  let driverId;
  let orderDate;
    orders.findById(orderId)
    .then(order => {
      if (!order) {
        const error = new Error('Could not find order.');
        error.statusCode = 404;
        throw error;
      }
      driverId=order.driverInfo;
      orderDate = order.date;
     return drivers.findByIdAndRemove(orderId);
    })
    .then(result => {
      return user.find({ _id :req.userId}); 
    })
    .then(user =>{
      user =  user[0];
      user.giftOrders.pull(orderId);
      return user.save();
    })
    .then(result =>{
      return drivers.find({ _id :driverId});
    })
    .then(driver =>{
      driver = driver[0];
      driver.ordersToDeliver.pull(orderId);
      driver.deliveryDates.pull(orderDate);
      return driver.save();
    })
    .then(result =>{
      res.status(200).json({ status:200, message: 'Deleted order.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
  
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes(),
        year = d.getFullYear();
      
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
     if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
        var result =year+'-'+ month+'-'+ day+'-'+hours+'-'+minutes;
    return result ;
}

