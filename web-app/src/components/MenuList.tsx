import {HTMLAttributes} from "react";

export function MenuListItem(props: (HTMLAttributes<HTMLDivElement> & {text: string})) {
	
	return (
		<div
			{...props}
			className={`text-left p-4 hover:bg-neutral-700 cursor-pointer rounded-md ${props.className}`}
		>
			{props.text}
		</div>
	)
}

export function MenuList({show, ...props}: (HTMLAttributes<HTMLDivElement> & {show: boolean})) {
	
	return (
		<div
			{...props}
			className={`bg-neutral-900 absolute top-0 left-0 translate-y-[-110%] right-0 w-full rounded-md ${show ? "block" : "hidden"} ${props.className}`}
		>
			{props.children}
		</div>
	)
}
