import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase, setupNewUsers, TestApiKey, TestUser} from "testUtils/apiTestHelper";

describe("Logs", function () {

	let server: HttpServer;
	let users: TestUser[];
	let project1: Record<string, unknown>
	let project1ApiKey1: TestApiKey

	let project2: Record<string, unknown>
	let project2ApiKey1: TestApiKey

	beforeEach(async function () {
		// Setup the server and app
		await deleteDatabase();
		server = await buildTestServer();
		// Create basic users
		users = await setupNewUsers(server.server);
		// Create basic projects
		await users[0].Post("/projects", {name: "p1"});
		await users[0].Post("/projects", {name: "p2"});
		await users[1].Post("/projects", {name: "p3"});

		let response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);

		project1 = response.body[0];
		project2 = response.body[1];

		// Add 2 Api keys for project 1 and 1 Api ket for project 2
		response = await users[0].Post(`/projects/${project1.id}/apiKeys`, {name: "key1"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		response = await users[0].Post(`/projects/${project1.id}/apiKeys`, {name: "key2"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		response = await users[0].Post(`/projects/${project2.id}/apiKeys`, {name: "key3"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		response = await users[0].Get(`/projects/${project1.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);
		expect(response.body[0].name).to.equals("key1")
		expect(response.body[0].projectId).to.equals(project1.id)
		expect(response.body[0].key).to.not.be.undefined
		expect(response.body[1].name).to.equals("key2")
		expect(response.body[1].projectId).to.equals(project1.id)
		expect(response.body[1].key).to.not.be.undefined

		project1ApiKey1 = new TestApiKey(server.server, response.body[0].key)
		new TestApiKey(server.server, response.body[1].key)

		response = await users[0].Get(`/projects/${project2.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
		expect(response.body[0].name).to.equals("key3")
		expect(response.body[0].projectId).to.equals(project2.id)
		expect(response.body[0].key).to.not.be.undefined

		project2ApiKey1 = new TestApiKey(server.server, response.body[0].key)
	});

	it ("[User 1] Get logs with just the welcome log", async function() {
		const response = await users[0].Get(`/projects/${project1.id}/logs`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
	});

	it ("[K1-1 > P1] Get logs with just the welcome log", async function() {
		const response = await project1ApiKey1.Get(`/projects/${project1.id}/logs`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
	});

	it ("[K1-1 > P1] Add log to p1", async function() {
		const resAddLog = await project1ApiKey1.Post(`/projects/${project1.id}/logs`, {
			title: "title1",
			content: "content1",
			tags: []
		});
		expect(resAddLog.statusCode).to.equals(201);

		const resGetLogs = await users[0].Get(`/projects/${project1.id}/logs`);
		expect(resGetLogs.statusCode).to.equals(200);
		expect(resGetLogs.body).to.be.a("array");
		expect(resGetLogs.body).to.have.length(2);
	});

	it ("[K1-1 > P1] Get logs with 2 entries", async function() {
		await project1ApiKey1.Post(`/projects/${project1.id}/logs`, {
			title: "title1",
			content: "content1",
			tags: []
		});

		const resGetLogs = await project1ApiKey1.Get(`/projects/${project1.id}/logs`);
		expect(resGetLogs.statusCode).to.equals(200);
		expect(resGetLogs.body).to.be.a("array");
		expect(resGetLogs.body).to.have.length(2);
	});

	it ("[K2-1 > P1] Return error (401)", async function() {
		const response = await project2ApiKey1.Get(`/projects/${project1.id}/logs`);

		expect(response.statusCode).to.equals(401);
	});

	it ("[K2-1 > P2] Get logs with just the welcome log", async function() {
		const response = await project2ApiKey1.Get(`/projects/${project2.id}/logs`);

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
	});
});
