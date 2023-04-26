import { createMediaQuery } from '@solid-primitives/media'
import { Icon, Icons } from '../../../ui/Icon'
import { Tab, Tabs } from '../../../ui/Tabs'
import Friends from './Friends'
import Invites from './Invites'
import { JSX } from 'solid-js'

const Home = () => {
  const isScreenLG = createMediaQuery('(min-width: 1024px)')

  const TopBarButton = (props: {
    children: JSX.Element
  }) => {
    return (
      <button class='flex items-center justify-center flex-shrink-0 pl-2 pr-2 hover:bg-white-100 rounded duration-75'>
        {props.children}
      </button>
    )
  }

  return (
    <Tab disableSlide={isScreenLG()}>
      <section class='max-h-full h-full w-full relative flex flex-col flex-grow items-center pr-3 pl-3 lg:pr-2 lg:pl-2'>
        <section class='mt-6 lg:mt-2 w-full flex'>
          <input placeholder={'Search in friends and channels'}
            class='rounded bg-white-200 text-white-700 placeholder-white-500 bg-none
              p-2 lg:p-1 lg:pl-2 lg:pr-2 lg:pb-1.5 outline-none border-2 border-white-200 w-full'
          />
          <div class='flex ml-2 rounded min-w-max'>
            <TopBarButton>
              <Icon src={Icons.Search_Line} alt="Search" className='w-7 h-7 lg:w-6 lg:h-6' />
            </TopBarButton>
            <TopBarButton>
              <Icon src={Icons.AddLine} alt="Search" className='w-7 h-7 lg:w-6 lg:h-6' />
            </TopBarButton>
            <TopBarButton>
              <Icon src={Icons.Compass3_Line} alt="Search" className='w-7 h-7 lg:w-6 lg:h-6' />
            </TopBarButton>
          </div>
        </section>

        <Tabs labels={['Friends', 'Invites']} className='mt-1'>
          <Friends />
          <Invites />
        </Tabs>
      </section>
    </Tab>
  )
}

export default Home
