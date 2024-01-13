// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) =>{
    res.status(200).json({ success: true, msg: 'Display all bootcamps', hello: req.hello });
}

// @desc    Get Single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) =>{
    res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` });
}

// @desc    Create Single Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) =>{
    res.status(200).json({ success: true, msg: `Created bootcamp` });
}

// @desc    Update Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) =>{
    res.status(200).json({ success: true, msg: `Updated bootcamp ${req.params.id}` });
}

// @desc    Delete Single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) =>{
    res.status(200).json({ success: true, msg: `Deleted bootcamp ${req.params.id}` });
}
