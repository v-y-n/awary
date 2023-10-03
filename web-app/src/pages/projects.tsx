import {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useApi} from "../api"
import Button from "../components/Button";
import {ProjectSideBar} from "../components/ProjectSideBar";
import {Project} from "../core/Project";
import {CreateProjectForm} from "../forms/createProjectForm";
import {useModal} from "../services/ModalService";

export default function Projects() {
	
	const api = useApi();
	const modalService = useModal();
	const [projects, setProjects] = useState<Project[]>([]);

	const fetchProjects = useCallback(async () => {
		const projects = await api.fetchProjects();
		setProjects(projects);
	}, [api])

	const createProject = useCallback(async (data: any) => {
		await api.createProject(data);
		fetchProjects();
	}, [api, fetchProjects])

	const showCreateProjectForm = useCallback(async () => {
		modalService.addModal((close) => <CreateProjectForm close={close} onCreate={createProject}/>)
	}, [createProject, modalService])

	useEffect(() => {fetchProjects()}, [fetchProjects])

	return (
		<div className="h-screen flex-1 f-r">
			<ProjectSideBar/>
			<div className="flex-1 f-c gap-4 px-4">
				<div className="f-r justify-between border-b border-b-neutral-500 py-4">
					<h1 className="text-4xl">Projects</h1>
					<Button text="Create project" onClick={showCreateProjectForm}/>
				</div>
				<div className="f-r flex-wrap gap-4">
					{projects.map(project => (
						<Link
							key={project.id}
							to={`/projects/${project.id}`}
							className="flex-1 f-c gap-4 bg-neutral-600 p-4 text-left rounded-md cursor-pointer hover:bg-neutral-500 duration-150">
							{project.name}
						</Link>
					))}
				</div>
				
			</div>
		</div>
	)
}
