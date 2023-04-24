/* @refresh reload */

import { onMount } from 'solid-js'

import { useLoadingContext } from '../../App'
import { Tab } from '../../ui/Tabs'

import NavBar, { useNavBarController } from '../../ui/NavBar'
import Home from './Home/Home'
import Messages from './Messages/Messages'
import Settings from './Settings/Settings'

export const App = () => {
  const [{ setLoadingScreen }] = useLoadingContext()
  const navBarController = useNavBarController()

  onMount(() => {
    setLoadingScreen(false)
  })

  return <main class='w-full h-full bg-white text-black relative flex flex-col'>
    <NavBar icons={[
      ['/icons/remixicon/home-line.svg', '/icons/remixicon/home-fill.svg'],
      ['/icons/remixicon/chat-1-line.svg', '/icons/remixicon/chat-1-fill.svg'],
      ['/icons/remixicon/user-3-line.svg', '/icons/remixicon/user-3-fill.svg']
    ]} controller={navBarController}>
      <Messages navBarController={navBarController} />
      <Home />
      <Settings />
    </NavBar>

  </main>
}

export default App
