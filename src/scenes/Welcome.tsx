import { children, Component, JSX, onMount } from "solid-js";

import 'keen-slider/keen-slider.min.css'
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

const Welcome: Component = () => {
	let sectionSlider: HTMLDivElement;
	let keenSlider: KeenSliderInstance;

	onMount(() => {
		keenSlider = new KeenSlider(
			sectionSlider, {
			drag: false
		})
	})

	const Slide = (props: { children: JSX.Element }) => {
		return (
			<div class="keen-slider__slide w-full h-full flex items-center p-8 pt-20 pb-20 flex-col
		lg:p-12 lg:pt-10 lg:pb-10">
				{children(() => props.children)}
			</div>
		)
	}

	const Header = ({ title }) => {
		return (
			<header class="text-5xl font-black mb-6 text-center">{title}</header>
		)
	}

	const ActionButton = ({ onClick = undefined, text, active = true, className = "" }) => {
		return (
			<button class={`bg-gradient-to-tr from-brandPink to-brandRed
				text-white p-3 pl-6 pr-6 rounded lg:p-2 lg:pl-5 lg:pr-5
				text-xl font-semibold shadow-xl duration-100 ${active ? `hover:brightness-125 active:scale-110` : `grayscale cursor-default`
				} ${className}`}
				onClick={onClick}>{text}</button>
		)
	}

	const TextField = ({
		className = "",
		label = "",
		placeholder = "",
		type = "text"
	}) => {
		return (
			<label class={`flex flex-col ${className}`}>
				<span class="text-gray-700 uppercase font-semibold mb-2 text-sm">{label}</span>
				<input type={type} placeholder={placeholder} class="rounded bg-black text-white bg-none p-3 lg:p-2 lg:roun outline-none border-black border-2" />
			</label>
		)
	}

	return <main class="w-full h-full bg-blue-600 flex lg:justify-center lg:items-center lg:bg-welcomeHeroLight lg:bg-cover">
		<section class="w-full h-full bg-white dark:bg-black text-black dark:text-white
			lg:w-1/2 lg:h-4/5 xl:w-1/3 lg:rounded lg:shadow-lg lg:mb-12">
			<div ref={sectionSlider} class="keen-slider h-full">
				<Slide>
					<Header title={"Create account"} />
					<p class="text-center text-lg text-gray-600">
						Fill out required details and you'll be ready to go.
					</p>

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

					<section class="mt-auto flex justify-between w-full text-lg">
						<button class="p-3 lg:p-2 text-brandRed active:scale-110 hover:brightness-125 duration-100">I want to sign in</button>
						<ActionButton text={"Create"} active={false} />
					</section>
				</Slide>
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
				<Slide>
					<img src="/images/logos/logo.svg" alt="Berry Logo" class="w-48 mb-2 lg:w-36" />
					<Header title={"Berry"} />

					<p class="text-center text-lg text-gray-600">
						Your <b class="font-semibold">decentralized</b> chat with world-class
						<b class="font-semibold"> security</b> and unrivaled <b class="font-semibold">privacy</b>.
					</p>

					<ActionButton onClick={() => keenSlider.next()} text={"Let's Get Started"} className="mt-auto" />
				</Slide>
			</div>
		</section>
	</main>;
}

export default Welcome;