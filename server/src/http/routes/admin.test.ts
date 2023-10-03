import {ADMIN_TOKEN, getAdminSucessTagId} from "@app/utils";
import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase, setupNewUsers, TestUser} from "testUtils/apiTestHelper";

describe("Admin", function () {

	let server: HttpServer;
	let users: TestUser[];
	let project1Id: string

	beforeEach(async function () {
		await deleteDatabase();
		server = await buildTestServer();
		users = await setupNewUsers(server.server);
		users[2].SetAuthorization(ADMIN_TOKEN);
	});

	it ("Return error 401 if not using the ADMIN_TOKEN", async function() {
		const resGet = await users[1].Get(`/admin/server-stats`);

		expect(resGet.statusCode).to.equals(401);
	});

	it ("Return 0 projects, 3 users, 0 logs, 0 metrics on initial state", async function() {
		const resGet = await users[2].Get(`/admin/server-stats`);

		expect(resGet.statusCode).to.equals(200);
		expect(resGet.body).to.deep.equals({
			userCount: 3,
			projectCount: 0,
			logCount: 0,
			metricCount: 0,
			metricHistoryEntryCount: 0
		})
	});

	describe("Server stats", function() {

		beforeEach(async function () {
			// Create basic projects
			const resAddProject1 = await users[0].Post("/projects", {name: "p1"});
			await users[0].Post("/projects", {name: "p2"}); // Yep, don't need all projects
			await users[1].Post("/projects", {name: "p3"});
			project1Id = resAddProject1.body.id;
		});

		it ("Return 3 projects, 3 users, 3 logs, 0 metrics", async function() {
			const resGet = await users[2].Get(`/admin/server-stats`);

			expect(resGet.statusCode).to.equals(200);
			expect(resGet.body).to.deep.equals({
				userCount: 3,
				projectCount: 3,
				logCount: 3,
				metricCount: 0,
				metricHistoryEntryCount: 0
			})
		});

		it ("Return 3 projects, 3 users, 4 logs, 1 metrics", async function() {
			await users[0].Post(`/projects/${project1Id}/metrics`, {
				name: "metric 1"
			})

			const resGet = await users[2].Get(`/admin/server-stats`);
			expect(resGet.statusCode).to.deep.equals(200);
			expect(resGet.body).to.deep.equals({
				userCount: 3,
				projectCount: 3,
				logCount: 4,
				metricCount: 1,
				metricHistoryEntryCount: 0
			})
		});

		it ("Return 3 projects, 3 users, 5 logs, 2 metrics, 3 metric history entries", async function() {
			await users[0].Post(`/projects/${project1Id}/metrics`, {
				name: "metric 1"
			})

			const resAddMetric = await users[0].Post(`/projects/${project1Id}/metrics`, {
				name: "metric 2"
			})

			const metricId = resAddMetric.body.id;

			await users[0].Post(`/projects/${project1Id}/metrics/${metricId}`, {value: 1});
			await users[0].Post(`/projects/${project1Id}/metrics/${metricId}`, {value: 2});
			await users[0].Post(`/projects/${project1Id}/metrics/${metricId}`, {value: 3});

			const resGet = await users[2].Get(`/admin/server-stats`);
			expect(resGet.statusCode).to.deep.equals(200);
			expect(resGet.body).to.deep.equals({
				userCount: 3,
				projectCount: 3,
				logCount: 5,
				metricCount: 2,
				metricHistoryEntryCount: 3
			})
		});
	})

	describe("Internal log to admin project", function() {

		beforeEach(async function () {
			const resAddProject1 = await users[0].Post("/projects", {name: "p1"});
			project1Id = resAddProject1.body.id;
			const resAddTag = await users[0].Post(`/projects/${project1Id}/tags`, {
				name: "Success",
				color: "#00ff00"
			});
			process.env.ADMIN_PROJECT_ID = project1Id
			process.env.ADMIN_SUCCESS_TAG_ID = resAddTag.body.id
		});

		it("Add log when an user is created", async function() {
			const resGetLogs1 = await users[0].Get(`/projects/${project1Id}/logs`);
			expect(resGetLogs1.statusCode).to.equals(200);
			expect(resGetLogs1.body).to.have.length(1);

			const userEmail = "user.email@something.happy"
			const resAddUser = await server.inject({
				method: "POST",
				url: "/signup",
				payload: {
					email: userEmail,
					password: "SomePassword",
				}
			});
			expect(resAddUser.statusCode).to.equals(201);

			const resGetLogs2 = await users[0].Get(`/projects/${project1Id}/logs`);
			expect(resGetLogs2.statusCode).to.equals(200);
			expect(resGetLogs2.body).to.have.length(2);
			expect(resGetLogs2.body[0].title).to.equals(`New user: ${userEmail}`);
			expect(resGetLogs2.body[0].tags).to.have.length(1);
			expect(resGetLogs2.body[0].tags[0].id).to.equals(getAdminSucessTagId());
		});
		
		afterEach(function () {
			delete process.env.ADMIN_PROJECT_ID
			delete process.env.ADMIN_SUCCESS_TAG_ID
		})
	})
});
