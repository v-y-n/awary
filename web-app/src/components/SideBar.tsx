import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useApi} from "../api";
import AppName from "./AppName";
import {MenuList, MenuListItem} from "./MenuList";
import {CollectionIcon} from "@heroicons/react/outline"

const topSide = [
	{
		name: "Projects",
		icon: CollectionIcon,
		route: "/projects"
	}
]

export default function SideBar() {
	const api = useApi();
	const navigate = useNavigate()
	const [showMenu, setShowMenu] = useState(false)

	if (!api.IsLogged()) {
		return null;
	}

	return (
		<div className="bg-neutral-800 p-4 flex flex-col justify-between items-center gap-2">
			<div className="f-c flex-1 justify-start">
				<Link to={api.IsLogged() ? "/projects" : "/"} className="mb-8">
					<AppName/>
				</Link>
				{topSide.map(elem => (
					<Link key={elem.route} to={elem.route} className="f-r items-center gap-4 p-4 hover:bg-neutral-600 rounded-md duration-200">
						<elem.icon className="w-8 h-8"/>
						<div className="text-xl">{elem.name}</div>
					</Link>)
				)}
			</div>
			<div className="flex-1 flex flex-col items-center justify-end">
				{
					api.GetUserData() ? 
						<>
							<div className="p-1 px-2 border border-neutral-500 rounded-md relative">
								<div className="cursor-pointer" onClick={() => { setShowMenu(!showMenu) }}>
									{api.GetUserData().email}
								</div>
								<MenuList show={showMenu}>
									{/*<MenuListItem text="Account settings" onClick={() => { console.log("Account settings") }}/>*/}
									<MenuListItem text="Logout" onClick={async () => {
										await api.Logout();
										navigate("/")
									}}/>
								</MenuList>
							</div>
						</>
					: ""
				}
			</div>
		</div>
	)
}
