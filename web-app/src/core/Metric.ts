export interface MetricDataOnCreation  {
	projectId: string
	name: string
	type: string
}

export interface MetricDataOnUpdate  {
	name: string
	type: string
}

export interface MetricData {
	id: string
	projectId: string
	name: string
	color: string
	history: {
		id: string
		seriesId: string
		date: number
		value: number
	}[] | null
	currentValue?: number
}

export interface Metric extends Readonly<MetricData> {}

export class Metric {
	
	constructor(data: MetricData) {
		Object.assign(this, data);
	}

}
