import {Identifiable} from "@app/core/Identifiable"


export interface MetricCreationProperties {
	name: string
}

export interface MetricConstructor extends Identifiable  {
	projectId: string
	name: string
	history: MetricValue[] | null
	currentValue: undefined | number
}

export interface MetricValue extends Identifiable {
	metricId: string
	date: number // timestamp
	value: number
}

export class Metric implements MetricConstructor {

	public readonly id: string
	public readonly projectId: string
	public readonly name: string
	public readonly history: MetricValue[] | null
	public readonly currentValue: undefined | number

	constructor(data: MetricConstructor) {
		this.id = data.id
		this.projectId = data.projectId
		this.name = data.name
		this.history = data.history
		this.currentValue = data.currentValue
	}

	hasValues(): boolean {
		return this.history !== null
	}
}
