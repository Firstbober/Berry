import { Component, onMount } from "solid-js";

import 'keen-slider/keen-slider.min.css'
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

const Welcome: Component = () => {
	let sectionSlider: HTMLDivElement;
	let keenSlider: KeenSliderInstance;

	onMount(() => {
		keenSlider = new KeenSlider(
			sectionSlider, {
			drag: false
		}
		)
	})

	return <main class="w-full h-full bg-blue-600 flex lg:justify-center lg:items-center lg:bg-welcomeHeroLight lg:bg-cover">
		<section class="w-full h-full bg-white dark:bg-black text-black dark:text-white
			lg:w-1/2 lg:h-4/5 lg:rounded-lg lg:shadow-lg lg:mb-12">
			<div ref={sectionSlider} class="keen-slider h-full">
				<div class="keen-slider__slide w-full h-full flex items-center p-8 pt-20 pb-20 flex-col
					lg:p-12 lg:pt-10 lg:pb-10">
					<img src="/images/logos/logo.svg" alt="Berry Logo" class="w-48 mb-2 lg:w-36" />
					<header class="text-5xl font-black mb-6">Berry</header>
					<p class="text-center text-lg text-gray-600">
						Your <b class="font-semibold">decentralized</b> chat with world-class
						<b class="font-semibold"> security</b> and unrivaled <b class="font-semibold">privacy</b>.
					</p>
					<button class="bg-gradient-to-tr from-indigo-700 to-pink-700
					text-white p-3 pl-6 pr-6 rounded mt-auto
					text-xl font-semibold shadow-xl duration-100 hover:brightness-125">Let's Get Started</button>
				</div>
				<div class="keen-slider__slide">
					bbb
				</div>
			</div>
		</section>
	</main>;
}

export default Welcome;