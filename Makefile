.PHONY: db server-dev server server-setup web-app-dev web-app-build web-app-setup web-app test docs

UIDS:= USER_ID=$(shell id -u) GROUP_ID=$(shell id -g)
ENV_VARS:= set -a && . ./conf.env && ${UIDS} && set +a

# Database

db:
	cd server && mkdir -p db && bash podman-mongodb.sh

db-test:
	cd server && bash podman-mongodb-test.sh

# Server

server-setup:
	cd server && npm install

server-dev:
	cd server && npm run dev

server:
	cd server && npm run start:prod

test: db-test
	cd server && npm run test

# Web app

web-app-setup:
	cd web-app && npm install

web-app-dev:
	cd web-app && npm start

web-app-build:
	cd web-app && npm run build

web-app:
	cd web-app && npm run build && npx serve -s build

# User documentation

docs:
	cd docs && python -m mkdocs build
