import { children, createSignal, JSX } from "solid-js";

export const Slide = (props: { children: JSX.Element }) => {
	return (
		<div class="keen-slider__slide w-full h-full flex items-center p-8 pt-16 pb-16 flex-col
	lg:p-12 lg:pt-10 lg:pb-10">
			{children(() => props.children)}
		</div>
	)
}

export const Header = ({ title }) => {
	return (
		<header class="text-4xl font-black mb-6 text-center">{title}</header>
	)
}

export const ActionButton = ({ onClick = undefined, text, active = true, className = "" }) => {
	return (
		<button class={`bg-gradient-to-tr from-brandPink to-brandRed
			text-white p-3 pl-6 pr-6 rounded lg:p-2 lg:pl-5 lg:pr-5
			text-xl font-semibold shadow-xl duration-100 ${active ? `hover:brightness-125 active:scale-110` : `grayscale cursor-default`
			} ${className}`}
			onClick={onClick}>{text}</button>
	)
}

export const TextField = ({
	className = "",
	label = "",
	placeholder = "",
	type = "text"
}) => {
	const [value, setValue] = createSignal("")
	const isValid = true

	return (
		<label class={`flex flex-col ${className}`}>
			<span class="text-gray-700 uppercase font-semibold mb-2 text-sm">{label}</span>
			<input type={type} placeholder={placeholder} onInput={(event) => {
				setValue((event.target as HTMLInputElement).value)
			}} class={`rounded bg-black text-white bg-none p-3 lg:p-2 lg:roun outline-none border-2 ${isValid ? `border-black` : `border-red-500`
				}`} />
			{
				isValid
					? <></>
					: <span class="text-red-600 font-semibold text-sm">{label} is not valid</span>
			}
		</label>
	)
}
