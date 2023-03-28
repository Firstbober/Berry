import { ActionButton, createTextField, Header, Slide, TextField } from "./Shared"

export const SignIn = (props: {
	onNext?: () => void,
	onBack?: () => void,
}) => {
	const [matrixID, setMatrixID] = createTextField()

	return (
		<Slide>
			<Header title={"Sign in"} />
			<p class="text-center text-lg text-gray-600">
				Use your identifier to continue.
			</p>

			<section class="w-full mt-8">
				<TextField className="w-full"
					label="Matrix ID" placeholder="Matrix ID (@yours_truly:example.org)"
					minLen={4} onInput={setMatrixID} />
			</section>

			<section class="mt-auto flex justify-between w-full text-lg">
				<button class="p-3 lg:p-2 text-brandRed active:scale-110 hover:brightness-125 duration-100"
					onClick={props.onBack}>Create account</button>
				{
					matrixID().isValid
						? <ActionButton text={"Next"} active={true} onClick={props.onNext} />
						: <ActionButton text={"Next"} active={false} onClick={props.onNext} />
				}
			</section>
		</Slide>
	)
}