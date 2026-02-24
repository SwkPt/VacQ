const express = require('express');
const {getAppointments, getAppointment , addAppointment,updateAppointment,deleteAppointment} = require('../controllers/appointments');


//Include other resource routers
// const appointmentRouter=require('./appointment');


const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
// router.use('/:hospitalId/appointments/',appointmentRouter);

router.route('/')
    .get(protect, getAppointments)
    .post(protect,authorize('admin','user'), addAppointment);
router.route('/:id')
    .get(protect, getAppointment)
    .put(protect,authorize('admin','user'),updateAppointment)
    .delete(protect,authorize('admin','user'),deleteAppointment);
module.exports=router;//deleteAppointment