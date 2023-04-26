import { Match, Show, Switch, createSignal } from 'solid-js'
import { Tab, Tabs, useTabsController } from '../../../ui/Tabs'
import { NavBarController } from '../../../ui/NavBar'
import { createMediaQuery } from '@solid-primitives/media'
import Spaces from './Spaces'
import Rooms from './Rooms'
import Chat from './Chat'
import Home from '../Home/Home'

const Messages = (props: {
  navBarController: NavBarController
}) => {
  const tabsController = useTabsController()
  const isScreenLG = createMediaQuery('(min-width: 1024px)')
  const [currentSpace, setCurrentSpace] = createSignal(0 - 1)

  // Cross-screen side bar
  const SideBar = (p: {
    onSpaceChange: (idx: number) => void
  }) => {
    return (
      <Tab className='lg:w-min' disableSlide={isScreenLG()}>
        <section class='max-h-full h-full w-full lg:w-fit relative flex items-center border-r border-white-400'>
          {/* Spaces bar */}
          <Spaces onSpaceChange={p.onSpaceChange} />

          {/* Room list */}
          <Rooms
            onRoomSwitch={() => {
              props.navBarController.toggleNavBar(false)
              tabsController.moveToIdx(1)
            }}
          />
        </section>
      </Tab>
    )
  }

  // Components for mobile
  const Mobile = () => {
    return (
      <Tabs controller={tabsController} onTabChange={(idx) => {
        props.navBarController.toggleNavBar(idx == 0)
      }}>
        <SideBar onSpaceChange={() => null} />
        <Chat controller={tabsController} />
      </Tabs>
    )
  }

  // Components for desktop
  const Desktop = () => {
    return (
      <section class='flex w-full h-full'>
        <SideBar onSpaceChange={(idx) => {
          setCurrentSpace(idx)
        }} />

        <Switch>
          <Match when={currentSpace() == 0 - 1}>
            <Home />
          </Match>
          <Match when={currentSpace() >= 0}>
            <Chat controller={tabsController} />
          </Match>
        </Switch>
      </section>
    )
  }

  return (
    <Tab>
        <Show when={!isScreenLG()} fallback={<Desktop />}>
          <Mobile />
        </Show>
    </Tab>
  )
}

export default Messages
