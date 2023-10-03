import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {AdminChangeUserPasswordBody, InfoBody, LoginBody, SignupBody} from "./users.def";
import {App} from "@app/core";
import {AppData, rateLimit, withData} from "http/utils";
import {isRegistrationEnabled} from "@app/core/features/users/utils";

export function usersRoutes(app: App) {
	return async (server: FastifyInstance) => {

		const usersUseCases = app.userFeature.useCases
		
		server.post<{Body: Static<typeof SignupBody>}>("/signup",
			{
				schema: {body: SignupBody}
			},
			async (request, reply) => {
				const {email, password, adminToken} = request.body;
				await usersUseCases.signupUser(email, password, adminToken)
				reply.status(201).send({success: true});
			}
		);

		server.post<{Body: Static<typeof LoginBody>}>("/login",
			{
				schema: {body: LoginBody}
			},
			async (request) => {
				const {email, password} = request.body;
				const user = await usersUseCases.logUser(email, password)

				const token = server.jwt.sign({email});

				return {...user.getState(), password: undefined, token};
			}
		);

		/*server.get<{Querystring: Static<typeof VerifyEmailQuerystring>}>*/
		/*("/signup-email-confirmation", {schema: {querystring: VerifyEmailQuerystring}}, async function (request, reply) {*/
		/*[>const {email, emailConfirmationToken} = request.query;<]*/
		/*[>const user = await app.userService.getUser({email});<]*/
		/*[>if (!user || !await user.verifyEmail(email,  emailConfirmationToken)) {<]*/
		/*[>reply.status(401);<]*/
		/*[>return {};<]*/
		/*[>}<]*/
		/*reply.send({success: true});*/
		/*});*/

		server.post<{Body: Static<typeof InfoBody>}>("/info",
			{
				schema: {body: InfoBody},
				preValidation: [rateLimit(1, 1000)],
			},
			async (request) => {
				const {adminToken} = request.body;
				return usersUseCases.getGlobalInfo(adminToken)
			}
		);

		server.post<{Body: Static<typeof AdminChangeUserPasswordBody>}>("/admin/change-user-password",
			{
				schema: {body: AdminChangeUserPasswordBody},
				preValidation: [withData(app, [AppData.Caller]), rateLimit(1, 60000)],
			},
			async (request) => {
				const {email, newPassword} = request.body;
				const {caller} = request.data
				return usersUseCases.adminChangeUserPassword(caller, email, newPassword)
			}
		);

		server.get("/auth",
			{
				preValidation: [withData(app, [AppData.Caller])]
			},
			async function (request) {
				const {caller} = request.data;
				return {...caller.asUser().getState(), password: undefined}; 
			}
		);

		server.get("/isUserRegistrationEnabled", async function () {
			return {enabled: isRegistrationEnabled()};
		});
	}
}

