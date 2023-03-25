import { ActionButton, Header, Slide, TextField } from "./Shared"

export const SignIn = () => {
	return (
		<Slide>
			<Header title={"Sign in"} />
			<p class="text-center text-lg text-gray-600">
				Use your identifier to continue.
			</p>

			<section class="w-full mt-8">
				<TextField className="w-full"
					label="Matrix ID" placeholder="Matrix ID (@yours_truly:example.org)" />
			</section>

			<section class="mt-auto flex justify-between w-full text-lg">
				<button class="p-3 lg:p-2 text-brandRed active:scale-110 hover:brightness-125 duration-100">Create account</button>
				<ActionButton text={"Next"} active={false} />
			</section>
		</Slide>
	)
}