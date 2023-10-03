export class FeatureEvent<T> {
	callbacks: ((data: T) => Promise<void>)[] = []

	register(callback: (data: T) => Promise<void>) {
		this.callbacks.push(callback)
	}

	async emit(data: T): Promise<void> {
		await Promise.all(this.callbacks.map(callback => callback(data)))
	}
}
