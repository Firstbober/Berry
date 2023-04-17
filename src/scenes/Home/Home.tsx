/* @refresh reload */

import { onMount } from 'solid-js'

import { useLoadingContext } from '../../App'
import { Tab, Tabs } from '../../ui/Tabs'

import Invites from './Home/Invites'
import Friends from './Home/Friends'
import NavBar, { NavTab } from '../../ui/NavBar'

export const Home = () => {
  const [{ setLoadingScreen }] = useLoadingContext()

  onMount(() => {
    setLoadingScreen(false)
  })

  return <main class='w-full h-full bg-white text-black relative flex flex-col'>
    <NavBar icons={[
      ['/icons/remixicon/home-line.svg', '/icons/remixicon/home-fill.svg'],
      ['/icons/remixicon/chat-1-line.svg', '/icons/remixicon/chat-1-fill.svg'],
      ['/icons/remixicon/user-3-line.svg', '/icons/remixicon/user-3-fill.svg']
    ]}>
      <NavTab>
        <section class='max-h-full h-full w-full relative flex flex-col flex-grow items-center pr-3 pl-3'>
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
      </NavTab>
      <NavTab><h1>BBB</h1></NavTab>
      <NavTab><h1>CCCC</h1></NavTab>
    </NavBar>

  </main>
}

export default Home
