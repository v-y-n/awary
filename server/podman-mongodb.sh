source ./conf.env

mkdir -p ./db
mkdir -p ./backup
podman stop awary_mongodb
podman rm awary_mongodb
podman run -dt -p 27017:27017 \
	--name awary_mongodb \
	--userns keep-id \
	-e MONGO_INITDB_ROOT_USERNAME=${DB_USER} \
	-e MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD} \
	-v ./db:/data/db \
	docker.io/library/mongo:5.0
