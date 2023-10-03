source ./conf-test.env

mkdir -p ./db-test
podman stop awary_mongodb_test
podman rm awary_mongodb_test
podman run -dt -p 27018:27017 \
	--name awary_mongodb_test \
	--userns keep-id \
	-e MONGO_INITDB_ROOT_USERNAME=${DB_USER} \
	-e MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD} \
	-v ./db-test:/data/db \
	docker.io/library/mongo:5.0
