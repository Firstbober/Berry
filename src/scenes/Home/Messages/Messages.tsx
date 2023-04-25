import { For, Show } from 'solid-js'
import { Tab, Tabs, TabsController, useTabsController } from '../../../ui/Tabs'
import { NavBarController } from '../../../ui/NavBar'
import { Icon, Icons } from '../../../ui/Icon'
import { createMediaQuery } from '@solid-primitives/media'

const Spaces = () => {
  return (
    <section class='flex flex-col w-20 lg:w-16 h-full border-r border-white-400 pt-3 lg:pt-2 overflow-y-auto scroll scrollbar-hide flex-shrink-0'>
      <For each={new Array(20)}>{(_, idx) =>
          // Space
          <button class='pl-3 pr-3 lg:pl-2 lg:pr-2 mb-3 lg:mb-2 relative group'>
            {/* Indicator */}
            <div class={`absolute w-2 h-full left-0 ${idx() == 0 ? '-translate-x-0' : '-translate-x-full'} flex items-center duration-150 group-hover:-translate-x-0`}>
              <div class={`bg-gradient-to-br from-brandRed to-brandPink w-1/2 ${idx() == 0 ? 'h-5/6' : 'h-2/5'} rounded-tr rounded-br`}></div>
            </div>
            <img src="https://picsum.photos/200" class={`rounded object-cover ${idx() == 0 ? '' : 'saturate-[0.3] scale-90'}`} />
          </button>
      }</For>
    </section>
  )
}

const Rooms = (props: {
  onRoomSwitch: () => void
}) => {
  return (
    <section class='flex flex-col h-full min-w-0 max-w-full w-full lg:w-60'>
      {/* Space name and setting */}
      <button class='flex p-2 pl-4 pr-4 lg:pl-3 lg:pr-3 min-w-0 items-center min-h-[3rem] max-h-12 border-b border-white-300
        hover:bg-white-100 duration-100 justify-between lg:max-h-11 lg:min-h-[2.75rem]'>
        <span class='overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full
          font-semibold text-lg lg:text-[0.95rem]'>Berry Matrix Client: Rayman Origins: Electic Boogaloo 2</span>
        <div class='flex w-16 lg:w-6 lg:ml-6 h-full items-center justify-center flex-shrink-0'>
          <Icon src={Icons.More_Fill} alt="Show space info and settings" className='w-6 h-6' />
        </div>
      </button>

      {/* Rooms */}
      <section class='p-1 lg:p-1.5 overflow-y-auto'>
        <For each={new Array(30)}>{() =>
          // Room
          <button class='rounded flex w-full p-2 pl-2 pr-2 lg:p-1 lg:pb-1 lg:pt-1 lg:pr-2 items-center
            hover:bg-white-100 duration-75 lg:mb-0.5' onClick={() => props.onRoomSwitch()}>
            <Icon src={Icons.Hashtag} alt="Room icon" className='w-6 h-6 lg:w-5 lg:h-5 mr-1.5 contrast-50' />
            <span class='overflow-hidden overflow-ellipsis whitespace-nowrap mb-0.5 text-white-800
              lg:text-[0.95rem] font-medium'>Powerful testing room for incredible client</span>
          </button>
        }</For>
      </section>
    </section>
  )
}

const Chat = (props: {
  controller: TabsController
}) => {
  const isScreenLG = createMediaQuery('(min-width: 1024px)')

  return (
    <Tab className='w-fit' disableSlide={isScreenLG()}>
      <div class='flex flex-col w-full h-full'>
        {/* Room info */}
        <span class='flex min-w-0 items-center min-h-[3rem] max-h-12 border-b border-white-300
          duration-100 pr-4 lg:max-h-11 lg:min-h-[2.75rem]'>

          {/* On mobile show the back button and on desktop the channel icon */}
          <Show when={!isScreenLG()} fallback={
            <Icon src={Icons.Hashtag} alt="Room icon" className='w-6 h-6 contrast-50 ml-3 mr-2' />
          }>
            <button class='flex items-center justify-center w-[4.25rem] h-full'
              onClick={() => {
                props.controller.moveToIdx(0)
              }}>
              <Icon src={Icons.ArrowLeft_Line} alt='Spaces and room selection' className='w-6 h-6' />
            </button>
          </Show>

          <button class='flex items-center min-w-0'>
            <span class='overflow-hidden overflow-ellipsis whitespace-nowrap mb-0.5 text-lg font-semibold
              text-white-800 lg:text-[0.95rem]'>Powerful testing room for incredible client</span>
          </button>
        </span>

        {/* Messages */}
        <section class='w-full h-full pt-2 pb-2 overflow-auto lg:text-[0.95rem]'>
          {/* New user message */}
          <div class='flex p-3 pt-1 pb-1 hover:bg-white-100'>
            <section class='flex w-11 h-11 lg:w-10 lg:h-10 flex-shrink-0 mr-3'>
              <img src="https://picsum.photos/200" alt="Avatar" class='w-11 h-11 lg:w-10 lg:h-10 object-cover rounded' />
            </section>
            <section>
              <div class='font-semibold before:-mt-1 before:table items-center'>
                <div class='flex items-center'>
                  <span>Joe Null</span>
                  <span class='text-xs ml-2 font-normal text-white-600 mt-0.5'>Today at 14:00</span>
                </div>
              </div>
              <div>
                As my memory rests, but never forgets what I lost, wake mu up when september ends.
                As my memory rests, but never forgets what I lost, wake mu up when september ends.
                As my memory rests, but never forgets what I lost, wake mu up when september ends.
              </div>
            </section>
          </div>
          {/* Subsequent message of the same user */}
          <For each={new Array(10)}>{(_, __) =>
            <div class='flex p-3 pt-1 pb-1 hover:bg-white-100 group'>
              <section class='flex w-11 lg:w-10 flex-shrink-0 mr-3 justify-center items-center'>
                <span class='after:table text-xs text-white-600 opacity-0 group-hover:opacity-100'>14:02</span>
              </section>
              <section>
                <div class='before:-mt-1 before:table'>
                  Summer has come and passed, the innocent can never last
                </div>
              </section>
            </div>
          }</For>
        </section>

        {/* Input */}
        <section class='w-full flex-shrink-0 flex bg-white-100 items-center p-2 pl-3 pr-3 lg:p-1 lg:pl-3 lg:pr-3 lg:text-[0.95rem]'>
            <textarea placeholder='Write a message...'
              class='w-full bg-transparent overflow-visible h-10 mt-auto outline-none pt-2 resize-none'
              onInput={(ev) => {
                const target = ev.target as HTMLTextAreaElement

                if (target.style.height.includes(String(target.scrollHeight))) {
                  target.style.paddingBottom = '0.375rem'
                } else {
                  target.style.paddingBottom = ''
                }

                target.style.height = ''
                target.style.height = `${target.scrollHeight}px`
              }} />
            <button class='w-8 h-10 mt-auto ml-2 lg:w-6'>
              <Icon src={Icons.SendPlane2_Fill} alt="Send message" />
            </button>
        </section>
      </div>
    </Tab>
  )
}

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
