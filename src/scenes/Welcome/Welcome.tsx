import { Component, createSignal, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'

// External
import 'keen-slider/keen-slider.min.css'
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

// Components
// import { CreateAccount } from './CreateAccount'
import { AuthLoginPassword } from './AuthMethods/AuthLoginPassword'
import { ActionButton, Header, Slide } from './Shared'
import { ServerSelect } from './ServerSelect'

// Client
import { client } from '../../client/client'
import Error from './Error'
import { Error as mxcError, ErrorType } from '../../client/error'
import { ProviderInfo } from '../../client/common'
import { useLoadingContext } from '../../App'

const Welcome: Component = () => {
  let sectionSlider: HTMLDivElement
  let keenSlider: KeenSliderInstance

  const [errorMessage, setErrorMessage] = createSignal('')
  const [providerInfo, setProviderInfo] = createSignal({} as ProviderInfo)
  const [lastSlide, setLastSlide] = createSignal(0)

  const navigate = useNavigate()
  const [{ setLoadingScreen }] = useLoadingContext()

  onMount(() => {
    keenSlider = new KeenSlider(
      sectionSlider, {
        drag: false
      })

    setLoadingScreen(false)
  })

  const handleErrorMessages = (err: mxcError) => {
    return setErrorMessage((
      err.type == ErrorType.Network
        ? 'Communication with the provider failed. Please check you internet connection or provider domain.'
        : err.type == ErrorType.InvalidJSON || err.type == ErrorType.Unsupported
          ? 'The provider is not compatible with the Berry yet. If you have any questions don\'t hesitate to message us.'
          : err.type == ErrorType.RateLimited
            ? 'The provider decided that you are way too fast! Please wait a while before trying again.'
            : err.type == ErrorType.Forbidden
              ? 'Username or password is incorrect, or maybe the account doesn\'t exist.'
              : err.type == ErrorType.UserDeactivated
                ? 'The account you are trying to use is no longer active. Contact your provider for more info.'
                : 'This is unexpected!'
    ) + ` (#${err.type})`)
  }

  return <main class="w-full h-full bg-blue-600 flex lg:justify-center lg:items-center lg:bg-welcomeHeroLight lg:bg-cover">
    <section class="w-full h-full bg-white dark:bg-black text-black dark:text-white
      lg:w-1/2 lg:h-4/5 xl:w-1/3 lg:rounded lg:shadow-lg lg:mb-12">
      <div ref={sectionSlider} class="keen-slider h-full">
        <Slide>
          <img src="/images/logos/logo.svg" alt="Berry Logo" class="w-48 mb-2 lg:w-36" />
          <Header title={'Berry'} />

          <p class="text-center text-lg text-gray-600">
            Your <b class="font-semibold">decentralized</b> chat with world-class
            <b class="font-semibold"> security</b> and unrivaled <b class="font-semibold">privacy</b>.
          </p>

          <ActionButton onClick={() => keenSlider.moveToIdx(1)} text={"Let's Get Started"} className="mt-auto" />
        </Slide>

        <ServerSelect onNext={async (domain) => {
          setLastSlide(1)
          keenSlider.moveToIdx(3)

          const res = await client.validateDomain(domain)

          if (res.ok == false) {
            keenSlider.moveToIdx(2)

            // TODO: Errors here should be in some array or object maybe
            // so they can be easily edited/translated in the future.
            return handleErrorMessages(res.error)
          }

          setProviderInfo(res.value)
          const flows = await client.account.loginGetFlows(res.value.homeserver)

          if (flows.ok == false) {
            keenSlider.moveToIdx(2)
            return handleErrorMessages(flows.error)
          }

          if (!flows.value.includes('m.login.password')) {
            keenSlider.moveToIdx(2)
            return handleErrorMessages({ type: ErrorType.Unsupported })
          }

          setLastSlide(4)
          keenSlider.moveToIdx(4)
        }} />

        <Error message={errorMessage()} onBack={() => keenSlider.moveToIdx(lastSlide())} />
        <Slide>
          <img src="/images/logos/logo.svg" alt="Berry Logo" class="w-36 mb-auto mt-auto lg:w-28 animate-pulse" />
        </Slide>

        {/* TODO Somewhere here we will prompt user for their preffered log in method
          (https://spec.matrix.org/v1.5/client-server-api/#authentication-types) */}

        <AuthLoginPassword
          onBack={() => keenSlider.moveToIdx(2)}
          onNext={(username, password) => {
            // Authentication flow for login + password combo.
            keenSlider.moveToIdx(3)

            client.account.loginPassword(providerInfo(), username, password).then((status) => {
              if (status.ok == false) {
                keenSlider.moveToIdx(2)
                return handleErrorMessages(status.error)
              }

              setLoadingScreen(true)
              navigate('/')
            }).catch(() => null)
          }}
        />

        {/* <CreateAccount onBack={() => keenSlider.moveToIdx(2)} />

          Currently the registation is put on hold until the client is functional
          enough */}
      </div>
    </section>
  </main>
}

export default Welcome
