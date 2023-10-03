import {HTMLAttributes, ReactElement} from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
	header?: string | ReactElement<any, any>
	hideSeparator?: boolean
	className?: string
	onClick?: () => void
}

export default function Card({header, hideSeparator, children, onClick, className}: CardProps) {

	return (
		<div
			className={`bg-neutral-600 rounded-md text-left p-4 ${className}`}
			onClick={() => {onClick?.()}}
		>
			{header && <>
				<div className="text-xl bg-neutral-600">{header}</div>
				{!hideSeparator && <div className="border-b border-b-neutral-500 my-4"/>}
			</>}
			<div>
				{children}
			</div>
		</div>
   )
}
