import {Type} from "@sinclair/typebox";

export const InfoBody = Type.Object({
	adminToken: Type.String()
});

export const SignupBody = Type.Object({
	email: Type.String({format: "email"}),
	password: Type.String({minLength: 6}),
	adminToken: Type.Optional(Type.String())
});

export const LoginBody= Type.Object({
	email: Type.String(),
	password: Type.String(),
});

export const VerifyEmailQuerystring= Type.Object({
	email: Type.String(),
	emailConfirmationToken: Type.String(),
});

export const AdminChangeUserPasswordBody = Type.Object({
	email: Type.String(),
	newPassword: Type.String()
});
