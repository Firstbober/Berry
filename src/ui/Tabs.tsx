import { For, JSX, createEffect, createSignal, onMount } from 'solid-js'

import Swiper from 'swiper'
import 'swiper/css'

/// Generic Tab component for wrapping all the classes required for smooth sailing with KeenSlider.
export const Tab = (props: {
  children?: JSX.Element,
  className?: string
}) => {
  return <section class={`swiper-slide h-full w-full ${props.className ? props.className : ''}`}>
    {props.children}
  </section>
}

export interface TabsController {
  moveToIdx: (idx: number) => void,
  currentTab: () => number
}

export const useTabsController = (): TabsController => {
  return {
    moveToIdx: () => null,
    currentTab: () => null
  }
}

/// Tabulated component which handles animations and tab changes with KeenSlider.
export const Tabs = (props: {
  labels?: string[],
  className?: string,
  controller?: TabsController,

  onTabChange?: (idx: number) => void,

  children: JSX.Element[]
}) => {
  // We need to check if the amount of labels is synonymous with the amount of tabs.
  if (props.labels) {
    if (props.labels.length != props.children.length) {
      throw new Error("Labels and children doesn't match")
    }
  }

  const [currentTab, setCurrentTab] = createSignal(0)

  let labelContainer: HTMLDivElement
  let sliderContainer: HTMLDivElement
  let swiper: Swiper

  // Create KeenSlider instance and configure it.
  onMount(() => {
    swiper = new Swiper(sliderContainer, {
      allowTouchMove: true,
      on: {
        activeIndexChange: () => {
          setCurrentTab(swiper.activeIndex)
          if (props.onTabChange) { props.onTabChange(swiper.activeIndex) }
        }
      }
    })

    if (props.controller) {
      props.controller.moveToIdx = (idx) => {
        swiper.slideTo(idx)
      }
      props.controller.currentTab = () => {
        return currentTab()
      }
    }
  })

  // As we allow the labels to not be renderer, we don't need to make
  // an effect for the animations.
  if (props.labels) {
    createEffect(() => {
      const currentLabel = labelContainer.children[currentTab()] as HTMLElement

      labelContainer.style.setProperty('--left-offset', `${currentLabel.offsetLeft}px`)
      labelContainer.style.setProperty('--bar-width', `${currentLabel.clientWidth}px`)
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
              currentTab() == idx()
                ? 'text-black'
                : 'text-white-500'
            }`}
            onClick={() => {
              swiper.slideTo(idx())
            }}
          >{label}</button>
        }</For>
      </div>

      <div ref={sliderContainer} class='w-full h-full overflow-hidden'>
        <div class='swiper-wrapper'>
          {props.children}
        </div>
      </div>
    </section>
  )
}
