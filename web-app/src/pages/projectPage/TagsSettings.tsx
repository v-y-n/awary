import {TrashIcon} from "@heroicons/react/outline"
import {useState} from "react"
import Button from "../../components/Button"
import Card from "../../components/Card"
import LineEdit from "../../components/Input"
import {TagData} from "../../core/Tag"
import {useModal} from "../../services/ModalService"
import {TagForm} from "./forms/TagForm"

function clone<T>(x: T): T {
	return JSON.parse(JSON.stringify(x))
}

interface TagsSettingsProps {
	tags: TagData[]
	onSave: (tags: TagData[]) => void
}

export function TagsSettings({tags: originalTags, onSave}: TagsSettingsProps) {
	const modalService = useModal()

	const [tags, setTags] = useState(originalTags)

	const addTag = (tag: TagData) => {
		const newTags = clone(tags)
		newTags.push(tag)
		setTags(newTags)
	}

	const deleteTag = (tag: TagData) => {
		const newTags = clone(tags).filter(newTags => newTags.id !== tag.id)
		setTags(newTags)
	}

	const saveTags = async () => {
		onSave(tags);
	}

	const header = 
		<div className="f-r justify-between gap-4">
			<h2>Tags</h2>
			<Button
				text="Create tag"
				onClick={() => {modalService.addModal((close) => <TagForm close={close} onCreate={addTag}/>)}}
			/>
		</div>

	const setNameOfTag = (tagIndex: number, name: string) => {
		const newTags = clone(tags)
		newTags[tagIndex].name = name
		setTags(newTags)
	}

	const setColorOfTag = (tagIndex: number, color: string) => {
		const newTags = clone(tags)
		newTags[tagIndex].color = color
		setTags(newTags)
	}

	return (
		<div className="f-c gap-4 flex-1">
			<Card header={header}>
				<div className="f-c gap-4">
					{tags.map((tag, tagIndex) =>
						<div className="f-c gap-1">
							<div key={tagIndex} className="f-r items-center gap-2">
								<LineEdit value={tag.name} onChange={(value) => {setNameOfTag(tagIndex, value)}}/>
								<input type="color" value={tag.color} onChange={(event) => {setColorOfTag(tagIndex, event.target.value)}}/>
								<TrashIcon
									className="w-4 h-4 text-red-300 cursor-pointer"
									// I need setTimeout or the modal will close itself, need to investigate 
									onClick={() => {setTimeout(() => {deleteTag(tag)}, 0)}}
								/>
							</div>
							<div className="px-1 opacity-25 text-xs">
								id: {tag.id || "Id will appear after creation"}
							</div>
						</div>
					)}
					<Button text="Save" onClick={saveTags}/>
				</div>
			</Card>
		</div>
	)
}
