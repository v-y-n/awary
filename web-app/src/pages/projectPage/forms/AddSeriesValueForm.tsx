import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../../../components/Button";
import LineEdit from "../../../components/Input";
import {ApiKeyData} from "../../../core/ApiKey";
import {Metric, MetricData} from "../../../core/Metric";
import {TagData} from "../../../core/Tag";

interface AddSerieValueFormProps {
	series: Metric
	close: any
	onCreate: (value: number) => void
}

export function AddSerieValueForm(props: AddSerieValueFormProps) {
	const {register, handleSubmit} = useForm<{value: number}>();

	const addSeriesValue: SubmitHandler<{value: number}> = async (data) => {
		props.onCreate(data.value);
		props.close();
	}

	return (
		<form onSubmit={handleSubmit(addSeriesValue)} className="f-c gap-2">
			<h2 className="text-2xl mb-4 text-left">
				Add value to Series {props.series.name}
			</h2>
			<LineEdit label="Value" type="number" register={register("value")}/>
			<Button type="submit" text="Add"/>
		</form>
	)
}
