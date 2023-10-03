import {InputHTMLAttributes, TextareaHTMLAttributes} from "react"
import {UseFormRegisterReturn} from "react-hook-form"

interface LineEditProps {
	state?: string,
	stateHandler?: (value: string) => void,
	register?: UseFormRegisterReturn,
	label?: string,
	labelError?: string,
	isValid?: (value: string) => boolean
	value?: string | number
	onChange?: (value: string) => void
	required?: boolean
	type?: string
	minLength?: number
	multiline?: boolean
	className?: string
	inputClassName?: string
	rows?: number
	cols?: number
}

export default function LineEdit({state,  stateHandler, label, labelError, isValid, register, value, ...props}: LineEditProps) {

	const inputProps: InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> = {
		className: `bg-neutral-700 text-white rounded-md p-2 flex-1 min-w-0 ${props.inputClassName}`,
		onChange: ((e: any) => props.onChange && props.onChange(e.target.value)),
		required: props.required,
		type: props.type,
		minLength: props.minLength,
		rows: props.rows,
		cols: props.cols
	}

	if (!register) {
		inputProps.value = value
	}

	return (
		<div className={`text-left min-w-0 ${props.className}`}>
			{label && <div className="text-sm mb-1 ml-1">{label}</div>}
			<div className="f-r">
				{!props.multiline && <input {...inputProps} {...register}/>}
				{props.multiline && <textarea {...inputProps} {...register}/>}
			</div>
			{labelError && <div className="text-red-300">{labelError}</div>}
		</div>
	)
}
