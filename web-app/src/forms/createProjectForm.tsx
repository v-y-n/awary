import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../components/Button";
import LineEdit from "../components/Input";
import {ProjectData} from "../core/Project"

interface CreateProjectFormProps {
	close: any
	onCreate: any
}

export function CreateProjectForm(props: CreateProjectFormProps) {
	const {register, handleSubmit} = useForm<Omit<ProjectData, "id">>();

	const createProject: SubmitHandler<Omit<ProjectData, "id">> = async (data) => {
		props.onCreate(data);
		props.close();
	}

	return (
		<form onSubmit={handleSubmit(createProject)} className="f-c gap-2">
			<h2 className="text-2xl mb-4 text-left">Create a new project</h2>
			<LineEdit label="Name" register={register("name")}/>
			<Button type="submit" text="Create"/>
		</form>
	)
}
