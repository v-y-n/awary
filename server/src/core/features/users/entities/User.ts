import {UserData} from "./UserData";
import argon2 from "argon2"

export interface User extends Readonly<UserData> {
	id: string
}

export class User {
	constructor(data: UserData) {
		Object.assign(this, data);
	}

	async verifyPassword(password: string): Promise<boolean> {
		return this.password ? argon2.verify(this.password, password) : false;
	}

	getState(): UserData {
		return {
			id: this.id,
			email: this.email,
			password: this.password,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}
}
