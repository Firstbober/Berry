import { ActionButton, Header, Slide, TextField } from "./Shared"

export const CreateAccount = () => {
	return (
		<Slide>
			<Header title={"Create account"} />
			<p class="text-center text-lg text-gray-600">
				Fill out required details and you'll be ready to go.
			</p>

			<section class="w-full">
				<section class="flex mt-8 w-full">
					<TextField className="w-full"
						label="Username" />
				</section>

				<section class="flex flex-col mt-6 w-full">
					<TextField className="w-full"
						label="Password" type="password" />
					<TextField className="w-full mt-2"
						label="Confirm Password" type="password" />
				</section>

				<section class="flex mt-6 w-full">
					<TextField className="w-full"
						label="Email" type="email" />
				</section>
			</section>

			<section class="mt-auto flex justify-between w-full text-lg">
				<button class="p-3 lg:p-2 text-brandRed active:scale-110 hover:brightness-125 duration-100">I want to sign in</button>
				<ActionButton text={"Create"} active={false} />
			</section>
		</Slide>
	)
}