import moment from "moment";
import { useState } from "react";
import {Bar, ComposedChart} from "recharts";
import {Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatTimestamp} from "../utils/formatTimestamp";
import Select from "./Select";

const dayDuration = 1000 * 60 * 60 * 24 // Duration of a day in milliseconds

function lastDays(data: {value: number | null, date: number}[], alwaysUseLastValue: boolean, daysCount: number = 30) {
	data.sort((a, b) => b.date - a.date)
	const processedData: {date: string, value: number | null}[] = []
	const startingPoint = moment(Date.now()).endOf("day").valueOf()

	for (let currentDay = 0; currentDay < daysCount; ++currentDay) {
		const beforeThreshold = startingPoint - (currentDay * dayDuration)
		let last = data.find(x => x.date < beforeThreshold)
		if (!alwaysUseLastValue && last && last?.date < beforeThreshold - (dayDuration)) {
			last = undefined
		}
		processedData.push({
			date: formatTimestamp(beforeThreshold),
			value: last && last.value !== null ? last.value : null
		})
	}

	return processedData.reverse()
}

type ChartProps = {
	charts: {
		name: string
		type: string
		color: string
		alwaysUseLastValue: boolean
		data: {
			value: number
			date: number
		}[]
	}[]
}

export default function Chart({charts}: ChartProps) {

	const [daysRange, setDaysRange] = useState<number>(30)
	const processedData = charts.map(d => ({
		name: d.name,
		type: d.type,
		color: d.color,
		data: lastDays(d.data, d.alwaysUseLastValue, daysRange)
	}))
	const chartData: {
		values: number[]
		date: string
	}[] = []

	for (let i = 0; i < processedData.length; ++i) {
		for (let j = 0; j < daysRange; ++j) {
			if (i === 0) {
				chartData.push({date: processedData[i].data[j].date, values: [processedData[i].data[j].value || 0]})
				continue;
			}
			chartData[j].values.push(processedData[i].data[j].value || 0)
		}
	}

	return (
		<>
			<div className="mb-2">
				<div className="f-r items-center gap-2">
					<span>Show:</span>
					<Select onChange={(event) => setDaysRange(parseInt(event.target.value))}>
						<option value={7}>last 7 days</option>
						<option value={15}>last 15 days</option>
						<option selected value={30}>last 30 days</option>
						<option value={60}>last 60 days</option>
						<option value={90}>last 90 days</option>
						<option value={360}>last 365 days</option>
					</Select>
				</div>
			</div>
			<div className="border-b border-b-neutral-500 my-4"/>
			<ResponsiveContainer width="99%" height={180}>
				<ComposedChart data={chartData}>
				{chartData.map((_, index) => {
					if (charts[index]?.type === "line")
						return <Line type="monotone" dataKey={`values[${index}]`} dot={false} name={charts[index]?.name} stroke={charts[index].color} />
					if (charts[index]?.type === "bar")
						return <Bar fill={charts[index]?.color} dataKey={`values[${index}]`} name={charts[index]?.name} stroke={charts[index].color} />
				})}
					<XAxis dataKey="date" stroke="#AAAAAA"/>
					<YAxis stroke="#AAAAAA"/>
					<Tooltip contentStyle={{backgroundColor: "#444444"}}/>
				</ComposedChart>
			</ResponsiveContainer>
		</>
	)
}
