import moment from "moment";

export function formatTimestamp(timestamp: number): string {
	return moment(timestamp).format("YYYY-MM-DD hh:mm a")
}
