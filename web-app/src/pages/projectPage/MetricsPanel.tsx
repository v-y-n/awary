import {Metric} from "../../core/Metric";
import {View} from "../../core/View";
import {DashboardView} from "./forms/OrganizeDashboardForm";

interface MetricCardProps {
	metric: Metric
	color: string
	order: number
}

function MetricCard({info}: {info: MetricCardProps}) {
	return (
		<div className="flex-1">
			<div className="card p-4 f-c text-center" style={{color: info.color || info.metric.color || "white"}}>
				<p className="text-3xl">{info.metric.currentValue || "0"}</p>
				<p>{info.metric.name}</p>
			</div>	
		</div>
		
	)
}

interface MetricsPanelProps {
	metrics: Metric[]
	dashboardConfig: View<DashboardView> | null
}

export function MetricsPanel({metrics, dashboardConfig}: MetricsPanelProps) {
	let metricsToShow: MetricCardProps[] = []
	if (dashboardConfig) {
		const metricsConfig = dashboardConfig.config.metrics
		for (let i = 0; i < metricsConfig.length; ++i) {
			if (!metricsConfig[i].show) {
				continue
			}
			const matchedMetric = metrics.find(metric => metric.id === metricsConfig[i].metricId)
			if (!matchedMetric) {
				continue
			}
			metricsToShow.push({
				metric: matchedMetric,
				color: metricsConfig[i].color,
				order: metricsConfig[i].order
			})
		}
		metricsToShow.sort((a, b) => a.order - b.order)
	}
	return (
		<div className="f-r flex-wrap gap-2 overflow-scroll">
			{metricsToShow.map(metric =>
				<MetricCard
					key={metric.metric.id}
					info={metric}
				/>
			)}
		</div>
	)
}
