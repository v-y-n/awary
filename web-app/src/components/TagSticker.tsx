import { TagData } from "../core/Tag"

export function TagSticker({tag}: {tag: TagData}) {
	return (
		<div
			className="border border-neutral-400 rounded-md text-xs py-1 px-4"
			style={{color: tag.color, borderColor: tag.color}}
		>
			{tag.name}
		</div>
	)
}
