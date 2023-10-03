import {CheckIcon} from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useApi} from "../api";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

export default function EmailConfirmation() {
	const [validating, setValidating] = useState(false)
	const [error, setError] = useState(false)
	const api = useApi();
	const navigate = useNavigate()
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email")
	const emailConfirmationToken = searchParams.get("emailConfirmationToken")

	
	useEffect(() => {
		if (!email || !emailConfirmationToken) {
			navigate("/")
			return;
		}
		setValidating(true)
		api.VerifyEmail(email, emailConfirmationToken).then(success => {
			setValidating(false)
			setError(success)
		}).catch(() => {
			setValidating(false)
			setError(true)
		})
	}, [api, navigate, setValidating, setError, email, emailConfirmationToken])	

	return (
		<div className="p-4 f-c gap-4 text-left">
			{email}
			<div className="f-r gap-4 items-center">
				{validating && 
					<>
						<Spinner size={16}/>
						Verifying your email
					</>
				}
				{!validating && !error && 
					<>
						<CheckIcon className="w-8 h-8 text-green-300"/>
						Email verified!
					</>
				}
				{!validating && error && 
					<>
						<CheckIcon className="w-8 h-8 text-red-300"/>
						<p>An error occured or you may have already verified your email.<br/>
						Contact us if the problem persists</p> 
					</>
				}
			</div> 
			{!validating && <Button text="Go to login page" onClick={() => {navigate('/')}}/>}
		</div>
	)
}
