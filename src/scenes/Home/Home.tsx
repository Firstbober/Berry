/* @refresh reload */

import { onMount } from 'solid-js'

import { useLoadingContext } from '../../App'
import { Tabs } from '../../ui/Tabs'

import Invites from './Home/Invites'
import Friends from './Home/Friends'

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

      <Tabs labels={['Friends', 'Invites']} className='mt-1'>
        <Friends />
        <Invites />
      </Tabs>
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
