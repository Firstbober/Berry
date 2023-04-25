import { Show } from 'solid-js'
import { Tab, Tabs, useTabsController } from '../../../ui/Tabs'
import { NavBarController } from '../../../ui/NavBar'
import { createMediaQuery } from '@solid-primitives/media'
import Spaces from './Spaces'
import Rooms from './Rooms'
import Chat from './Chat'

const Messages = (props: {
  navBarController: NavBarController
}) => {
  const tabsController = useTabsController()
  const isScreenLG = createMediaQuery('(min-width: 1024px)')

  // Cross-screen side bar
  const SideBar = () => {
    return (
      <Tab className='w-fit' disableSlide={isScreenLG()}>
        <section class='max-h-full h-full w-full lg:w-fit relative flex items-center border-r border-white-400'>
          {/* Spaces bar */}
          <Spaces />

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
        <SideBar />
        <Chat controller={tabsController} />
      </Tabs>
    )
  }

  // Components for desktop
  const Desktop = () => {
    return (
      <section class='flex w-full h-full'>
        <SideBar />
        <Chat controller={tabsController} />
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
