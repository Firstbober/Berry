import { createMediaQuery } from '@solid-primitives/media'
import { Tab } from '../../../ui/Tabs'

const Settings = () => {
  const isScreenLG = createMediaQuery('(min-width: 1024px)')

  return (
    <Tab disableSlide={isScreenLG()}>
      <section class='max-h-full h-full w-full flex flex-col flex-grow items-center justify-center pr-3 pl-3 pt-3'>
        <span class='text-xl font-semibold'>Username</span>
        <span>@username:homeserver.org</span>

        <button class='mt-8 rounded bg-brandRed text-white-50 p-2 pl-4 pr-4 font-semibold
          duration-200 hover:bg-brandPink'>
          Log out
        </button>
      </section>
    </Tab>
  )
}

export default Settings
