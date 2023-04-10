import { Show } from 'solid-js'
import { useRegisterSW } from 'virtual:pwa-register/solid'

const ReloadToast = () => {
  const {
    // offlineReady,
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered (r) {
      console.log(`SW Registered: ${r}`)
    },
    onRegisterError (error) {
      console.log('SW registration error', error)
    }
  })

  return (
    <Show when={needRefresh()}>
      <section class='absolute w-full flex justify-center p-2 z-50'>
        <div class='bg-black text-white p-2 pl-3 pr-3 rounded-md w-full shadow-md flex items-center font-semibold'>
          <img src="/icons/remixicon/refresh-line.svg" alt="Refresh" class='invert mr-3' />
          <span>New app version is available</span>

          <button class='ml-auto text-brandPink bg-white bg-opacity-0 active:bg-opacity-20
          pr-3 pl-3 p-1 rounded' onClick={() => updateServiceWorker(true)}>Reload</button>
        </div>
      </section>
    </Show>
  )
}

export default ReloadToast
