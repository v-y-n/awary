import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../components/Button";
import LineEdit from "../components/Input";
import {Metric, MetricDataOnUpdate} from "../core/Metric";

interface CreateProjectFormProps {
	metric?: Metric // If provided, we're on an update, otherwise it's a creation.
	close: any
	onCreate: (data: MetricDataOnUpdate) => void
}

export function MetricForm({metric, close, onCreate}: CreateProjectFormProps) {
	const {register, handleSubmit} = useForm<MetricDataOnUpdate>({
		defaultValues: {
			name: metric?.name,
			type: "numeric"
		}
	});

	const createMetric: SubmitHandler<MetricDataOnUpdate> = async (data) => {
		onCreate(data);
		close();
	}

	return (
		<form onSubmit={handleSubmit(createMetric)} className="f-c gap-2">
			<h2 className="text-2xl mb-4 text-left">{metric ? "Update" : "Create"} metric</h2>
			<LineEdit label="Name" register={register("name")}/>
			<Button type="submit" text={metric ? "Update" : "Create"} className="ml-auto"/>
		</form>
	)
}
