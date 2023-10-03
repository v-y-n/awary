import {TinyLogCard} from "../../components/LogCard";
import {Log} from "../../core/Log";
import {Project} from "../../core/Project";

interface LogsTabProps {
	className?: string
	project: Project
	logs: Log[]
}

export default function LogsTab({project, logs, className}: LogsTabProps) {
	return (
		<div className={`bg-neutral-600 rounded-md ${className}`}>
			<div className="f-c gap-2 m-2">
				<p className="text-left font-bold mb-4">Logs</p>
				{logs.map(log => <TinyLogCard key={log.id} project={project} log={log}/>)}
			</div>
		</div>
	)
}
