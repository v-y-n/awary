import React, {createContext, useContext} from "react";
import {ApiKey, ApiKeyData} from "../core/ApiKey";
import {Log, LogData} from "../core/Log";
import {Metric, MetricData, MetricDataOnUpdate} from "../core/Metric";
import {Project, ProjectData} from "../core/Project";
import { Tag, TagData } from "../core/Tag";
import {View, ViewDataOnCreation, ViewDataOnUpdate} from "../core/View";
import {DashboardView} from "../pages/projectPage/forms/OrganizeDashboardForm";

export interface UserData {
	email: string,
	token: string,
	_id: string
}

type MyProps = {
	children: any
}

type MyState = {
	logged: boolean
	loading: boolean
	token: string | null
	userData: UserData | null
}

export class Api extends React.Component<MyProps, MyState> {

	private _baseUrl = process.env.REACT_APP_API_URL

	state: MyState = {
		logged: false,
		loading: true,
		token: localStorage.getItem("token"),
		userData: null 
	}

	/* eslint-disable-next-line */
	constructor(props: MyProps) {
		super(props)
	}

	public async componentDidMount() {
		if (!this.state.token)
			return; 
		try {
			const userData = await this._FetchCurrentAuthentifiedUser()
			if (userData && userData.email) {
				console.log(`Connected with email ${userData.email}`)
				this.setState({userData: userData, loading: false})
			} else {
				await this.Logout();
			}
		} catch (e) {
			this.setState({userData: null, loading: false})
			console.error("Something wrong happened")	
			console.error(e)	
		}
	}

	private async _Get(path: string) {
		const response = await fetch(`${this._baseUrl}${path}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${this.state.token}`,
				"Content-type": "application/json"
			}
		})
		return response.json()
	}

	private async _Delete(path: string) {
		await fetch(`${this._baseUrl}${path}`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${this.state.token}`,
				"Content-type": "application/json"
			}
		})
	}

	private async _Post(path: string, body: Object) {
		const response = await fetch(`${this._baseUrl}${path}`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${this.state.token}`,
				"Content-type": "application/json"
			},
			body: JSON.stringify(body)
		})
		if (response.status < 200 || response.status > 299)
			throw response
		return response.json()
	}

	private async _Put(path: string, body: Object) {
		const response = await fetch(`${this._baseUrl}${path}`, {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${this.state.token}`,
				"Content-type": "application/json"
			},
			body: JSON.stringify(body)
		})
		if (response.status < 200 || response.status > 299)
			throw response
		return response.json()
	}

	public async Login(email: string, password: string): Promise<UserData> {
		const response = await fetch(`${this._baseUrl}/login`, {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({
				email,
				password
			})
		}) 
		const userData = (await response.json()) as unknown as UserData

		

		if (response.status === 401) {
			this.setState({logged: false, token: null, userData: null})
			throw Error("Wrong email or password")
		} else if (response.status !== 200) {
			this.setState({logged: false, token: null, userData: null})
			throw Error("Log in error")
		}

		localStorage.setItem("token", userData.token);
		this.setState({logged: true, userData: userData, token: userData.token})
		return userData
	}

	public async isUserRegistrationEnabled(): Promise<boolean> {
		const response = await this._Get("/isUserRegistrationEnabled") as {enabled: boolean};
		return response.enabled;
	}

	public async Signup(email: string, password: string, code: string): Promise<UserData> {
		const response = await fetch(`${this._baseUrl}/signup`, {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({
				email,
				password,
				code
			})
		}) 
		const userData = (await response.json()) as any

		if (response.status !== 201) {
			this.setState({logged: false, token: null, userData: null})
			throw Error(userData?.message|| "Sign up error")
		}

		return userData
	}
	public async Logout(): Promise<void> {
		this.setState({token: null, userData: null, loading: false})
		localStorage.removeItem("token")
	}

	private async _FetchCurrentAuthentifiedUser(): Promise<UserData> {
		return this._Get("/auth") as unknown as UserData
	}

	public async VerifyEmail(email: string, emailConfirmationToken: string): Promise<boolean> {
		try {
			await this._Get(`/signup-email-confirmation?email=${email}&emailConfirmationToken=${emailConfirmationToken}`);
			return true;
		} catch (e) {
			return false;
		}
	}

	public async fetchProjects(): Promise<Project[]> {
		const projectsData = await this._Get("/projects") as ProjectData[];
		return projectsData.map(data => new Project(data));
	}

	public async fetchProject(id: string): Promise<Project> {
		const projectData = await this._Get(`/projects/${id}`) as ProjectData;
		return new Project(projectData);
	}

	public async fetchProjectLogs(id: string): Promise<Log[]> {
		const logsData = await this._Get(`/projects/${id}/logs`) as LogData[];
		return logsData.map(data => new Log(data));
	}

	public async fetchProjectTags(id: string): Promise<Tag[]> {
		const tagsData = await this._Get(`/projects/${id}/tags`) as TagData[];
		return tagsData.map(data => new Tag(data));
	}

	public async deleteLog(projectId: string, logId: string): Promise<void> {
		await this._Delete(`/projects/${projectId}/logs/${logId}`);
	}


	public async fetchProjectMetrics(id: string): Promise<Metric[]> {
		const metricsData = await this._Get(`/projects/${id}/metrics`) as MetricData[];
		return metricsData.map(data => new Metric(data));
	}

	public async fetchProjectMetric(projectId: string, metricId: string): Promise<Metric> {
		const data = await this._Get(`/projects/${projectId}/metrics/${metricId}`) as MetricData;
		return new Metric(data);
	}

	async createSeries(projectId: string, data: MetricDataOnUpdate): Promise<void> {
		await this._Post(`/projects/${projectId}/metrics`, data)
	}

	async updateMetric(projectId: string, metricId: string, data: MetricDataOnUpdate): Promise<void> {
		await this._Put(`/projects/${projectId}/metrics/${metricId}`, data)
	}

	async addValueToSerie(projectId: string, seriesId: string, value: number): Promise<void> {
		await this._Post(`/projects/${projectId}/metrics/${seriesId}`, {value})
	}

	async deleteMetric(projectId: string, metricId: string): Promise<void> {
		await this._Delete(`/projects/${projectId}/metrics/${metricId}`)
	}
	
	async deleteMetricHistory(projectId: string, metricId: string, recordId: string): Promise<void> {
		await this._Delete(`/projects/${projectId}/metrics/${metricId}/history/${recordId}`)
	}

	async createView(projectId: string, data: ViewDataOnCreation<any>): Promise<void> {
		await this._Post(`/projects/${projectId}/views`, {...data, config: JSON.stringify(data.config)})
	}

	async updateView(projectId: string, view: View<any>, data: ViewDataOnUpdate<any>): Promise<void> {
		await this._Put(`/projects/${projectId}/views/${view.id}`, {...data, config: JSON.stringify(data.config)})
	}

	public async fetchDashboardView(projectId: string): Promise<View<DashboardView> | null> {
		const viewsData = await this._Get(`/projects/${projectId}/views`) as View<DashboardView>[];
		if (viewsData.length === 0) {
			return null
		}
		return new View({...viewsData[0], config: JSON.parse(viewsData[0].config as unknown as string)});
	}

	public async fetchProjectApiKeys(id: string): Promise<ApiKey[]> {
		const apiKeysData = await this._Get(`/projects/${id}/apiKeys`) as ApiKeyData[];
		return apiKeysData.map(data => new ApiKey(data));
	}

	public async createProject(data: {name: string}): Promise<void> {
		return this._Post("/projects", data);
	}

	public async generateApiKey(projectId: string, data: {name: string}): Promise<void> {
		return this._Post(`/projects/${projectId}/apiKeys`, data);
	}

	public async deleteApiKey(projectId: string, apiKeyId: string): Promise<void> {
		return this._Delete(`/projects/${projectId}/apiKeys/${apiKeyId}`);
	}

	public async createTag(projectId: string, data: {name: string, color: string}): Promise<void> {
		return this._Post(`/projects/${projectId}/tags`, data);
	}

	public async updateTag(projectId: string, tagId: string, data: {name: string, color: string}): Promise<void> {
		return this._Put(`/projects/${projectId}/tags/${tagId}`, data);
	}

	public async deleteTag(projectId: string, tagId: string): Promise<void> {
		return this._Delete(`/projects/${projectId}/tags/${tagId}`);
	}

	public IsLogged(): boolean {
		return this.state.token !== null
	}

	public GetUserData(): UserData {
		return this.state.userData as UserData

	}

	public IsLoadingUser(): boolean {
		return this.state.loading;
	}

	public render() {
		return (
			<ApiContext.Provider value={{api: this, logged: this.GetUserData() !== null}}>
				{this.props.children}
			</ApiContext.Provider>
		)
	}
}

export const ApiContext = createContext<{api: Api, logged: boolean}>({logged: false} as {api: Api, logged: boolean})
export const useApi = () => useContext(ApiContext).api
