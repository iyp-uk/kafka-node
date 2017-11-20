# Kafka node

Kafka node client. 
Just passes data being posted into Kafka.

Healthcheck available at `/test` endpoint.

## Docker

Build
```console
$ docker build -t miaoulafrite/kafka-node .
```

Push to the docker hub
```console
$ docker push miaoulafrite/kafka-node # you may need to docker login first.
```

Run
```console
$ docker run -d --name kafka-node -p 3000:3000 miaoulafrite/kafka-node
```

## Environment variables

* `KAFKA_BROKERS`: Defaults to `localhost:9092`
* `KAFKA_TOPIC`: Defaults to `test`

```console
$ docker run -d --name kafka-node -p 3000:3000 -e KAFKA_BROKERS=192.168.0.6:9092 miaoulafrite/kafka-node
```

## Full stack

> You must have kafka installed here.


Start the server along with zookeeper:
```console
$ cd /path/to/kafka
$ bin/zookeeper-server-start.sh config/zookeeper.properties
$ bin/kafka-server-start.sh config/server.properties
```

Add a `topic` (we will call it `test`):
```console
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
Created topic "test".
```

Send and read some messages with the `kafka-console-producer` and `kafka-console-consumer`, just to see the topic in action:
```console
$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
>blah
>sushi
>more
>
```
In another console:
```console
$ bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
blah
sushi
more
```
