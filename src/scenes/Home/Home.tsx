/* @refresh reload */

import { onMount } from 'solid-js'
import { useLoadingContext } from '../../App'

export const Home = () => {
  const [{ setLoadingScreen }] = useLoadingContext()

  onMount(() => {
    setLoadingScreen(false)
  })

  return <main class='w-full h-full bg-white text-black relative'>
    {/* Bottom action bar */}
    <div class='z-10 absolute bottom-0 w-full'>
      <div class='bg-white-100 m-3 mb-4 flex justify-evenly rounded-md shadow-md relative'>
        <button class='w-full flex justify-center after:content[""] after:bg-brandRed after:absolute after:bottom-0 after:h-1 after:w-12 pb-4 pt-4'>
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
    <section class='h-full w-full relative flex flex-col items-center'>
      <section class='mt-6 w-full pr-3 pl-3 flex'>
        <input placeholder={'Search in friends and channels'}
          class={'rounded bg-black text-white bg-none p-2 lg:p-2 lg:roun outline-none border-2 border-black w-full'}
        />
        <div class='flex ml-2 border rounded border-black'>
          <button class='flex items-center justify-center border-r border-black'><img src="/icons/remixicon/search-line.svg" class='contrast-75 w-6 h-6 mr-5 ml-5' /></button>
          <button class='flex items-center justify-center border-r border-black'><img src="/icons/remixicon/add-line.svg" class='contrast-75 w-6 h-6 mr-5 ml-5' /></button>
          <button class='flex items-center justify-center '><img src="/icons/remixicon/compass-3-line.svg" class='contrast-75 w-6 h-6 mr-5 ml-5' /></button>
        </div>
      </section>
    </section>
  </main>
}

export default Home
