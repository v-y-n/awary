import {ClipboardCopyIcon, CogIcon, DocumentSearchIcon, PlusIcon, TrashIcon} from "@heroicons/react/outline";
import {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useApi} from "../api";
import Button from "../components/Button";
import ProjectHeader from "../components/ProjectHeader";
import {Metric, MetricDataOnUpdate} from "../core/Metric";
import {Project} from "../core/Project";
import {MetricForm} from "../forms/createMetricForm";
import {useModal} from "../services/ModalService";
import { copyToClipboard } from "../utils/copyToClipboard";
import {formatTimestamp} from "../utils/formatTimestamp";
import {AddSerieValueForm} from "./projectPage/forms/AddSeriesValueForm";

export type MetricCardProps = {
	metric: Metric
	onDelete: () => void
	onAddDataPoint: () => void
}

export function MetricCard({metric, onDelete, onAddDataPoint}: MetricCardProps) {
	const modalService = useModal();
	const api = useApi()

	const addDataPoint = async (value: number) => {
		await api.addValueToSerie(metric.projectId, metric.id, value)
		onAddDataPoint()
	}

	const updateMetric = async (data: MetricDataOnUpdate) => {
		await api.updateMetric(metric.projectId, metric.id, data)
		onDelete() // I'm lazy
	}

	const deleteMetric = async () => {
		await api.deleteMetric(metric.projectId, metric.id);
		onDelete()
	}

	const metricForm = (close: () => void) =>
		<MetricForm
			metric={metric}
			close={close}
			onCreate={updateMetric}
		/>

	return (
		<div className="card f-r">
			<div className="flex-1 f-c">
				<div className="f-r">
					<div className="flex-1"></div>
					<div className="f-r gap-2 items-center">
						<p className="flex-1 text-center text-xl font-bold">{metric.name}</p>
						<ClipboardCopyIcon
							className="w-4 h-4 cursor-pointer"
							onClick={() => {
								copyToClipboard(metric.id)
								modalService.info("Metric id copied to clipboard")
							}}
						/>
					</div>
					<div className="flex-1 f-r gap-2 justify-end items-center">
						<PlusIcon
							className="w-4 h-4 text-green-300 hover:bg-neutral-500 cursor-pointer duration-75"
							onClick={() => modalService.addModal((close) => 
								<AddSerieValueForm series={metric} close={close} onCreate={addDataPoint} />
							)}
						/>
						<CogIcon
							className="w-4 h-4 text-neutral-300 hover:bg-neutral-500 cursor-pointer duration-75"
							onClick={() => modalService.addModal(metricForm)}
						/>
						<Link to={`${metric.id}/history`}>
							<DocumentSearchIcon
								className="w-4 h-4 text-neutral-300 hover:bg-neutral-500 cursor-pointer duration-75"
							/>
						</Link>
						<TrashIcon
							className="w-4 h-4 text-red-300 hover:bg-neutral-500 cursor-pointer duration-75 mr-2"
							onClick={() => modalService.confirmation(`Delete the metric "${metric.name}" ?`, deleteMetric)}
						/>
					</div>
				</div>
				<div className="f-c text-left p-2">
					<span>Last update: {formatTimestamp(metric.history?.at(0)?.date || 0)}</span>
					<span>Last value: {metric.history?.at(0)?.value}</span>
				</div>
			</div>
		</div>
	)
}

export function ProjectMetricsPage() {
	
	const api = useApi();
	const modalService = useModal();
	const {projectId} = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [metrics, setMetrics] = useState<Metric[]>([]);

	const fetchProject = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
		const metrics = await api.fetchProjectMetrics(projectId as string);
		setMetrics(metrics);
	}, [projectId, api])

	useEffect(() => {fetchProject()}, [fetchProject])

	const onSomethingChanged = () => {
		fetchProject();
	}

	if (!project) {
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

	return (
		<div className="flex-1 f-c gap-4 overflow-scroll">
			<ProjectHeader
				project={project}
				middle={<h3 className="text-xl">Metrics</h3>}
				right={
					<Button
						className="ml-auto"
						text="Create new metric"
						onClick={() => modalService.addModal(metricForm)}
					/>
				}
			/>
			<div className={`grid grid-cols-2 rounded-md gap-2 overflow-scroll pr-2`}>
				{metrics.map(metric => 
					<MetricCard
						key={metric.id}
						metric={metric}
						onDelete={onSomethingChanged}
						onAddDataPoint={onSomethingChanged}
					/>
				)}
			</div>
		</div>
	)
}
