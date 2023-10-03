#!/bin/sh

. ./conf.env

BASE_URL=$1
EMAIL=$2
PASSWORD=`openssl rand -base64 16 | sed -e "s/=//g"`

echo $API_ADMIN_AUTHORIZATION
echo $1
echo $PASSWORD

curl -X POST $BASE_URL/signup \
	-H 'Content-Type: application/json' \
	-d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"adminToken\": \"$API_ADMIN_AUTHORIZATION\"}"
