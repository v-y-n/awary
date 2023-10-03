import {createContext, useCallback, useContext, useState} from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";

type cb = (close: any) => JSX.Element

export interface ModalContextProps {
	modals: JSX.Element[]
	addModal: (cb: cb) => void
	info: (description: string) => void
	error: (description: string) => void
	confirmation: (description: string, onConfirmation: () => void) => void
	closeLast: () => void
}

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)
const value: ModalContextProps = {} as ModalContextProps // See comments below

export function ModalServiceProvider({children}: any) {

	const [modals, setModals] = useState<JSX.Element[]>([])

	const closeCurrentModal = () => {
		modals.splice(-1, 1)
		setModals([...modals])
	}
	
	const addModal = (cb: cb) => {
		const content = cb(() => {value.closeLast()});
		setModals([...modals, content])
	}

	const error = (description: string) => {
		addModal((close) => <p>{description}</p>)
	}

	const confirmation = (description: string, onConfirmation: () => void) => {
		addModal((close) =>
			<div className="f-c gap-4">
				<p className="text-left">{description}</p>
				<div className="f-r gap-2">
				<Button text="Delete" color="danger" className="ml-auto" onClick={() => {
					onConfirmation()
					close()
				}}/>
				<Button text="Cancel" onClick={close}/>
				</div>
			</div>	
	)}

	
	
	// Because this function is designed to be used with nested modals, we must ensure that the "root" object is the
	// same and wont change so the updated functions (addModal) is called
	value.modals = modals;
	value.addModal = addModal;
	value.info = error;
	value.error = error;
	value.confirmation = confirmation;
	value.closeLast = closeCurrentModal

	return (
		<ModalContext.Provider value={value}>
			{children}
			{modals.map((modal, index) => 
				<Modal
					key={index}
					customId={`modal-${index}`}
					show={modals.length > 0}
					onClose={index === modals.length - 1 ? () => {closeCurrentModal()} : () => {}}
					ignoreInputs={index != modals.length - 1}
				>
					{modal}
				</Modal>
			)}
		</ModalContext.Provider>
	)
}

export function useModal() {
	return useContext(ModalContext);
}
