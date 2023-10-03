import {App} from "@app/core";
import {MongoClient, MongoClientOptions} from "mongodb";
import {HttpServer} from "./http";

(async () => {
	console.log(`node version: ${process.version}`)
	const {
		DB_HOST,
		DB_PORT,
		DB_USER,
		DB_PASSWORD,
		DB_NAME,
	} = process.env;
	const mongoUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
	const mongoOptions: MongoClientOptions = {ignoreUndefined: true}
	const client = await MongoClient.connect(mongoUrl, mongoOptions);
	const db = client.db(DB_NAME)
	const app = new App(db);
	await app.start();

	const server = new HttpServer(app);
	server.setup();
	server.listen();
})()
