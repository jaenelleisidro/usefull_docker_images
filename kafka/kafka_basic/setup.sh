docker exec -it kafka1 kafka-topics \
    --create \
    --topic test-topic \
    --bootstrap-server kafka1:9092 \
    --replication-factor 3 \
    --partitions 3