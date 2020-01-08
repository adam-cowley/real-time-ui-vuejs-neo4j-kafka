const kafka = require('kafka-node')

const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_SERVER });

const consumer = new kafka.Consumer(
    client,
    [ { topic: process.env.KAFKA_TOPIC, partition: 0 } ],
    {
        groupId: process.env.KAFKA_GROUP,
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: false
    }
);

module.exports = consumer;