var express = require('express')
var router = express.Router()

var Kafka = require('node-rdkafka')

var KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'localhost:9092'
var KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'test'
var POLL_INTERVAL = process.env.POLL_INTERVAL || 1000;
var CLIENT_ID = process.env.CLIENT_ID || 'kafka-node';

var producer = new Kafka.Producer({
  'client.id': CLIENT_ID,
  'metadata.broker.list': KAFKA_BROKERS,
  'dr_cb': true
})

//logging debug messages, if debug is enabled
producer.on('event.log', function(log) {
  console.log(log);
});

producer.on('delivery-report', function (err, report) {
  console.log('delivery-report: ' + JSON.stringify(report))
})

producer.on('ready', function (arg) {
  console.log('producer ready: ' + JSON.stringify(arg))
  producer.setPollInterval(POLL_INTERVAL)

  router.post('/', function (req, res, next) {
    if (!req.is('application/json')) {
      var err = new Error('Not acceptable. Please send application/json')
      err.status = 406
      return next(err)
    }

    try {
      producer.produce(
        KAFKA_TOPIC,
        null,
        new Buffer(JSON.stringify(req.body))
      )
    } catch (err) {
      console.error('A problem occurred when sending our message')
      console.error(err)
    }
    // Empty response body.
    res.json()
  })
})

producer.on('event.error', function (err) {
  console.error('Error from producer')
  console.error(err)
})

producer.on('disconnected', function (arg) {
  console.log('producer disconnected: ' + JSON.stringify(arg))
})

producer.connect()

module.exports = router
