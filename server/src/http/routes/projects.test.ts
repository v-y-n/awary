import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase, setupNewUsers, TestUser} from "testUtils/apiTestHelper";

describe("Projects", function () {

	let server: HttpServer;
	let users: TestUser[];

	beforeEach(async function () {
		await deleteDatabase();
		server = await buildTestServer();
		users = await setupNewUsers(server.server);
	});

	it ("Return empty project list", async function() {
		const responseUser1 = await users[0].Get("/projects");
		expect(responseUser1.statusCode).to.equals(200);
		expect(responseUser1.body).to.be.a("array");
		expect(responseUser1.body).to.have.length(0)

		const responseUser2 = await users[1].Get("/projects");
		expect(responseUser2.statusCode).to.equals(200);
		expect(responseUser2.body).to.be.a("array");
		expect(responseUser2.body).to.have.length(0)
	});

	it ("Add 1 project", async function() {
		const addRes = await users[0].Post("/projects", {name: "p1"});
		expect(addRes.statusCode).to.equals(201);

		const getRes = await users[0].Get("/projects");
		expect(getRes.statusCode).to.equals(200);
		expect(getRes.body).to.be.a("array");
		expect(getRes.body).to.have.length(1)
	});

	it ("Add 2 projects", async function() {
		const addRes1 = await users[0].Post("/projects", {name: "p1"});
		const addRes2 = await users[0].Post("/projects", {name: "p2"});
		expect(addRes1.statusCode).to.equals(201);
		expect(addRes2.statusCode).to.equals(201);
		
		const getUser1Res = await users[0].Get("/projects");
		expect(getUser1Res.statusCode).to.equals(200);
		expect(getUser1Res.body).to.be.a("array");
		expect(getUser1Res.body).to.have.length(2)

		// I just want to be sure the 2nd user cannot get them
		const getUser2Res = await users[1].Get("/projects");
		expect(getUser2Res.statusCode).to.equals(200);
		expect(getUser2Res.body).to.be.a("array");
		expect(getUser2Res.body).to.have.length(0)
	});

	it ("Check projects properties", async function() {
		await users[0].Post("/projects", {name: "p1"});
		await users[0].Post("/projects", {name: "p2"});

		const getRes = await users[0].Get("/projects");
		expect(getRes.statusCode).to.equals(200);
		expect(getRes.body).to.be.a("array");
		expect(getRes.body).to.have.length(2)
		expect(getRes.body[0].name).to.equals("p1")
		expect(getRes.body[1].name).to.equals("p2")
	});

	it ("Fail to add project (no valid authorization token)", async function() {
		await users[0].Logout();
		const addRes = await users[0].Post("/projects", {name: "p1"});
		expect(addRes.statusCode).to.equals(401);
	});

	it ("Fail to get projects (no valid authorization token)", async function() {
		await users[0].Logout();
		const getRes = await users[0].Get("/projects");
		expect(getRes.statusCode).to.equals(401);
	});

	it ("Projects have no Api key when created", async function() {
		const addRes1 = await users[0].Post("/projects", {name: "p1"});
		const addRes2 = await users[0].Post("/projects", {name: "p2"});

		const project1Id = addRes1.body.id;
		const project2Id = addRes2.body.id;

		let response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);

		response = await users[0].Get(`/projects/${project1Id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0);

		response = await users[0].Get(`/projects/${project2Id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0);
	});

	it ("Add Api key to project", async function() {
		const addRes1 = await users[0].Post("/projects", {name: "p1"});
		const project1Id = addRes1.body.id;

		const response = await users[0].Post(`/projects/${project1Id}/apiKeys`, {name: "key1"});
		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");

		const resGetKeys = await users[0].Get(`/projects/${project1Id}/apiKeys`);
		expect(resGetKeys.statusCode).to.equals(200);
		expect(resGetKeys.body).to.be.a("array");
		expect(resGetKeys.body).to.have.length(1);
		expect(resGetKeys.body[0].name).to.equals("key1");
	});
});
