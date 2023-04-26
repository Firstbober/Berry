import { For, Show, createSignal } from 'solid-js'
import { Icon, Icons } from '../../../ui/Icon'
import { createMediaQuery } from '@solid-primitives/media'

const Space = (props: {
  active?: boolean,
  icon?: Icons,
  onClick: () => void
}) => {
  return (
    <button class='pl-3 pr-3 lg:pl-2 lg:pr-2 mb-3 lg:mb-2 last:mb-0 relative group flex justify-center w-full'
      onClick={props.onClick}>
      {/* Indicator */}
      <div class={`absolute w-2 h-full left-0 ${props.active ? '-translate-x-0' : '-translate-x-full'} flex items-center duration-150 group-hover:-translate-x-0`}>
        <div class={`bg-gradient-to-br from-brandRed to-brandPink w-1/2 ${props.active ? 'h-5/6' : 'h-2/5'} rounded-tr rounded-br`}></div>
      </div>
      {
        props.icon
          ? <div class={`bg-white-200 hover:bg-white-300
              rounded flex items-center justify-center duration-75 ${
                props.active
                  ? 'w-14 h-14 lg:w-12 lg:h-12 lg:min-w-[3rem] bg-white-300'
                  : 'w-[3.2rem] h-[3.2rem] lg:w-11 lg:h-11'
              }`}>
            <Icon src={props.icon} alt="Icon" />
          </div>
          : <img src="https://picsum.photos/200" class={`rounded object-cover duration-75 ${
              props.active
                ? 'w-14 h-14 lg:w-12 lg:h-12 lg:min-w-[3rem]'
                : 'saturate-[0.3] w-[3.2rem] h-[3.2rem] lg:w-11 lg:h-11'
            }`} />
      }
    </button>
  )
}

const Separator = () => {
  return (
    <div class='mt-2.5 mb-2.5 w-3/5 border-t border-white-400 ml-auto mr-auto'></div>
  )
}

const Spaces = (props: {
  onSpaceChange: (idx: number) => void
}) => {
  const isScreenLG = createMediaQuery('(min-width: 1024px)')
  const [currentSpace, setCurrentSpace] = createSignal(0 - 1)

  return (
    <section class='flex flex-col w-20 lg:w-16 h-full border-r border-white-400 pt-3 pb-3 lg:pt-2 lg:pb-2 flex-shrink-0'>
      <section class='overflow-y-auto scroll scrollbar-hide'>
        <Show when={isScreenLG()}>
          <Space icon={Icons.Home_Fill} onClick={() => {
            props.onSpaceChange(0 - 1)
            setCurrentSpace(0 - 1)
          }} active={currentSpace() == 0 - 1} />
          <Separator />
        </Show>

        <For each={new Array(20)}>{(_, idx) =>
          // Space
          <Space active={currentSpace() == idx()} onClick={() => {
            props.onSpaceChange(idx())
            setCurrentSpace(idx())
          }} />
        }</For>
      </section>

      <Show when={isScreenLG()}>
        <Separator />
        <section>
          <Space icon={Icons.User3_Fill} onClick={() => {
            props.onSpaceChange(0 - 2)
            setCurrentSpace(0 - 2)
          }} active={currentSpace() == 0 - 2} />
        </section>
      </Show>
    </section>
  )
}

export default Spaces
