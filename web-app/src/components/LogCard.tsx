import {TrashIcon} from "@heroicons/react/outline";
import moment from "moment";
import {useState} from "react";
import {useApi} from "../api";
import {Log} from "../core/Log";
import {Project} from "../core/Project";
import {TagSticker} from "./TagSticker";
import {useModal} from "../services/ModalService";
import {formatTimestamp} from "../utils/formatTimestamp";

export type LogCardProps = {
	project: Project
	log: Log
	onDelete?: () => void
}

export function LogCard({log, project, onDelete}: LogCardProps) {
	const [showContent, setShowContent] = useState(false);
	const modalService = useModal()
	const api = useApi()

	const deleteLog = () => {
		modalService.confirmation("Delete the log ?", async () => {
			await api.deleteLog(log.projectId, log.id)
			onDelete && onDelete();
		})
	}

	return (
		<div className="card p-4 cursor-pointer" onClick={() => {setShowContent(true)}}>
			<div className="f-c gap-2" >
				<div className="f-r gap-4 items-center">
					<span className="text-xl">{log.title}</span>
					<div className="f-r gap-2">
						{log.tags.map(tag => <TagSticker tag={tag}/>)}	
					</div>
					<span className="text-neutral-400 text-sm ml-auto">
						{formatTimestamp(log.createdAt)}
					</span>
					<TrashIcon
						className="w-4 h-4 text-red-300 cursor-pointer"
						onClick={deleteLog}
					/>
				</div>
			</div>
			{showContent && <p className="text-sm text-left pt-4">{log.content}</p>}	
		</div>
	)
}

export function TinyLogCard({log, project}: LogCardProps) {

	let borderStyle = {}
	if (log.tags.length > 0) {
		borderStyle = {borderLeftColor: `${log.tags[0].color}`}
	}

	return (
		<div className="f-c gap-2">
			<div className="f-r items-stretch">
				<div className="border-l-2 border-neutral-500 pr-2" style={borderStyle}/>
				<p>{log.title}</p>
				<p className='mt-auto ml-auto text-xs text-neutral-400'>{moment(log.createdAt).format("YYYY-MM-DD hh:mm a")}</p>
			</div>
			<div className="w-full border-b border-neutral-500"/>
		</div>
		
	)
}
