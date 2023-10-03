import {useEffect, useState} from "react"

interface ModalProps {
	show: boolean
	children?: JSX.Element | null
	onClose: () => void
	customId?: string
	ignoreInputs?: boolean
}

export default function Modal({show, onClose, children, customId, ignoreInputs}: ModalProps) {

	const [createdAt] = useState(Date.now())

	useEffect(() => {
		if (!show)
			return;
		 function handleClose(e: any) {
			if (!ignoreInputs && !document.getElementById(customId || 'modal-content')?.contains(e.target) && Date.now() - createdAt > 1000) {
				onClose()
			}
		}
		document.addEventListener('click', handleClose)
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener('click', handleClose)
			document.body.style.overflow = "visible"
		}
	}, [show, onClose, customId, createdAt])

	if (!show) {
		return <></>
	}

	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center overflow-scroll">
			<div id={customId || 'modal-content'} className="bg-neutral-600 p-2 rounded-md max-h-[90%] overflow-scroll">
				{children}
			</div>
		</div>
	)
}
