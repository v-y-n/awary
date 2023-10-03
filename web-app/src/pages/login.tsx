import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {useApi} from "../api"
import AppName from "../components/AppName";
import Button from "../components/Button";
import LineEdit from "../components/Input";

interface LoginForm {
	email: string
	password: string
}

export default function LoginPage() {
	
	const api = useApi();
	const navigate = useNavigate()
	const {register, setValue, handleSubmit} = useForm<LoginForm>()
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	
	if (api.IsLogged()) {
		return <Navigate to="/projects"/>
	}

	const onLogin: SubmitHandler<LoginForm> = async ({email, password}) => {
		try {
			setIsLoggingIn(true);
			await api.Login(email, password)
			navigate("/projects")
		} catch (err) {
			console.log(err)
			setValue("password", "");
			setErrorMessage((err as Error).message);
		}
		setIsLoggingIn(false);
	}

	return (
		<div className="h-screen flex flex-col justify-center items-center gap-4">
			<div className="p-4 flex flex-col justify-center items-center bg-neutral-600 rounded-md border border-neutral-500 shadow-sm">
				<AppName/>
				<form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-4 mt-4">
					<LineEdit
						type="email"
						label="Email"
						register={register("email")}
						required
					/>
					<LineEdit
						type="password"
						label="Password"
						register={register("password")}
						required
					/>
					<Button 
						className="self-center"
						color="green"
						text="Log in"
						spinner={isLoggingIn}
					/>
					{errorMessage && <p className="text-red-200">{errorMessage}</p>}
				</form>
			</div>
			<Link to="/signup"><Button text="Create an account" color="dark"/></Link>
		</div>
	)
}
