import { For } from 'solid-js'
import { Tab, Tabs, useTabsController } from '../../../ui/Tabs'
import { NavBarController } from '../../../ui/NavBar'

const Spaces = () => {
  return (
    <section class='flex flex-col w-20 min-w-[5rem] h-full border-r border-white-400 pt-3 overflow-y-auto scroll scrollbar-hide'>
      <For each={new Array(20)}>{(_, idx) =>
          // Space
          <button class='pl-3 pr-3 mb-3 relative group'>
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
    <section class='flex flex-col h-full min-w-0 max-w-fit'>
      {/* Space name and setting */}
      <button class='flex p-2 pl-4 pr-4 min-w-0 items-center h-16 border-b border-white-300
        hover:bg-white-100 duration-100'>
        <span class='overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full
          font-semibold text-lg'>Berry Matrix Client: Rayman Origins: Electic Boogaloo 2</span>
        <div class='grow flex w-12 h-full items-center justify-center ml-6'>
          <img src="/icons/remixicon/more-fill.svg" alt="Show space info and settings"
            class='w-6 h-6' />
        </div>
      </button>

      {/* Rooms */}
      <section class='p-2 overflow-y-auto'>
        <For each={new Array(30)}>{() =>
          // Room
          <button class='rounded flex w-full p-2 pl-2 pr-2 items-center\
            hover:bg-white-100 duration-75' onClick={() => props.onRoomSwitch()}>
            <img src="/icons/remixicon/hashtag.svg" alt="Room icon"
              class='w-6 h-6 mr-1.5 contrast-75' />
            <span class='overflow-hidden overflow-ellipsis whitespace-nowrap mb-0.5'>Powerful testing room for incredible client</span>
          </button>
        }</For>
      </section>
    </section>
  )
}

const Messages = (props: {
  navBarController: NavBarController
}) => {
  const tabsController = useTabsController()

  return (
    <Tab>
        <Tabs controller={tabsController} onTabChange={(idx) => {
          props.navBarController.toggleNavBar(idx == 0)
        }}>
          <Tab className='flex flex-col pt-2 pb-2'>
            {/* New user message */}
            <div class='flex p-3 pt-1 pb-1 hover:bg-white-100'>
              <section class='flex w-12 h-12 flex-shrink-0 mr-3'>
                <img src="https://picsum.photos/200" alt="Avatar" class='w-12 h-12 object-cover rounded' />
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
            <div class='flex p-3 pt-1 pb-1 hover:bg-white-100 group'>
              <section class='flex w-12 flex-shrink-0 mr-3 justify-center items-center'>
                <span class='after:table after:mb-1 text-xs text-white-600 opacity-0 group-hover:opacity-100'>14:02</span>
              </section>
              <section>
                <div class='before:-mt-1 before:table'>
                  Summer has come and passed, the innocent can never last
                </div>
              </section>
            </div>
            <div class='flex p-3 pt-1 pb-1 hover:bg-white-100 group'>
              <section class='flex w-12 flex-shrink-0 mr-3 justify-center items-center'>
                <span class='after:table text-xs text-white-600 opacity-0 group-hover:opacity-100'>14:02</span>
              </section>
              <section>
                <div class='before:-mt-1 before:table'>
                  Summer has come and passed, the innocent can never last
                </div>
              </section>
            </div>
          </Tab>
          <Tab>
            <section class='max-h-full h-full w-full relative flex items-center'>
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
        </Tabs>
    </Tab>
  )
}

export default Messages
