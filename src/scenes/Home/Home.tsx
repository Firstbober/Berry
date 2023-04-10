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
      <div class='bg-gray-300 m-4 mb-6 flex justify-evenly rounded-md shadow-md'>
        <button class='border-brandRed border-b-4 pb-3 pt-3'><img src="/icons/remixicon/home-fill.svg" class='contrast-75 h-10' /></button>
        <button class='border-transparent border-b-4 pb-3 pt-3'><img src="/icons/remixicon/chat-1-line.svg" class='contrast-75 h-10' /></button>
        <button class='border-transparent border-b-4 pb-3 pt-3'><img src="/icons/remixicon/user-3-line.svg" class='contrast-75 h-10' /></button>
      </div>
    </div>
    <section></section>
  </main>
}

export default Home
