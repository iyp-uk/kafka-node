var express = require('express');
var router = express.Router();

var Kafka = require('node-rdkafka');

var KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'localhost:9092';
var KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'test';
var producer = new Kafka.Producer({
  'metadata.broker.list': KAFKA_BROKERS
});
producer.connect();

producer.on('ready', function() {
  router.post('/', function (req, res, next) {
    try {
      producer.produce(
        KAFKA_TOPIC,
        null,
        new Buffer(req.body)
      );
    } catch (err) {
      console.error('A problem occurred when sending our message');
      console.error(err);
    }
    // Empty response body.
    res.json(null);
  })
});

producer.on('event.error', function(err) {
  console.error('Error from producer');
  console.error(err);
})

module.exports = router;
