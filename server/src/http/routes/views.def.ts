import {ViewProvider} from "@app/core/features/views";
import {Type} from "@sinclair/typebox";

export const CreateViewBody = Type.Object({
	type: Type.String(),
	name: Type.String(),
	provider: Type.Enum(ViewProvider),
	config: Type.String(),
});

export const CreateViewParams = Type.Object({
	projectId: Type.String(),
});

export const UpdateViewBody = Type.Object({
	name: Type.String(),
	config: Type.String(),
});

export const UpdateViewParams = Type.Object({
	projectId: Type.String(),
	viewId: Type.String(),
});


export const GetViewsQuerystring = Type.Object({
	type: Type.Optional(Type.String()),
	name: Type.Optional(Type.String()),
});
