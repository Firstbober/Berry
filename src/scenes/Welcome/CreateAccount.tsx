import { ActionButton, createTextField, Header, SecondaryButton, Slide, TextField } from './Shared'

export const CreateAccount = (props: {
  onNext?: () => void,
  onBack?: () => void,
}) => {
  const [username, setUsername] = createTextField()
  const [password, setPassword] = createTextField()
  const [confirmPassword, setConfirmPassword] = createTextField()
  const [email, setEmail] = createTextField()

  const isFormValid = () => {
    return username().isValid && password().isValid && confirmPassword().isValid && email().isValid
  }

  return (
    <Slide>
      <Header title={'Create account'} />
      <p class="text-center text-lg text-gray-600">
        Fill out required details and you'll be ready to go.
      </p>

      <section class="w-full">
        <section class="flex mt-8 w-full">
          <TextField className="w-full" onInput={setUsername}
            label="Username" minLen={1} />
        </section>

        <section class="flex flex-col mt-6 w-full">
          <TextField className="w-full" onInput={setPassword} label="Password" type="password" minLen={8} />
          <TextField className="w-full mt-2" masterPassword={password().value}
            onInput={setConfirmPassword} label="Confirm Password" type="password" minLen={1} />
        </section>

        <section class="flex mt-6 w-full">
          <TextField className="w-full" onInput={setEmail}
            label="Email" type="email" minLen={1} />
        </section>
      </section>

      <section class="mt-auto flex justify-between w-full text-lg">
        <SecondaryButton onClick={props.onBack} text={'Go back'} />
        {
          isFormValid()
            ? <ActionButton text={'Create'} active={isFormValid()} onClick={props.onNext} />
            : <ActionButton text={'Create'} active={isFormValid()} onClick={props.onNext} />
        }
      </section>
    </Slide>
  )
}
