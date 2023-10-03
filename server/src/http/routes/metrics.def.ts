import {Type} from "@sinclair/typebox";

export const CreateMetricBody = Type.Object({
	name: Type.String(),
});

export const CreateMetricParams = Type.Object({
	projectId: Type.String(),
});

export const UpdateMetricBody = Type.Object({
	name: Type.String(),
});

export const UpdateMetricParams = Type.Object({
	projectId: Type.String(),
	metricId: Type.String(),
});

export const SetMetricValueBody = Type.Object({
	value: Type.Number(),
	date: Type.Optional(Type.Number())
});

export const SetMetricValueParams = Type.Object({
	projectId: Type.String(),
	metricId: Type.String()
});

export const DeleteHistoryRecordParams = Type.Object({
	projectId: Type.String(),
	metricId: Type.String(),
	recordId: Type.String()
});
