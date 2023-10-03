import {useState} from "react"
import {Navigate} from "react-router-dom"
import {useApi} from "../api"
import {useModal} from "../services/ModalService"

export function RequireAuth ({children}: {children: JSX.Element}) {
	const api = useApi()
	const modalService = useModal()
	const [hasError, setHasError] = useState(false)

	if (!api.IsLogged()) {
		return <Navigate to="/"/>
	}

	if (!api.IsLoadingUser() && !api.GetUserData() && !hasError) {
		setHasError(true)
		modalService.error("Could not retrieve user data")
	}
	return children
}
