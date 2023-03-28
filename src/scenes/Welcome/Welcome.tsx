import { Component, onMount } from "solid-js";

import 'keen-slider/keen-slider.min.css'
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

import { CreateAccount } from "./CreateAccount";
import { SignIn } from "./SignIn";
import { ActionButton, Header, Slide } from "./Shared";
import { ServerSelect } from "./ServerSelect";

const Welcome: Component = () => {
	let sectionSlider: HTMLDivElement;
	let keenSlider: KeenSliderInstance;

	onMount(() => {
		keenSlider = new KeenSlider(
			sectionSlider, {
			drag: false
		})
	})

	return <main class="w-full h-full bg-blue-600 flex lg:justify-center lg:items-center lg:bg-welcomeHeroLight lg:bg-cover">
		<section class="w-full h-full bg-white dark:bg-black text-black dark:text-white
			lg:w-1/2 lg:h-4/5 xl:w-1/3 lg:rounded lg:shadow-lg lg:mb-12">
			<div ref={sectionSlider} class="keen-slider h-full">
				<Slide>
					<img src="/images/logos/logo.svg" alt="Berry Logo" class="w-48 mb-2 lg:w-36" />
					<Header title={"Berry"} />

					<p class="text-center text-lg text-gray-600">
						Your <b class="font-semibold">decentralized</b> chat with world-class
						<b class="font-semibold"> security</b> and unrivaled <b class="font-semibold">privacy</b>.
					</p>

					<ActionButton onClick={() => keenSlider.moveToIdx(1)} text={"Let's Get Started"} className="mt-auto" />
				</Slide>

				<SignIn onBack={() => keenSlider.moveToIdx(2)} />

				<ServerSelect onBack={() => keenSlider.moveToIdx(1)} onNext={() => keenSlider.moveToIdx(3)} />
				<CreateAccount onBack={() => keenSlider.moveToIdx(2)} />
			</div>
		</section>
	</main>;
}

export default Welcome;