import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useApi} from "../api";
import Button from "../components/Button";
import {LogCard} from "../components/LogCard";
import ProjectHeader from "../components/ProjectHeader";
import {Log} from "../core/Log";
import {Project} from "../core/Project";
import { Tag, TagData } from "../core/Tag";
import {useModal} from "../services/ModalService";
import {TagsSettings} from "./projectPage/TagsSettings";

export default function ProjectLogsPage() {
	
	const api = useApi();
	const modalService = useModal();
	const {projectId} = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [logs, setLogs] = useState<Log[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const fetchProject = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
		const logs = await api.fetchProjectLogs(projectId as string);
		setLogs(logs);
		const tags = await api.fetchProjectTags(projectId as string);
		setTags(tags);
	}, [projectId, api])

	const onLogDeleted = () => {
		fetchProject();
	}

	useEffect(() => {fetchProject()}, [fetchProject])

	if (!project) {
		return <div>Loading project...</div>
	}

	const updateTags = async (newTags: TagData[]) => {
		const tagsToCreate = newTags.filter(newTag => !newTag.id)
		const tagsToDelete = tags.filter(tag => !newTags.find(newTag => newTag.id === tag.id))
		const tagsToUpdate = newTags.filter(newTag => {
			const tag = tags.find(tag => tag.id === newTag.id)
			if (!tag)
				return false
 			return tag.name !== newTag.name || tag.color !== newTag.color
		})
		await Promise.all(tagsToUpdate.map(async tag => {
			if (tag.id)
				return api.updateTag(project.id, tag.id, tag)
		}))
		await Promise.all(tagsToCreate.map(async tag => {
			return api.createTag(project.id, tag)
		}))
		await Promise.all(tagsToDelete.map(async tag => {
			if (tag.id)
				return api.deleteTag(project.id, tag.id)
		}))
		await fetchProject()
	}

	return (
		<div className="flex-1 f-c gap-4">
			<ProjectHeader
				project={project}
				middle={<h3 className="text-xl">Logs</h3>}
				right={
					<Button
						className="ml-auto"
						text="Manage tags"
						onClick={() => modalService.addModal(
							(close) => <TagsSettings tags={tags} onSave={(data) => {
								updateTags(data);close()
							}}/>
						)}
					/>
				}
			/>
			<div className={`flex flex-col rounded-md gap-2 overflow-scroll`}>
				{logs.map(log => <LogCard key={log.id} project={project} log={log} onDelete={onLogDeleted}/>)}
			</div>
		</div>
	)
}
