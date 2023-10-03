import {useCallback, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {useApi} from "../api"
import Button from "../components/Button"
import Card from "../components/Card"
import ProjectHeader from "../components/ProjectHeader"
import {ApiKey, ApiKeyData} from "../core/ApiKey"
import {Project} from "../core/Project"
import {useModal} from "../services/ModalService"
import {ApiKeyForm} from "./projectPage/forms/apiKeyForm"


export function ProjectApiKeysPage() {
	const api = useApi()
	const modalService = useModal()
	const {projectId} = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [keys, setKeys] = useState<ApiKey[]>([])

	const fetchData = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
		const keys = await api.fetchProjectApiKeys(project.id);
		setKeys(keys)
	}, [projectId, api])

	useEffect(() => {fetchData()}, [fetchData])

	if (!project) {
		return <div>Loading project...</div>
	}

	const generateApiKey = async (data: Omit<ApiKeyData, "id">) => {
		await api.generateApiKey(project.id, data);
		fetchData();
	}

	const deleteApiKey = async (id: string) => {
		await api.deleteApiKey(project.id, id);
		fetchData();
	}

	return (
		<div className="f-c gap-4 overflow-scroll">
			<ProjectHeader
				project={project}
				middle={<h3 className="text-xl">Api keys</h3>}
				right={<Button
					className="ml-auto"
					text="Generate API key"
					onClick={() => {
						modalService.addModal((close) =>
							<ApiKeyForm close={close} onCreate={generateApiKey}/>)
						}	
					}
				/>}
			/>
			{
				keys.map(key =>
					<Card
						key={key.id}
						header={
							<div className="f-r justify-between">
								{key.name}
								<Button
								text="Delete"
								color="danger"
								onClick={() => {
									modalService.confirmation("Delete key ?", () => deleteApiKey(key.id))
								}}
							/>
							</div>}
					>
						{key.key}	
					</Card>
				)
			}
		</div>
	) 
}
