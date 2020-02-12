var express = require('express');
var router = express.Router();

router.use('/emotions', require('./emotions'))

module.exports = router;
