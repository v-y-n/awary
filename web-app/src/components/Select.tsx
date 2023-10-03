import {SelectHTMLAttributes} from "react"
import {UseFormRegisterReturn} from "react-hook-form"

interface LineEditProps extends SelectHTMLAttributes<HTMLSelectElement>  {
	register?: UseFormRegisterReturn,
	label?: string,
	labelError?: string,
	isValid?: (value: string) => boolean
	children: JSX.Element | JSX.Element[]
}

export default function Select({children, label, labelError, isValid, register, ...props}: LineEditProps) {
	let labelDiv = null
	if (label) {
		labelDiv = <div className="text-sm mb-1 ml-1">{label}</div>
	}

	let labelErrorDiv = null
	if (labelError) {
		labelErrorDiv = <div className="text-red-300">{labelError}</div>
	}

	return (
		<div className="text-left">
			{labelDiv}
			<select {...props} {...register} className="bg-neutral-700 text-white rounded-md p-2">
				{children}
			</select>
			{labelErrorDiv}
		</div>
	)
}
