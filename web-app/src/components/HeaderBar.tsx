import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useApi} from "../api";
import AppName from "./AppName";
import {MenuList, MenuListItem} from "./MenuList";

export default function HeaderBar() {
	const api = useApi();
	const navigate = useNavigate()
	const [showMenu, setShowMenu] = useState(false)

	if (!api.IsLogged()) {
		return null;
	}

	return (
		<div className="bg-neutral-800 py-4 f-r justify-between items-center gap-2 px-0 xl:px-96">
			<div className="f-r flex-1 justify-start">
				<Link to={api.IsLogged() ? "/projects" : "/"}>
					<AppName/>
				</Link>
			</div>
			<div className="flex-1 f-r items-center justify-end">
				{
					api.GetUserData() ? 
						<>
							<div className="p-1 px-2 border border-neutral-500 rounded-md relative">
								<div className="cursor-pointer" onClick={() => { setShowMenu(!showMenu) }}>
									{api.GetUserData().email}
								</div>
								<MenuList show={showMenu}>
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
