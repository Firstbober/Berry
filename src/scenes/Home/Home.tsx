/* @refresh reload */

import { For, onMount } from 'solid-js'
import { useLoadingContext } from '../../App'

export const Home = () => {
  const [{ setLoadingScreen }] = useLoadingContext()

  onMount(() => {
    setLoadingScreen(false)
  })

  return <main class='w-full h-full bg-white text-black relative flex flex-col'>
    <section class='max-h-full w-full relative flex flex-col flex-grow items-center pr-3 pl-3'>
      <section class='mt-6 w-full flex'>
        <input placeholder={'Search in friends and channels'}
          class={'rounded bg-white-200 text-white-700 placeholder-white-500 bg-none p-2 lg:p-2 lg:roun outline-none border-2 border-white-200 w-full'}
        />
        <div class='flex ml-2 rounded'>
          <button class='flex items-center justify-center'><img src="/icons/remixicon/search-line.svg" class='contrast-75 w-7 h-7 mr-6 ml-6' /></button>
          <button class='flex items-center justify-center'><img src="/icons/remixicon/add-line.svg" class='contrast-75 w-7 h-7 mr-6 ml-6' /></button>
          <button class='flex items-center justify-center '><img src="/icons/remixicon/compass-3-line.svg" class='contrast-75 w-7 h-7 mr-6 ml-6' /></button>
        </div>
      </section>
      <section class='flex flex-col max-h-full w-full flex-grow mt-3'>
        <section class='flex w-full'>
          <button class='text-lg p-3 pl-6 pr-6 relative font-semibold after:bg-brandRed after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded'>Friends</button>
          <button class='text-lg p-3 pl-6 pr-6 relative font-semibold text-white-500 '>Invites</button>
        </section>
        <section class='w-full h-full relative'>
          <section class='flex flex-col absolute h-full w-full overflow-y-auto pt-2'>
          <For each={new Array(10)}>{(_, __) =>
              <button class='p-3 text-black flex max-w-full border-b border-white-100 last:border-none'>
                <div class='mr-4 min-w-12 min-h-12 flex-shrink-0 relative'>
                  <img src="https://picsum.photos/200" class='object-cover w-12 h-12 rounded-full' />
                  <div class='rounded-full w-4 h-4 bg-gradient-to-tr from-brandRed to-brandPink border-2 border-white absolute right-0 bottom-0'></div>
                </div>
                <div class='flex flex-col items-start min-w-0'>
                  <header class='font-semibold'>Gustavo Smith</header>
                  <span class='text-white-500 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full'>Have started the conversation</span>
                </div>
              </button>
          }</For>
          </section>
        </section>
      </section>
    </section>

    {/* Bottom action bar */}
    <div class='z-10 bottom-0 w-full'>
      <div class='bg-white-100 m-3 mb-4 flex justify-evenly rounded-md shadow-md relative'>
        <button class='w-full flex justify-center after:content[""] after:bg-brandRed after:absolute after:bottom-0 after:h-1 after:w-12 after:rounded pb-4 pt-4'>
          <img src="/icons/remixicon/home-fill.svg" class='contrast-75 h-6' />
        </button>
        <button class='w-full flex justify-center pb-4 pt-4'>
          <img src="/icons/remixicon/chat-1-line.svg" class='contrast-75 h-6' />
        </button>
        <button class='w-full flex justify-center pb-4 pt-4'>
          <img src="/icons/remixicon/user-3-line.svg" class='contrast-75 h-6' />
        </button>
      </div>
    </div>

  </main>
}

export default Home
