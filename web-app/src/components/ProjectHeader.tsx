import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { Project } from "../core/Project";
import { useModal } from "../services/ModalService";
import { copyToClipboard } from "../utils/copyToClipboard";

type ProjectHeaderProps = {
	project: Project
	middle?: JSX.Element
	right?: JSX.Element
}

export default function ProjectHeader({project, middle, right}: ProjectHeaderProps) {
	const modalService = useModal();
	return (
		<div className="f-r pb-4 border-b border-b-neutral-500">
			<div className="flex-1 f-r items-center gap-2 text-left text-2xl">
				<h2 className="text-3xl">{project.name}</h2>
				<ClipboardCopyIcon
					className="w-4 h-4 cursor-pointer"
					onClick={() => {
						copyToClipboard(project.id)
						modalService.info("Project id copied to clipboard")
					}}
				/>
			</div>
			<div className="flex-1 f-c justify-center">{middle}</div>
			<div className="flex-1 f-c justify-center">{right}</div>
		</div>
	)
}
