import { ActionButton, Header, Slide } from "./Shared"

const Error = (props: {
	onNext?: () => void,
	onBack?: () => void,
	message: string,
}) => {
	return (
		<Slide>
			<Header title={"Sorry ;("} />
			<p class="text-center text-xl text-gray-600 mt-4">
				{props.message}
			</p>
			<section class="mt-auto flex justify-center w-full text-lg">
				<ActionButton text={"Go back"} onClick={props.onBack} />
			</section>
		</Slide>
	)
}

export default Error;