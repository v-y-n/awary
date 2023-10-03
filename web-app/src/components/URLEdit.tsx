import {UseFormRegisterReturn} from "react-hook-form"

interface URLEditProps {
	state?: string,
	stateHandler?: (value: string) => void,
	registerMethod?: UseFormRegisterReturn,
	registerUrl?: UseFormRegisterReturn,
	label?: string,
	labelError?: string,
	isValid?: (value: string) => boolean
	value?: string
	onChange?: (value: string) => void
	required?: boolean
	type?: string
	minLength?: number
	className?: string
	inputClassName?: string
}

export default function URLEdit({state,  stateHandler, label, labelError, isValid, registerMethod, registerUrl, value, ...props}: URLEditProps) {

	const inputProps = {
		className: `bg-neutral-700 text-white rounded-r-md p-2 flex-1 min-w-0 ${props.inputClassName}`,
		onChange: ((e: any) => props.onChange && props.onChange(e.target.value)),
		required: props.required,
		type: props.type,
		minLength: props.minLength,
	}

	return (
		<div className={`text-left min-w-0 ${props.className}`}>
			{label && <div className="text-sm mb-1 ml-1">{label}</div>}
			<div className="f-r">
				<select {...registerMethod} className="bg-neutral-700 text-white rounded-l-md p-2 border-r border-r-neutral-500">
					<option value="GET">GET</option>
					<option value="POST">POST</option>
					<option value="PUT">PUT</option>
					<option value="DELETE">DELETE</option>
				</select>
				<input {...inputProps} {...registerUrl}/>
			</div>
			{labelError && <div className="text-red-300">{labelError}</div>}
		</div>
	)
}
