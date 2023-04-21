/* @refresh reload */

import { For, Show, onMount } from 'solid-js'

import { useLoadingContext } from '../../App'
import { Tab } from '../../ui/Tabs'

import NavBar from '../../ui/NavBar'
import Home from './Home/Home'
import Messages from './Messages/Messages'

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
      <Messages />
      <Home />
      <Tab><h1>CCCC</h1></Tab>
    </NavBar>

  </main>
}

export default App
