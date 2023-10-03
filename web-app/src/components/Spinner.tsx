export interface SpinnerProps {
	size?: number
}

export default function Spinner({size = 3}: SpinnerProps) {
	return (
		<div className="flex justify-center items-center">
		  <div className="spinner-border animate-spin inline-block border-2 rounded-full" role="status" style={{width: size, height: size}}>
			<span className="visually-hidden">Loading...</span>
		  </div>
		</div>
	)
}
