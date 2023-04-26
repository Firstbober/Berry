import { createMediaQuery } from '@solid-primitives/media'
import { Icon, Icons } from '../../../ui/Icon'
import { Tab, Tabs } from '../../../ui/Tabs'
import Friends from './Friends'
import Invites from './Invites'

const Home = () => {
  const isScreenLG = createMediaQuery('(min-width: 1024px)')

  return (
    <Tab disableSlide={isScreenLG()}>
      <section class='max-h-full h-full w-full relative flex flex-col flex-grow items-center pr-3 pl-3'>
        <section class='mt-6 w-full flex'>
          <input placeholder={'Search in friends and channels'}
            class={'rounded bg-white-200 text-white-700 placeholder-white-500 bg-none p-2 lg:p-2 lg:roun outline-none border-2 border-white-200 w-full'}
          />
          <div class='flex ml-2 rounded'>
            <button class='flex items-center justify-center'>
              <Icon src={Icons.Search_Line} alt="Search" className='w-7 h-7 mr-6 ml-6' />
            </button>
            <button class='flex items-center justify-center'>
              <Icon src={Icons.AddLine} alt="Search" className='w-7 h-7 mr-6 ml-6' />
            </button>
            <button class='flex items-center justify-center '>
              <Icon src={Icons.Compass3_Line} alt="Search" className='w-7 h-7 mr-6 ml-6' />
            </button>
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
