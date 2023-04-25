import { For } from 'solid-js'

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

export default Spaces
