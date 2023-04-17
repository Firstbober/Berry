import { For, JSX, createEffect, createSignal, onMount } from 'solid-js'

import 'keen-slider/keen-slider.min.css'
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

/// Generic Tab component for wrapping all the classes required for smooth sailing with KeenSlider.
export const NavTab = (props: {
  children?: JSX.Element,
  className?: string
}) => {
  return <section class={`navbar__tab min-w-full h-full ${props.className ? props.className : ''}`}>
    {props.children}
  </section>
}

/// Tabulated component which handles animations and tab changes with KeenSlider.
const NavBar = (props: {
  icons: [string, string][],
  className?: string,

  children: JSX.Element[]
}) => {
  const [currentTab, setCurrentTab] = createSignal({ v: 0, external: false })

  let iconContainer: HTMLDivElement
  let sliderContainer: HTMLDivElement
  let keenSlider: KeenSliderInstance

  // Create KeenSlider instance and configure it.
  onMount(() => {
    keenSlider = new KeenSlider(
      sliderContainer, {
        drag: false,
        renderMode: 'performance',
        selector: '.navbar__tab'
      }
    )
  })

  createEffect(() => {
    const cTv = currentTab().v
    const currentLabel = iconContainer.children[cTv] as HTMLElement

    if (currentLabel == undefined) return

    iconContainer.style.setProperty('--left-offset', `${currentLabel.offsetLeft + (currentLabel.clientWidth / 4)}px`)
    iconContainer.style.setProperty('--bar-width', `${currentLabel.clientWidth / 2}px`)

    keenSlider.moveToIdx(cTv)
  })

  return (
    <section class={`w-full h-full flex flex-col ${props.className ? props.className : ''}`}>
      <div ref={sliderContainer} class='keen-slider h-full w-full max-w-full'>
        {props.children}
      </div>

      {/* Container for icon buttons */}
      <div ref={iconContainer}
        class='bg-white-100 m-3 mb-4 flex justify-evenly rounded-md shadow-md
          relative after:bg-brandRed after:absolute after:bottom-0 after:h-1
          after:left-[var(--left-offset)] after:w-[var(--bar-width)] after:rounded after:duration-[250ms]'>
        <For each={props.icons}>{(icon, idx) =>
          <button
            class={`w-full flex justify-center pb-4 pt-4 ${
              currentTab().v == idx()
                ? 'text-black'
                : 'text-white-500'
            }`}
            onClick={[setCurrentTab, { v: idx(), external: true }]}
          ><img src={currentTab().v == idx() ? icon[1] : icon[0]} class='contrast-75 h-6' /></button>
        }</For>
      </div>
    </section>
  )
}

export default NavBar
