import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useApi} from "../api"
import AppName from "../components/AppName";
import Button from "../components/Button";
import LineEdit from "../components/Input";
import {useModal} from "../services/ModalService";

interface SignupForm {
	email: string
	password: string
	passwordConfirmation: string
	code: string
}

export default function SignupPage() {
	
	const api = useApi();
	const navigate = useNavigate();
	const modalService = useModal();

	const {register, watch, handleSubmit} = useForm<SignupForm>()
	const email = watch("email", "")
	const password = watch("password", "")
	const passwordConfirmation = watch("passwordConfirmation", "")
	const [errorMessage, setErrorMessage]= useState<null | string>(null)
	const [isUserRegistrationEnabled, setIsUserRegistrationEnabled] = useState<boolean | null>(null)

	const isFormValid = () => {
		return email && email.length > 5 && password.length > 0 && passwordConfirmation === password ? true : false
	}

	const handleCreation: SubmitHandler<SignupForm> = async ({email, password, code}) => {
		if (!isFormValid()) {
			setErrorMessage("Wrong email format or passwords don't match")
			return 
		}
		try {
			await api.Signup(email, password, code)
			modalService.addModal(
				(close) => {
					navigate("/")
					return (
						<div className="flex flex-col gap-4 items-center">
							<p>Your account has been created, there is no need to confirm your email at the moment,
							you can now log in.</p>
							<Button text="Log in" onClick={() => {
								close()
							}}/>
						</div>
					)
				}
			)
		} catch (err: any) {
			console.log(err)
			setErrorMessage(err?.message || "An unknown error occured")
		}
	}

	useEffect(() => {
		api.isUserRegistrationEnabled().then(setIsUserRegistrationEnabled)
	}, [api, setIsUserRegistrationEnabled])

	if (isUserRegistrationEnabled === null) {
		return <div>Check if user registration is enabled...</div>
	} else if (isUserRegistrationEnabled === false ) {
		return <div>User registration is disabled</div>
	}

	return (
		<div className="h-screen flex flex-col justify-center items-center gap-4">
			<div className="p-4 flex flex-col justify-center items-center bg-neutral-600 rounded-md border border-neutral-500 shadow-sm">
				<AppName/>
				<form onSubmit={handleSubmit(handleCreation)} className="flex flex-col gap-4">
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
						minLength={6}
						required
					/>
					<LineEdit
						type="password"
						label="Confirm password"
						register={register("passwordConfirmation")}
						minLength={6}
						required
					/>
					{errorMessage && <p className="text-red-200">{errorMessage}</p>}
					<Button
						className="self-center"
						color={isFormValid() ? "primary" : "dark"}
						text="Sign up"
					/>
				</form>
			</div>
		</div>
	)
}
