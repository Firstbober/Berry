import { For, JSX, createEffect, createSignal, onMount } from 'solid-js'

import 'keen-slider/keen-slider.min.css'
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

/// Generic Tab component for wrapping all the classes required for smooth sailing with KeenSlider.
export const Tab = (props: {
  children?: JSX.Element,
  className?: string
}) => {
  return <section class={`keen-slider__slide h-full ${props.className ? props.className : ''}`}>
    {props.children}
  </section>
}

/// Tabulated component which handles animations and tab changes with KeenSlider.
export const Tabs = (props: {
  labels?: string[],
  className?: string,

  children: JSX.Element[]
}) => {
  // We need to check if the amount of labels is synonymous with the amount of tabs.
  if (props.labels) {
    if (props.labels.length != props.children.length) {
      throw new Error("Labels and children doesn't match")
    }
  }

  const [currentTab, setCurrentTab] = createSignal({ v: 0, external: false })

  let labelContainer: HTMLDivElement
  let sliderContainer: HTMLDivElement
  let keenSlider: KeenSliderInstance

  // Create KeenSlider instance and configure it.
  onMount(() => {
    keenSlider = new KeenSlider(
      sliderContainer, {
        drag: true,
        renderMode: 'performance'
      }
    )

    keenSlider.on('slideChanged', () => {
      if (keenSlider.track.details.abs != currentTab().v) { setCurrentTab({ v: keenSlider.track.details.abs, external: true }) }
    })
  })

  // As we allow the labels to not be renderer, we don't need to make
  // an effect for the animations.
  if (props.labels) {
    createEffect(() => {
      const currentLabel = labelContainer.children[currentTab().v] as HTMLElement

      labelContainer.style.setProperty('--left-offset', `${currentLabel.offsetLeft}px`)
      labelContainer.style.setProperty('--bar-width', `${currentLabel.clientWidth}px`)

      if (!currentTab().external) { keenSlider.moveToIdx(currentTab().v) }
    })
  }

  return (
    <section class={`w-full h-full flex flex-col ${props.className ? props.className : ''}`}>
      {/* Container for label buttons */}
      <div ref={labelContainer}
        class='relative after:bg-brandRed after:absolute after:bottom-0 after:h-0.5
          after:left-[var(--left-offset)] after:w-[var(--bar-width)] after:rounded after:duration-[250ms]
          h-min'>
        <For each={props.labels}>{(label, idx) =>
          <button
            class={`text-lg p-3 pl-6 pr-6 relative font-semibold ${
              currentTab().v == idx()
                ? 'text-black'
                : 'text-white-500'
            }`}
            onClick={[setCurrentTab, { v: idx(), external: false }]}
          >{label}</button>
        }</For>
      </div>

      <div ref={sliderContainer} class='keen-slider h-full'>
        {props.children}
      </div>
    </section>
  )
}
