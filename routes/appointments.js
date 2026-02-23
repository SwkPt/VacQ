const express = require('express');
const {getAppointments} = require('../controllers/appointments');


//Include other resource routers
// const appointmentRouter=require('./appointment');


const router = express.Router({mergeParams:true});

const {protect} = require('../middleware/auth');

//Re-route into other resource routers
// router.use('/:hospitalId/appointments/',appointmentRouter);

router.route('/').get(protect, getAppointments);

module.exports=router;