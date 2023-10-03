import {useState} from "react"

interface SideMenuProps {
	items: {
		label: string
	}[]
	onChange: (index: number) => void
}

export function SideMenu({items, onChange}: SideMenuProps) {

	
	const [selectedIndex, setSelectedIndex] = useState(0)

	return (
		<div>
			<div className="f-c p-2 gap-2 bg-neutral-600 rounded-md text-left cursor-pointer">
				{items.map((item, index) => {
					return ( 
						<div
							key={index}
							className={index === selectedIndex
								? "bg-neutral-500 p-1 px-2 rounded-md whitespace-nowrap"
								: "p-1 px-2 hover:bg-neutral-500 duration-100 rounded-md whitespace-nowrap"}
							onClick={() => {
								setSelectedIndex(index)
								onChange(index)
							}}>{item.label}
						</div>
					)
				})}
			</div>
		</div>
	)
}
