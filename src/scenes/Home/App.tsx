/* @refresh reload */

import { onMount } from 'solid-js'

import { useLoadingContext } from '../../App'
import { Tab } from '../../ui/Tabs'

import NavBar from '../../ui/NavBar'
import Home from './Home/Home'

export const App = () => {
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
      <Home />
      <Tab>
        <section class='max-h-full h-full w-full relative flex flex-col flex-grow items-center pr-3 pl-3'>

        </section>
      </Tab>
      <Tab><h1>CCCC</h1></Tab>
    </NavBar>

  </main>
}

export default App
