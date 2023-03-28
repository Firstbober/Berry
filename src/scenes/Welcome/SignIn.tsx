import { ActionButton, createTextField, Header, SecondaryButton, Slide, TextField } from "./Shared"

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
				<SecondaryButton onClick={props.onBack} text={"Create account"} />
				{
					matrixID().isValid
						? <ActionButton text={"Next"} active={true} onClick={props.onNext} />
						: <ActionButton text={"Next"} active={false} onClick={props.onNext} />
				}
			</section>
		</Slide>
	)
}