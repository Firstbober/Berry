import { ActionButton, createTextField, Header, SecondaryButton, Slide, TextField } from '../Shared'

export const AuthLoginPassword = (props: {
  onNext?: (username: string, password: string) => void,
  onBack?: () => void,
}) => {
  const [username, setUsername] = createTextField()
  const [password, setPassword] = createTextField()

  return (
    <Slide>
      <Header title={'Sign in'} />
      <p class="text-center text-lg text-gray-600">
        Use your username and password to continue <button class='text-brandRed' onClick={() => props.onBack()}>or change your provider</button>.
      </p>

      <form class="flex flex-col w-full h-full mt-8" onSubmit={(e) => e.preventDefault()}>
        <TextField className="w-full" placeholder="Username" autocomplete="username"
          label="Username" minLen={4} onInput={setUsername} />

        <TextField className="w-full mt-2" type="password" placeholder="Password"
          label="Password" minLen={8} onInput={setPassword} autocomplete="current-password" />
        <button class="mt-2 mr-auto text-brandRed text-sm">Forgot your password?</button>

        <section class="mt-auto flex justify-between w-full text-lg">
          <SecondaryButton onClick={props.onBack} text={'Create account'} active={false} />
          {
            username().isValid && password().isValid
              ? <ActionButton text={'Sign in'} active={true} onClick={() => props.onNext(username().value, password().value)} />
              : <ActionButton text={'Sign in'} active={false} onClick={() => props.onNext(username().value, password().value)} />
          }
        </section>
      </form>
    </Slide>
  )
}
