import { ADMIN_TOKEN } from "@app/utils";
import {expect} from "chai";
import {LightMyRequestResponse} from "fastify";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase} from "testUtils/apiTestHelper";

const users = [
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

type TestRequestBody = {
	method: string,
	url: string,
	payload: Record<string, unknown>
}

async function TestRequiredBody(server: HttpServer, OriginalRequest: TestRequestBody) {
	const payloadKeys = Object.keys(OriginalRequest.payload);

	for (const key of payloadKeys) {

		const request = JSON.parse(JSON.stringify(OriginalRequest));
		delete request.payload[key];
		const response = await server.inject(request);
		expect(response.statusCode).to.equals(400);
	}
}

let server: HttpServer;

async function logReq(email: string, password: string): Promise<LightMyRequestResponse> {
	return server.inject({
		method: "POST",
		url: "/login",
		payload: {
			email: email,
			password: password,
		}
	});
}

async function signupReq(email: string, password: string): Promise<LightMyRequestResponse> {
	return server.inject({
		method: "POST",
		url: "/signup",
		payload: {
			email: email,
			password: password,
		}
	});
}

describe("Users", function () {

	beforeEach(async function () {
		await deleteDatabase();
		server = await buildTestServer();
	});

	describe("Signup", function() {
		it ("User registration is enabled", async function() {
			const response = await server.inject({
				method: "GET",
				url: "/isUserRegistrationEnabled",
			});

			expect(response.statusCode).to.equals(200);
			expect(response.json().enabled).to.equals(true)
		});

		it ("Fail get current user (401) because no Bearer token is provided", async function() {
			const response = await server.inject({
				method: "GET",
				url: "/auth",
			});

			expect(response.statusCode).to.equals(401);
		});

		it("Fail to sign up because email has wrong format", async function () {
			const res = await signupReq("wrong", users[1].password)
			expect(res.statusCode).to.equals(400);
		});

		it("Fail to sign up because email is an empty string", async function () {
			const res = await signupReq("", users[1].password)
			expect(res.statusCode).to.equals(400);
		});

		it("Fail to sign up because password is an empty string", async function () {
			const res = await signupReq(users[1].email, "")
			expect(res.statusCode).to.equals(400);
		});

		it("Fail to sign up because email is already taken", async function () {
			const resSignup1 = await signupReq(users[0].email, users[0].password)
			expect(resSignup1.statusCode).to.equals(201);

			const resSignup2 = await signupReq(users[0].email, users[1].password)
			expect(resSignup2.statusCode).to.equals(409);
		});

		it("Succeed to sign up a new user", async function () {
			const res = await signupReq(users[0].email, users[0].password)
			expect(res.statusCode).to.equals(201);
		});
	})

	/*it("Should fail to log in with the new user because email is not verified", async function () {*/

	/*const response = await server.inject({*/
	/*method: "POST",*/
	/*url: "/login",*/
	/*payload: {*/
	/*email: users[0].email,*/
	/*password: users[0].password,*/
	/*}*/
	/*});*/

	/*expect(response.statusCode).to.equals(403);*/
	/*});*/
	
	/*it("Fail to verify the email (wrong token)", async function () {*/

	/*const response = await server.inject({*/
	/*method: "GET",*/
	/*url: `/signup-email-confirmation?email=${users[0].email}&emailConfirmationToken=this_is_a_random_string`,*/
	/*});*/

	/*expect(response.statusCode).to.equals(401);*/
	/*});*/

	/*it("Verify the email", async function () {*/

	/*const user = await server.app.managers.userManager.FetchUserByEmail(users[0].email);*/

	/*const response = await server.inject({*/
	/*method: "GET",*/
	/*url: `/signup-email-confirmation?email=${users[0].email}&emailConfirmationToken=${user?.GetDocument().emailConfirmationToken}`,*/
	/*});*/

	/*expect(response.statusCode).to.equals(200);*/
	/*});*/

	describe("Login", function() {
		beforeEach(async function() {
			const response = await server.inject({
				method: "POST",
				url: "/signup",
				payload: {
					email: users[0].email,
					password: users[0].password,
				}
			});
			expect(response.statusCode).to.equals(201);
		})

		it ("Fail (400) when a required property is missing", async function() {
			await TestRequiredBody(server, {
				method: "POST",
				url: "/login",
				payload: {
					email: users[0].email,
					password: users[0].password,
				}
			});
		});

		it("Fail to log in with wrong credentials", async function () {
			const res = await logReq("abc", "def")
			expect(res.statusCode).to.equals(401);
		});

		it ("Fail to get current authenticated user because of wrong jwt token", async function() {
			const response = await server.inject({
				method: "GET",
				url: "/auth",
				headers: {
					["Authorization"]: "Bearer abcd"
				}
			});

			expect(response.statusCode).to.equals(401);
		});

		it("Fail to log in with password of another user", async function () {
			const res = await logReq(users[1].email, users[0].password)
			expect(res.statusCode).to.equals(401);
		});

		it("Fail to log in with a total random password", async function () {
			const res = await logReq(users[1].email, "qwertyasdfgzxcvb")
			expect(res.statusCode).to.equals(401);
		});

		it("Fail to log in with an unknown email but existing password", async function () {
			const res = await logReq("this_email@doesnt.exist",  users[0].password)
			expect(res.statusCode).to.equals(401);
		});

		it("Fail to log in with an unknown email and unknown password", async function () {
			const res = await logReq("this_email@doesnt.exist",  "this_password_doesnt_exist")
			expect(res.statusCode).to.equals(401);
		});

		it("Succeed to log in", async function () {
			const res = await logReq(users[0].email, users[0].password)
			expect(res.statusCode).to.equals(200);
			expect(res.json().token).to.not.be.undefined;
			expect(res.json().password).to.be.undefined;
		});

		it ("Succeed to get current authenticated user", async function() {
			const resLogin = await logReq(users[0].email, users[0].password)
			expect(resLogin.statusCode).to.equals(200);

			const token = resLogin.json().token

			const resAuth = await server.inject({
				method: "GET",
				url: "/auth",
				headers: {
					["Authorization"]: `Bearer ${token}`
				}
			});
			expect(resAuth.statusCode).to.equals(200);
			expect(resAuth.json().password).to.be.undefined;
		});
	})

	describe("Password reset", function() {
		beforeEach(async function() {
			const response = await server.inject({
				method: "POST",
				url: "/signup",
				payload: {
					email: users[0].email,
					password: users[0].password,
				}
			});
			expect(response.statusCode).to.equals(201);
		})

		it ("Admin succeed to force change an user password", async function() {
			const newPassword = "my new password"
			const resWrongPassword = await logReq(users[0].email, newPassword)
			expect(resWrongPassword.statusCode).to.equals(401);
			const resChangePassword = await server.inject({
				method: "post",
				url: "/admin/change-user-password",
				headers: {
					["Authorization"]: `Bearer ${ADMIN_TOKEN}`
				},
				payload: {
					email: users[0].email,
					newPassword: newPassword
				}
			});
			expect(resChangePassword.statusCode).to.equals(200);
			const resGoodPassword = await logReq(users[0].email, newPassword)
			expect(resGoodPassword.statusCode).to.equals(200);
		});

		it ("Non Admin fail to force change an user password", async function() {
			const newPassword = "my new password"
			const resWrongPassword = await logReq(users[0].email, newPassword)
			expect(resWrongPassword.statusCode).to.equals(401);
			const resChangePassword = await server.inject({
				method: "post",
				url: "/admin/change-user-password",
				headers: {
					["Authorization"]: "Something random"
				},
				payload: {
					password: newPassword
				}
			});
			expect(resChangePassword.statusCode).to.equals(401);
			const resGoodPassword = await logReq(users[0].email, newPassword)
			expect(resGoodPassword.statusCode).to.equals(401);
		});
	})
});
