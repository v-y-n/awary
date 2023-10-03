import {expect} from "chai";
import {App} from "@app/core";
import {LightMyRequestResponse} from "fastify";
import {FastifyTypebox, HttpServer} from "../http";
import {MongoClient} from "mongodb";

const {
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
} = process.env;

const mongoUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}?authSource=admin`;
const mongoDbName = DB_NAME as string;

export async function deleteDatabase(): Promise<boolean> {
	const client = await MongoClient.connect(mongoUrl);
	return client.db(mongoDbName).dropDatabase();
}

const usersCredientials = [
	{
		email: "user1@test.com",
		password: "user1_password"
	},
	{
		email: "user2@test.com",
		password: "user2_password"
	},
	{
		email: "user3@test.com",
		password: "user3_password"
	}
];

export async function buildTestServer(): Promise<HttpServer> {
	
	await deleteDatabase();

	const client = await MongoClient.connect(mongoUrl);
	const db = client.db(DB_NAME)
	const app = new App(db);
	await app.start();

	const server = new HttpServer(app);
	server.setup();
	
	return server;
}

export interface ResponseHelper {
	response: LightMyRequestResponse,
	/* eslint-disable-next-line */
	body: any,
	statusCode: number
}

export class TestApiKey {
	private _server: FastifyTypebox;
	private _authorization = "";

	public get authorization() {return this._authorization;}

	constructor(server: FastifyTypebox, apiKey: string) {
		this._server = server;
		this._authorization = apiKey;
	}

	async Get(url: string): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "GET",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			}
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}

	async Post(url: string, payload: Record<string, unknown>): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "POST",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			},
			payload
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}

	async Put(url: string, payload: Record<string, unknown>): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "PUT",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			},
			payload
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}

	async Delete(url: string): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "DELETE",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			}
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}
}

export class TestUser {
	private _server: FastifyTypebox;
	private _email = "";
	private _password = "";
	private _authorization = "";

	public get authorization() {return this._authorization;}

	constructor(server: FastifyTypebox,) {
		this._server = server;
	}

	async Login(email: string, password: string): Promise<boolean> {
		this._email = email;
		this._password = password;

		/*const user = await this._app.userService.getUser({email});*/

		let	response = await this._server.inject({
			method: "POST",
			url: "/signup",
			payload: {
				email: email,
				password: password,
			}
		});

		/*response = await this._server.inject({*/
		/*method: "GET",*/
		/*url: `/signup-email-confirmation?email=${email}&emailConfirmationToken=${user?.getData().emailConfirmationToken}`,*/
		/*});*/

		response = await this._server.inject({
			method: "POST",
			url: "/login",
			payload: {
				email: email,
				password: password,
			}
		});

		const body = JSON.parse(response.body);
		this._authorization = body.token;

		return true;
	}

	async Logout() {
		this._authorization = ""
	}

	async SetAuthorization(authorization: string) {
		this._authorization = authorization;
	}

	async Get(url: string): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "GET",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			}
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}

	async Post(url: string, payload: Record<string, unknown>): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "POST",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			},
			payload
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}

	async Put(url: string, payload: Record<string, unknown>): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "PUT",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			},
			payload
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}

	async Delete(url: string): Promise<ResponseHelper> {
		const response = await this._server.inject({
			method: "DELETE",
			url,
			headers: {
				["Authorization"]: `Bearer ${this._authorization}`,
			}
		});
		return {response, body: response.json(), statusCode: response.statusCode};
	}
}

export async function setupNewUsers(server: FastifyTypebox): Promise<TestUser[]> {
	const usersWithAuthorization = await Promise.all(usersCredientials.map(async (userCredientials) =>{
		const user = new TestUser(server);
		await user.Login(userCredientials.email, userCredientials.password);
		return user;
	}));	
	return usersWithAuthorization;
}

export async function TestRequiredBody(method: string, url: string, user: TestUser, originalPayload: Record<string, unknown>) {
	const payloadKeys = Object.keys(originalPayload);

	for (const key of payloadKeys) {

		const payload = JSON.parse(JSON.stringify(originalPayload));
		delete payload[key];
		if (method === "POST") {
			const {response} = await user.Post(url, payload); 
			expect(response.statusCode).to.equals(400, `Key '${key}' in '${method} ${url}' is required but the server did not return a bad request error`);
		}
	}
}
