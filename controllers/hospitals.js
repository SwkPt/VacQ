const Hospital = require('../models/Hospital');

// @desc      Get all hospitals
// @route     GET /api/v1/hospitals

exports.getHospitals = async (req, res, next) => {
    let query;
    

    //copy req query
    const reqQuery = {...req.query};

    //exclude field
    const removeFields = ['select', 'sort','page','limit'];

    //loop over remove field and del them from req query
    removeFields.forEach(params=>delete reqQuery[params] );
    console.log(reqQuery);


    //create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    query = Hospital.find(JSON.parse(queryStr));

    //select query
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields);
    }

    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    const total=await Hospital.countDocuments () ;

    query=query.skip (startIndex).limit(limit);

    try{
        const hospitals = await query;

        const pagination ={};
        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if (startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true, count:hospitals.length,pagination, data:hospitals});
    }catch(err){
        res.status(400).json({success:false});
    }
    //res.status(200).json({ success: true, msg: 'Show all hospitals' });
};

// @desc      Get sigle hospital
// @route     GET /api/v1/hospitals/:id

exports.getHospital = async (req, res, next) => {
    try{
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:hospital});
    }catch(err){
            res.status(400).json({success:false});
        }
    //res.status(200).json({ success: true, msg: `Show hospital ${req.params.id}` });
};

// @desc      Create new hospital
// @route     POST /api/v1/hospitals

exports.createHospital = async (req, res, next) => {
    //console.log(req.body);
    const hospital = await Hospital.create(req.body);
    res.status(201).json({
        success:true,
        data:hospital
    });
    //res.status(200).json({ success: true, msg: 'Create new hospitals' });
};

// @desc      Update hospital
// @route     PUT /api/v1/hospitals/:id

exports.updateHospital = async(req, res, next) => {

    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });

        if(!hospital){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:hospital});
    }catch(err){
            res.status(400).json({success:false});
        }

    //res.status(200).json({ success: true, msg: `Update hospital ${req.params.id}` });
};

// @desc      Delete hospital
// @route     DELETE /api/v1/hospitals/:id

exports.deleteHospital = async(req, res, next) => {
    try{
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if(!hospital){
            res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:{}});
    }catch(err){
            res.status(400).json({success:false});
        }

    //res.status(200).json({ success: true, msg: `Delete hospital ${req.params.id}` });
};