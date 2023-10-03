import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../../../components/Button";
import LineEdit from "../../../components/Input";
import {ApiKeyData} from "../../../core/ApiKey";

interface ApiKeyFormProps {
	close: any
	onCreate: any
}

export function ApiKeyForm(props: ApiKeyFormProps) {
	const {register, handleSubmit} = useForm<Omit<ApiKeyData, "id">>();

	const createApiKey: SubmitHandler<Omit<ApiKeyData, "id">> = async (data) => {
		props.onCreate(data);
		props.close();
	}

	return (
		<form onSubmit={handleSubmit(createApiKey)} className="f-c gap-2">
			<h2 className="text-2xl mb-4 text-left">Generate a new API key</h2>
			<LineEdit label="Name" register={register("name")}/>
			<Button type="submit" text="Create"/>
		</form>
	)
}
