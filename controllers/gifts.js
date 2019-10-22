const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const gifts = require('../models/gifts');

exports.getGifts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    gifts.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return gifts.find()
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })
      .then(gifts => {
        res
          .status(200)
          .json({
            status:200,
            message: 'Fetched gifts successfully.',
            gifts: gifts,
            totalItems: totalItems
          });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  

  exports.createGifts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const description = req.body.description;
    const gift = new gifts({
      title: title,
      description: description,
      imageUrl: imageUrl
    });
    gift
      .save()
      .then(result => {
        res.status(201).json({
          status:200,
          message: 'Gifts created successfully!',
          gifts: result
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
 
  exports.getGift = (req, res, next) => {
    const giftId = req.params.giftId;
    gifts.findById(giftId)
      .then(gift => {
        if (!gift) {
          const error = new Error('Could not find gift.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ status:200,message: 'gift fetched.', gift: gift });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.updateGift = (req, res, next) => {
    const giftId = req.params.giftId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const description = req.body.description;
    let imageUrl ;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    gifts.findById(giftId)
      .then(gift => {
        if (!gift) {
          const error = new Error('Could not find gift.');
          error.statusCode = 404;
          throw error;
        }
        if (imageUrl !== gift.imageUrl) {
          clearImage(gift.imageUrl);
        }
        gift.title = title;
        gift.imageUrl = imageUrl;
        gift.description = description;
        return gift.save();
      })
      .then(result => {
        res.status(200).json({ status:200, message: 'gift updated!', gift: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  exports.deleteGift = (req, res, next) => {
    const giftId = req.params.giftId;
    gifts.findById(giftId)
      .then(gift => {
        if (!gift) {
          const error = new Error('Could not find gift.');
          error.statusCode = 404;
          throw error;
        }
        clearImage(gift.imageUrl);
        return gifts.findByIdAndRemove(giftId);
      })
      .then(result => {
        console.log(result);
        res.status(200).json({ status:200, message: 'Deleted gift.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  };
  