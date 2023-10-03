import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../../../components/Button";
import LineEdit from "../../../components/Input";
import {ApiKeyData} from "../../../core/ApiKey";
import {TagData} from "../../../core/Tag";

interface TagFormProps {
	tag?: TagData
	close: any
	onCreate: any
}

export function TagForm(props: TagFormProps) {
	const {register, handleSubmit} = useForm<TagData>({defaultValues: props.tag});

	const createTag: SubmitHandler<TagData> = async (data) => {
		props.onCreate(data);
		props.close();
	}

	return (
		<form onSubmit={handleSubmit(createTag)} className="f-c gap-2">
			<h2 className="text-2xl mb-4 text-left">
				{!props.tag && "Create new tag"}
				{props.tag && "Update tag"}
			</h2>
			<LineEdit label="Name" register={register("name")}/>
			<input type="color" className="w-full" {...register("color")}/>
			<Button type="submit" text={props.tag ? "Save" : "Create"}/>
		</form>
	)
}
