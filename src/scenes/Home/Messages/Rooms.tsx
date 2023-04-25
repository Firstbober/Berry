import { For } from 'solid-js'
import { Icon, Icons } from '../../../ui/Icon'

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

export default Rooms
