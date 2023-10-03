import {TrashIcon} from "@heroicons/react/outline";
import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useApi} from "../api";
import Button from "../components/Button";
import {Metric} from "../core/Metric";
import {Project} from "../core/Project";
import {MetricForm} from "../forms/createMetricForm";
import {useModal} from "../services/ModalService";
import {formatTimestamp} from "../utils/formatTimestamp";

export function MetricHistoryPage() {
	
	const api = useApi();
	const modalService = useModal();
	const {projectId, metricId} = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [metric, setMetric] = useState<Metric | null>(null);

	const fetchProject = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
		const metric = await api.fetchProjectMetric(projectId as string, metricId as string);
		setMetric(metric);
	}, [projectId, metricId, api])

	useEffect(() => {fetchProject()}, [fetchProject])

	const onSomethingChanged = () => {
		fetchProject();
	}

	if (!project || !metric) {
		return <div>Loading project...</div>
	}

	const metricForm = (close: () => void) =>
		<MetricForm
			close={close}
			onCreate={async (data) => {
				close()
				await api.createSeries(project.id, data)
				onSomethingChanged()
			}}
		/> 

	const deleteRecord = async (recordId: string) => {
		await api.deleteMetricHistory(metric.projectId, metric.id, recordId);
		fetchProject();
	}

	return (
		<div className="flex-1 f-c gap-4 overflow-scroll">
			<div className="f-r justify-between items-center border-b border-neutral-600">
				<h2 className="text-left text-3xl font-bold pb-4">Metrics</h2>
				<Button text="Create new metric" onClick={() => modalService.addModal(metricForm)}/>
			</div>
			<div className="f-c gap-2 overflow-scroll pr-2">
				{metric?.history?.map(record => 
					<div className="card f-r gap-4 p-2">
						<div>Value: {record.value}</div>
						<div>Date: {formatTimestamp(record.date)}</div>
						<TrashIcon
							className="ml-auto w-4 h-4 text-red-300 hover:bg-neutral-500 cursor-pointer duration-75 mr-2"

							onClick={() => modalService.confirmation("Delete this history record ?", () => deleteRecord(record.id))}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
