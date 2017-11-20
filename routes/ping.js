var express = require('express');
var router = express.Router();

/**
 * Heath check route.
 */
router.get('/', function(req, res, next) {
  res.send({
    message: "pong"
  });
});

module.exports = router;
