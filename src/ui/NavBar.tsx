import { For, JSX, createEffect, createSignal, onMount } from 'solid-js'

import Swiper from 'swiper'
import 'swiper/css'

/// Tabulated component which handles animations and tab changes with KeenSlider.
const NavBar = (props: {
  icons: [string, string][],
  className?: string,

  children: JSX.Element[]
}) => {
  const [currentTab, setCurrentTab] = createSignal(0)

  let iconContainer: HTMLDivElement
  let sliderContainer: HTMLDivElement
  let swiper: Swiper

  // Create KeenSlider instance and configure it.
  onMount(() => {
    swiper = new Swiper(sliderContainer, {
      allowTouchMove: false,
      on: {
        activeIndexChange: () => {
          setCurrentTab(swiper.activeIndex)
        }
      }
    })

    sliderContainer.style.marginBottom = `calc(${iconContainer.clientHeight}px + ${window.getComputedStyle(iconContainer).marginBottom})`
  })

  createEffect(() => {
    const currentLabel = iconContainer.children[currentTab()] as HTMLElement

    iconContainer.style.setProperty('--left-offset', `${currentLabel.offsetLeft}px`)
    iconContainer.style.setProperty('--bar-width', `${currentLabel.clientWidth}px`)
  })

  return (
    <section class={`w-full h-full flex flex-col ${props.className ? props.className : ''}`}>
      <div ref={sliderContainer} class='w-full h-full overflow-hidden'>
        <div class='swiper-wrapper'>
          {props.children}
        </div>
      </div>

      {/* Container for icon buttons */}
      <div class='absolute w-full z-10 bottom-0'>
        <div ref={iconContainer}
          class='bg-white-100 m-3 mb-4 flex justify-evenly rounded-md shadow-md
            relative after:bg-brandRed after:absolute after:bottom-0 after:h-1
            after:left-[var(--left-offset)] after:w-[var(--bar-width)] after:rounded after:duration-[250ms]'>
          <For each={props.icons}>{(icon, idx) =>
            <button
              class={`w-full flex justify-center pb-4 pt-4 ${
                currentTab() == idx()
                  ? 'text-black'
                  : 'text-white-500'
              }`}
              onClick={() => { swiper.slideTo(idx()) }}
            ><img src={currentTab() == idx() ? icon[1] : icon[0]} class='contrast-75 h-6' /></button>
          }</For>
        </div>
      </div>
    </section>
  )
}

export default NavBar
