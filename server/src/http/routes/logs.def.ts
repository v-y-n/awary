import {Type} from "@sinclair/typebox";

export const CreateLogBody = Type.Object({
	title: Type.String(),
	content: Type.String(),
	tags: Type.Array(Type.String({minLength: 24, maxLength: 24}), {maxItems: 2})
});

export const CreateLogParams = Type.Object({
	projectId: Type.String(),
});

export const DeleteLogParams = Type.Object({
	projectId: Type.String(),
	logId: Type.String(),
});

export const CreateTagBody = Type.Object({
	name: Type.String(),
	color: Type.String(),
});

export const UpdateTagBody = Type.Object({
	name: Type.String(),
	color: Type.String(),
});

export const UpdateTagParams = Type.Object({
	projectId: Type.String(),
	tagId: Type.String(),
});

export const DeleteTagParams = Type.Object({
	projectId: Type.String(),
	tagId: Type.String(),
});
