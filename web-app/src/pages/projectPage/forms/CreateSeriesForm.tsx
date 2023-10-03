import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../../../components/Button";
import LineEdit from "../../../components/Input";
import {ApiKeyData} from "../../../core/ApiKey";
import {Metric, MetricData} from "../../../core/Metric";
import {TagData} from "../../../core/Tag";

interface CreateSeriesFormProps {
	close: any
	onCreate: (name: string, type: string) => void
}

export function CreateSeriesForm(props: CreateSeriesFormProps) {
	const {register, handleSubmit} = useForm<{name: string, type: string}>();

	const CreateSeries: SubmitHandler<{name: string, type: string}> = async (data) => {
		props.onCreate(data.name, data.type);
		props.close();
	}

	return (
		<form onSubmit={handleSubmit(CreateSeries)} className="f-c gap-2">
			<h2 className="text-2xl mb-4 text-left">
				Create Series
			</h2>
			<LineEdit label="Name" register={register("name")}/>
			<LineEdit label="Type" register={register("type")}/>
			<Button type="submit" text="Add"/>
		</form>
	)
}
