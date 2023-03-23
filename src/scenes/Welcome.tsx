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

	return <main class="w-full h-full">
		<section ref={sectionSlider} class="w-full h-full bg-white dark:bg-black text-black dark:text-white keen-slider">
			<div class="keen-slider__slide w-full h-full flex items-center p-8 pt-20 pb-20 flex-col">
				<img src="/images/logos/logo.svg" alt="Berry Logo" class="w-48 mb-2" />
				<header class="text-5xl font-black mb-6">Berry</header>
				<p class="text-center text-lg text-gray-600">
					Your <b>decentralized</b> chat with world-class <b>security</b> and unrivaled <b>privacy</b>
				</p>
				<button class="bg-gradient-to-tr from-indigo-700 to-pink-700
					text-white p-3 pl-5 pr-5 rounded mt-auto
					text-xl font-bold uppercase hover:brightness-10">Let's Get Started</button>
			</div>
			<div class="keen-slider__slide">
				bbb
			</div>
		</section>
	</main>;
}

export default Welcome;