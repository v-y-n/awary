import {useState} from "react"

interface TabsProps {
	tabs: {
		name: string,
		renderer: JSX.Element
	}[]
}

export default function Tabs({tabs}: TabsProps) {

	const [selectedTab, SetSelectedTab] = useState(0)

	const selectedButtonClassName = "border-b border-b-app-primary text-awary-primary box-border p-4 cursor-pointer"
	const unselectedButtonClassName = "border-b border-neutral-600 box-border p-4 cursor-pointer"

	const bar = tabs.map((tab, index) => 
		<div
			key={index} 
			className={index === selectedTab ? selectedButtonClassName : unselectedButtonClassName}
			onClick={() => {SetSelectedTab(index)}}
		>
			{tab.name}
		</div>
	)

	return (
		<>
			<div className="flex flex-row border-b border-b-neutral-500">
				{bar}
			</div>
			<div>
				{tabs[selectedTab].renderer}
			</div>
		</>
	)
}
