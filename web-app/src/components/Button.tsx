import {ButtonHTMLAttributes, useState} from "react";
import Spinner from "./Spinner";

const buttons: {[index: string]: string} = {
	primary: `inline-block px-6 py-2.5 bg-primary text-white font-medium text-xs leading-tight uppercase rounded hover:bg-primary-hover focus:bg-primary focus:outline-none focus:ring-0 active:bg-primary-active transition duration-150 ease-in-out`,
	danger: "inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-0 active:bg-red-800 transition duration-150 ease-in-out",
	light: "inline-block px-6 py-2.5 bg-gray-200 text-gray-700 font-medium text-xs leading-tight uppercase rounded hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-0 active:bg-gray-400 transition duration-150 ease-in-out",
	dark: "inline-block px-6 py-2.5 bg-neutral-800 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none focus:ring-0 active:bg-neutral-900 transition duration-150 ease-in-out",
	"brighter-dark": "inline-block px-6 py-2.5 bg-neutral-700 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none focus:ring-0 active:bg-neutral-900 transition duration-150 ease-in-out",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
	color?: string
	onClickAsync?: () => Promise<void>
	spinner?: boolean
}

export default function Button({text, color, className, onClickAsync, spinner, ...props}: ButtonProps) {
	const colorKey = color ? color : "primary"
	const buttonStyle = buttons[colorKey] ? buttons[colorKey] : buttons.primary
	const [showSpinner, SetShowSnipper] = useState(false)
	
	let onClick = props.onClick

	if (onClickAsync) {
		onClick = async () => {
			SetShowSnipper(true)
			try {
				await onClickAsync()
			} catch (e) {console.error(e)}
			SetShowSnipper(false)
		}
	}

	const shouldShowSpinner = spinner || showSpinner

	return (
		<button {...props} onClick={onClick} className={`${buttonStyle} w-[fit-content] font-bold flex flex-row items-center gap-4 ${className}`} disabled={shouldShowSpinner}>{text} {shouldShowSpinner && <Spinner/>}</button>
	)
}
