const express = require('express');
const {body} =require('express-validator');
const isAuth = require('../middleware/is-driverAuth');

const AdminsController = require('../controllers/admins')


const router =express.Router();

//Admin login
router.post('/login',AdminsController.login);

module.exports = router;