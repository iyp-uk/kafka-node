# Kafka node

Kafka node client. 
Just passes data being posted into Kafka.

Healthcheck available at `/ping` endpoint.

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

| Name | Type | Description | Default value |
|------|------|-------------|---------------|
|`KAFKA_BROKERS`| String | Comma separated list of kafka brokers | `localhost:9092` |
|`KAFKA_TOPIC`| String | Kafka topic to produce to | `test` |
|`POLL_INTERVAL`| Integer | Polling interval in ms to ensure messages have been delivered | `1000` |
|`CLIENT_ID`| String | Producer client identification | `1000` |

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

## Send messages through this node producer

Just need to post to the `/` endpoint, example:

```console
$ while 1; do d=$(date); curl -is -X POST -H content-type:application/json -d '{"foo": "'${d}'"}' http://localhost:3000/ ; sleep 1;  done
```

In the console consumer, you will then see messages like:

```console
...
{"foo":"Tue Apr 24 10:54:58 BST 2018"}
{"foo":"Tue Apr 24 10:54:59 BST 2018"}
{"foo":"Tue Apr 24 10:55:00 BST 2018"}
{"foo":"Tue Apr 24 10:55:01 BST 2018"}
{"foo":"Tue Apr 24 10:55:02 BST 2018"}
{"foo":"Tue Apr 24 10:55:03 BST 2018"}
{"foo":"Tue Apr 24 10:55:04 BST 2018"}
{"foo":"Tue Apr 24 10:55:06 BST 2018"}
...
```


## Docker swarm

There's a script in the machines running the swarm:

```console
$ docker service create --name kafka-node \
  --network services-1 \
  --replicas 5 \
  --update-delay 20s \
  --publish 3000:3000 \
  --env KAFKA_BROKERS=localhost:9092 \
  miaoulafrite/kafka-node
```
