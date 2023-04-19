/* @refresh reload */

import { For, Show, onMount } from 'solid-js'

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
      <Tab>
        <section class='max-h-full h-full w-full relative flex items-center'>
          {/* Spaces bar */}
          <section class='flex flex-col w-20 h-full border-r border-white-300 pt-3 overflow-y-auto scroll scrollbar-hide'>
            <For each={new Array(20)}>{(_, idx) =>
                // Space
                <button class='pl-3 pr-3 mb-3 relative group'>
                  {/* Indicator */}
                  <div class={`absolute w-2 h-full left-0 -translate-x-full ${idx() == 0 ? '-translate-x-0' : ''} flex items-center duration-150 group-hover:-translate-x-0`}>
                    <div class={`bg-gradient-to-br from-brandRed to-brandPink w-1/2 ${idx() == 0 ? 'h-5/6' : 'h-2/5'} rounded-tr rounded-br`}></div>
                  </div>
                  <img src="https://picsum.photos/200" class={`rounded object-cover ${idx() == 0 ? '' : 'saturate-[0.3] scale-90'}`} />
                </button>
            }</For>
          </section>

          {/* Room list */}
          <section class='flex grow h-full'>

          </section>
        </section>
      </Tab>
      <Home />
      <Tab><h1>CCCC</h1></Tab>
    </NavBar>

  </main>
}

export default App
