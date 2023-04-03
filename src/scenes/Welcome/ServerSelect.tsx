import { ActionButton, createTextField, Header, Slide, TextField } from "./Shared"

const DEFAULT_PROVIDER = "matrix.org";

export const ServerSelect = (props: {
	onNext?: (domain: string) => void,
	onBack?: () => void,
}) => {
	const [domain, setDomain] = createTextField(DEFAULT_PROVIDER)

	return (
		<Slide>
			<Header title={"Set your provider"} />
			<p class="text-center text-lg text-gray-600">
				Just like in an Email, someone has a <b class="font-semibold">gmail.com</b>, their loved one
				<b class="font-semibold"> yahoo.com</b> and their child an <b class="font-semibold">nuke.africa</b>.
			</p>

			<form class="flex flex-col w-full h-full mt-8" onSubmit={(e) => e.preventDefault()}>
				<TextField className="w-full" autofocus={true}
					label="Domain" placeholder={DEFAULT_PROVIDER}
					minLen={4} default={DEFAULT_PROVIDER} onInput={setDomain} />

				<section class="mt-auto flex justify-center w-full text-lg">
					<ActionButton text={"Continue"} onClick={() => props.onNext(domain().value)} />
				</section>
			</form>
		</Slide>
	)
}