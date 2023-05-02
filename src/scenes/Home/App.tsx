/* @refresh reload */

import { Show, onMount } from 'solid-js'

import { useLoadingContext } from '../../App'

import NavBar, { useNavBarController } from '../../ui/NavBar'
import Home from './Home/Home'
import Messages from './Messages/Messages'
import Settings from './Settings/Settings'
import { createMediaQuery } from '@solid-primitives/media'
import { client } from '../../client/client'

export const App = () => {
  const [{ setLoadingScreen }] = useLoadingContext()
  const navBarController = useNavBarController()

  const isScreenLG = createMediaQuery('(min-width: 1024px)')

  onMount(() => {
    client.events.startSyncingLoop().then(() => null).catch(() => null)
    // setLoadingScreen(false)
  })

  return <main class='w-full h-full bg-white text-black relative flex flex-col'>
    <Show when={!isScreenLG()} fallback={
      <Messages navBarController={navBarController} />
    }>
      <NavBar icons={[
        ['/icons/remixicon/home-line.svg', '/icons/remixicon/home-fill.svg'],
        ['/icons/remixicon/chat-1-line.svg', '/icons/remixicon/chat-1-fill.svg'],
        ['/icons/remixicon/user-3-line.svg', '/icons/remixicon/user-3-fill.svg']
      ]} controller={navBarController}>
        <Home />
        <Messages navBarController={navBarController} />
        <Settings />
      </NavBar>
    </Show>
  </main>
}

export default App
