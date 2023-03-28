import { ActionButton, Header, SecondaryButton, Slide, TextField } from "./Shared"

export const ServerSelect = (props: {
	onNext?: () => void,
	onBack?: () => void,
}) => {
	return (
		<Slide>
			<Header title={"Set your provider"} />
			<p class="text-center text-lg text-gray-600">
				Just like in an Email, someone has a <b class="font-semibold">gmail.com</b>, their loved one
				<b class="font-semibold"> yahoo.com</b> and their child an <b class="font-semibold">nuke.africa</b>.
			</p>

			<section class="w-full mt-8">
				<TextField className="w-full"
					label="Domain" placeholder="matrix.org"
					minLen={4} default={"matrix.org"} />
			</section>

			<section class="mt-auto flex justify-between w-full text-lg">
				<SecondaryButton text={"I want to sign in"} onClick={props.onBack} />
				<ActionButton text={"Next"} onClick={props.onNext} />
			</section>
		</Slide>
	)
}