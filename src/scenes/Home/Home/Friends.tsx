import { For } from 'solid-js'
import { Tab } from '../../../ui/Tabs'

const Friends = () => {
  return (
    <Tab className='relative'>
      <section class='flex flex-col absolute h-full w-full overflow-y-auto pt-2'>
        <For each={new Array(10)}>{(_, __) =>
            <button class='p-3 lg:p-2 text-black flex max-w-full border-b border-white-100 last:border-none relative'>
              <div class='mr-4 min-w-12 min-h-12 lg:min-w-10 lg:min-h-10 flex-shrink-0 relative flex items-center justify-center'>
                <img src="https://picsum.photos/200" class='object-cover w-12 h-12 rounded-full lg:w-10 lg:h-10' />
                <div class='rounded-full w-4 h-4 bg-gradient-to-tr from-brandRed to-brandPink border-2 border-white absolute right-0 bottom-0'></div>
              </div>
              <div class='flex flex-col items-start min-w-0 pb-0.5'>
                <header class='font-semibold'>Gustavo Smith</header>
                <span class='text-white-500 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full'>Have started the conversation</span>
              </div>
            </button>
        }</For>
      </section>
    </Tab>
  )
}

export default Friends
