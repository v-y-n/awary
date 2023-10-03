import {Type} from "@sinclair/typebox";

export const CreateProjectBody = Type.Object({
	name: Type.String(),
});

export const CreateApiKeyBody = Type.Object({
	name: Type.String(),
});

export const CreateApiKeyParams = Type.Object({
	projectId: Type.String(),
});

export const DeleteApiKeyParams = Type.Object({
	projectId: Type.String(),
	apiKeyId: Type.String(),
});
