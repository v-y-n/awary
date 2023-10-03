export interface ViewDataOnCreation<T>  {
	name: string
	type: string
	provider: string
	config: T
}

export interface ViewDataOnUpdate<T>  {
	name: string
	config: T
}

export interface ViewData<T> {
	id: string,
	projectId: string,
	type: string
	name: string
	provider: string
	config: T
}

export interface View<T> extends Readonly<ViewData<T>> {}

export class View<T> {
	
	constructor(data: ViewData<T>) {
		Object.assign(this, data);
	}

}
