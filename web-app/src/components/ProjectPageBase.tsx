import {useCallback, useEffect, useState} from "react";
import {Route, Routes, useParams} from "react-router-dom";
import {useApi} from "../api";
import {Project} from "../core/Project";
import { MetricHistoryPage } from "../pages/MetricHistory";
import {ProjectApiKeysPage} from "../pages/ProjectApiKeys";
import ProjectLogsPage from "../pages/ProjectLogs";
import {ProjectMetricsPage} from "../pages/ProjectMetrics";
import ProjectPage from "../pages/projectPage";
import {ProjectSideBar} from "./ProjectSideBar";

export default function ProjectPageBase() {
	
	const api = useApi();
	const {projectId} = useParams();
	const [project, setProject] = useState<Project | null>(null);

	const fetchProject = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
	}, [projectId, api])

	useEffect(() => {fetchProject()}, [fetchProject])

	if (!project) {
		return <div>Loading project...</div>
	}

	return (
		<div className="flex-1 f-r h-full overflow-hidden">
			<ProjectSideBar project={project}/>
			<div className="flex-1 f-c gap-4 p-4 overflow-hidden">
				<Routes>
					<Route path="/" element={
						<ProjectPage/>
					}/>
					<Route path="/logs" element={
						<ProjectLogsPage/>
					}/>
					<Route path="/metrics" element={
						<ProjectMetricsPage/>
					}/>
					<Route path="/metrics/:metricId/history" element={
						<MetricHistoryPage/>
					}/>
					<Route path="/api-keys" element={
						<ProjectApiKeysPage/>
					}/>
				</Routes>
			</div>
		</div>
	)
}
