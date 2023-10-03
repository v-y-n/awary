import {PlusIcon} from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form"
import Button from "../../../components/Button";
import LineEdit from "../../../components/Input";
import {ApiKeyData} from "../../../core/ApiKey";
import {Metric, MetricData} from "../../../core/Metric";
import {TagData} from "../../../core/Tag";
import {View} from "../../../core/View";
import {useModal} from "../../../services/ModalService";

function clone<T>(x: T): T {
	return JSON.parse(JSON.stringify(x))
}

interface OrganizeDashboardFormProps {
	dashboard: View<DashboardView> | null
	metrics: Metric[]
	close: any
	onSave: (newDashboardConfig: DashboardView) => void
}

type DashboardViewCharts = {
	name: string
	order: number
	metrics: {
		metricId: string
		color: string
		type: string
		alwaysUseLastValue: boolean
	}[]
}[]

export type DashboardView = {
	metrics: {
		metricId: string,
		name: string
		order: number,
		show: boolean
		color: string
	}[]
	charts: DashboardViewCharts
}


const optionsCss = "f-r items-center gap-2 bg-neutral-500 rounded-md"

export function OrganizeDashboardForm(props: OrganizeDashboardFormProps) {

	const [showGraphs, setShowGraphs] = useState<boolean>(true)
	const [metricsOrder, setMetricsOrder] = useState<DashboardView>()

	useEffect(() => {
		const defaultDashboard: DashboardView = {
			metrics: props.metrics.map((metric, index) => ({
				metricId: metric.id,
				name: metric.name,
				order: index,
				show: false,
				color: "#dddddd"
			})),
			charts: []
		}
		let x: DashboardView = defaultDashboard;
		if (props.dashboard) {
			x = clone(props.dashboard.config)
			props.metrics.forEach((metric, index)=> {
				if (!x.metrics.find(m => m.metricId === metric.id)) {
					x.metrics.push({
						metricId: metric.id,
						name: metric.name,
						order: index,
						show: false,
						color: "#dddddd"
					})
				}
			})
			x.metrics = x.metrics.filter(metric => props.metrics.find(m => m.id === metric.metricId))
		}
		x.metrics.sort((a, b) => a.order - b.order)
		setMetricsOrder(x)
	}, [])

	if (!metricsOrder) {
		return <div>Loading...</div>
	}

	return (
		<div className="f-c gap-2">
			<div className="f-r justify-around border-b border-neutral-400 pb-2">
				<Button
					text="Top row"
					color={!showGraphs ? "dark" : "brighter-dark"}
					onClick={() => {
						setShowGraphs(false)
					}}
				/>
				<Button
					text="Graphs"
					color={showGraphs ? "dark" : "brighter-dark"}
					onClick={() => {
						setShowGraphs(true)
					}}
				/>
			</div>
			{!showGraphs && metricsOrder.metrics.map((metric, index) => (
				<div className="f-r items-stretch border border-neutral-500 p-2 rounded-md gap-2">
					<div className="mr-auto f-r items-center">{metric.name}</div>
					<div className={`${optionsCss} p-1`}>
						Order
						<LineEdit
							inputClassName="p-0 px-1"
							type="number"
							className="w-16"
							value={metric.order}
							onChange={(valueString) => {
								const value = parseInt(valueString)
								const newMetricsOrder = clone(metricsOrder)
								newMetricsOrder.metrics[index].order = value
								setMetricsOrder(newMetricsOrder)
							}}
						/>
					</div>
					<div className={`${optionsCss} pl-1`}>
						Color
						<input
							type="color"
							value={metric.color}
							onChange={(valueString) => {
								const checked = valueString.target.value
								const newMetricsOrder = clone(metricsOrder)
								newMetricsOrder.metrics[index].color = checked
								setMetricsOrder(newMetricsOrder)
							}}
						/>
					</div>
					<div className={`${optionsCss} px-1`}>
						<input type="checkbox" checked={metric.show}
							onChange={(valueString) => {
								const checked = valueString.target.checked
								const newMetricsOrder = clone(metricsOrder)
								newMetricsOrder.metrics[index].show = checked
								setMetricsOrder(newMetricsOrder)
							}}
						/>
					</div>
				</div>
			))}
			{showGraphs &&
				<OrganizeCharts
					charts={metricsOrder.charts || []} 
					metrics={props.metrics}
					close={props.close}
					onChange={(newCharts) => {
						const newMetricsOrder = clone(metricsOrder)
						newMetricsOrder.charts = newCharts
						setMetricsOrder(newMetricsOrder)
					}}
				/>
			}
			<Button text="Save" className="ml-auto" onClick={() => {
				props.onSave(metricsOrder)
				props.close();
			}}/>
		</div>
	)
}

interface OrganizeDashboardChartsProps {
	charts: DashboardViewCharts
	metrics: Metric[]
	close: any
	onChange: (charts: DashboardViewCharts) => void
}

function OrganizeCharts({metrics, charts, onChange, close}: OrganizeDashboardChartsProps) {
	
	const addChart = () => {
		const newCharts = clone(charts)
		newCharts.push({
			name: "New chart",
			order: 1,
			metrics: []
		})
		onChange(newCharts)
	}

	const deleteChart = (chartIndex: number) => {
		const newCharts = clone(charts)
		newCharts.splice(chartIndex, 1)
		onChange(newCharts)
	}

	const setChart = (chartIndex: number, name: string, order: number) => {
		const newCharts = clone(charts)
		newCharts[chartIndex].name = name
		newCharts[chartIndex].order = order
		onChange(newCharts)
	}

	const addMetricToChart = (chartIndex: number) => {
		const metric: Metric = metrics[0]
		const newCharts = clone(charts)
		newCharts[chartIndex].metrics.push({
			metricId: metric.id,
			color: "red",
			type: "line",
			alwaysUseLastValue: true
		})
		onChange(newCharts)
	}

	const setMetricOnChart = (chartIndex: number, metricIndex: number, newMetric: {metricId: string, type: string, color: string, alwaysUseLastValue: boolean}) => {
		const newCharts = clone(charts)
		newCharts[chartIndex].metrics[metricIndex] = newMetric
		onChange(newCharts)
	}

	const deleteMetricOnChart = (chartIndex: number, metricIndex: number) => {
		const newCharts = clone(charts)
		newCharts[chartIndex].metrics.splice(metricIndex, 1)
		onChange(newCharts)
	}

	return (
		<div className="f-c gap-2">
			<Button text="Add chart" className="mx-auto cursor-pointer" onClick={addChart}/>
			{(charts || []).map((chart, chartIndex) => (
				<div key={chartIndex} className="f-c border border-neutral-500 p-2 rounded-md gap-2 mb-2">
					<div className="f-r items-center gap-2">
						<LineEdit className="w-32" value={chart.name} onChange={(event) => { setChart(chartIndex, event, charts[chartIndex].order) }}/>
						<div className={`${optionsCss} p-1`}>
							Order
							<LineEdit
								inputClassName="p-0 px-1"
								type="number"
								className="w-16"
								value={chart.order}
								onChange={(event) => {
									setChart(chartIndex, charts[chartIndex].name, parseInt(event))
								}}
							/>
						</div>
						<Button
							text="Add metric"
							onClick={() => { addMetricToChart(chartIndex) }}
						/>
						<Button
							text="Delete chart"
							color="danger"
							onClick={() => { setTimeout(() => deleteChart(chartIndex), 0) }}
						/>
					</div>
					<div className="f-c gap-2">
						{chart.metrics.map((selectedMetric, selectedMetricIndex) =>
							<div key={selectedMetricIndex} className="f-r items-center gap-2">
								<select onChange={(event) => { setMetricOnChart(chartIndex, selectedMetricIndex, {...selectedMetric, metricId: event.target.value}) }} className="bg-neutral-500 p-1 rounded-md">
									{metrics.map(metric =>
										<option
											value={metric.id}
											selected={metric.id === selectedMetric.metricId}
										>
											{metric.name}
										</option>)}
								</select>
								<select onChange={(event) => { setMetricOnChart(chartIndex, selectedMetricIndex, {...selectedMetric, type: event.target.value}) }} className="bg-neutral-500 p-1 rounded-md">
									<option
										value="line"
										selected={selectedMetric.type === "line"}
									>
										Line
									</option>
									<option
										value="bar"
										selected={selectedMetric.type === "bar"}
									>
										Bar
									</option>
								</select>
								<div className={`${optionsCss} p-1`}>
									Always use last value
									<input type="checkbox" checked={selectedMetric.alwaysUseLastValue}
										onChange={(event) => { setMetricOnChart(chartIndex, selectedMetricIndex, {...selectedMetric, alwaysUseLastValue: event.target.checked}) }}
									/>
								</div>
								<input type="color" value={selectedMetric.color}
									onChange={(event) => { setMetricOnChart(chartIndex, selectedMetricIndex, {...selectedMetric, color: event.target.value}) }}
								/>
								<Button color="danger" text="delete" onClick={() => {
									setTimeout(() => deleteMetricOnChart(chartIndex, selectedMetricIndex), 0)
								}}/>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	)
}
