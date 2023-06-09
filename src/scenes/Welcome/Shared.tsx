import { children, createEffect, createSignal, JSX } from 'solid-js'

import isEmail from 'validator/es/lib/isEmail'

export const Slide = (props: { children: JSX.Element }) => {
  return (
    <div class="swiper-slide">
        <div class="w-full h-full flex items-center p-8 pt-16 pb-16 flex-col
          lg:p-12 lg:pt-10 lg:pb-10">
          {children(() => props.children)}
        </div>
    </div>
  )
}

export const Header = ({ title }) => {
  return (
    <header class="text-4xl font-black mb-6 text-center">{title}</header>
  )
}

export const ActionButton = ({ onClick = undefined, text, active = true, className = '' }) => {
  return (
    <button class={`bg-gradient-to-tr from-brandPink to-brandRed
      text-white p-3 pl-6 pr-6 rounded lg:p-2 lg:pl-5 lg:pr-5
      text-xl font-semibold shadow-xl duration-100 ${active ? 'hover:brightness-125 active:scale-110' : 'grayscale cursor-default'
      } ${className}`}
      onClick={onClick} autofocus disabled={!active}>{text}</button>
  )
}

export const SecondaryButton = ({ onClick = undefined, text, active = true, className = '' }) => {
  return (
    <button class={`p-3 lg:p-2 text-brandRed ${active ? 'active:scale-110 hover:brightness-125' : 'grayscale cursor-default'} duration-100 ${className}`}
      onClick={onClick} disabled={!active}>{text}</button>
  )
}

export const TextField = (props: {
  className?: string,
  label: string,
  placeholder?: string,
  default?: string,
  type?: 'text' | 'password' | 'email',
  minLen?: number,
  autofocus?: boolean,
  autocomplete?: string,

  onInput?: (ev: { isValid: boolean, value: string }) => void,

  masterPassword?: string
}) => {
  const [value, setValue] = createSignal('')
  const [isValid, setIsValid] = createSignal(true)
  let errMessage = ''

  const [editFlag, setEditFlag] = createSignal(false)

  // Run TextField validation algorythm on input field change.
  createEffect(() => {
    if (!editFlag()) { return }

    const v = value()
    let currentValidity = true

    if (props.minLen) {
      currentValidity &&= v.length >= props.minLen
      errMessage = `${props.label} length is less than ${props.minLen} characters`
      if (props.minLen == 1) { errMessage = `${props.label} can't be empty` }
    }

    if (props.type == 'password' && props.masterPassword) {
      currentValidity &&= props.masterPassword == v
      errMessage = 'Passwords doesn\'t match'
    }
    if (props.type == 'email') {
      currentValidity &&= isEmail(v)
      errMessage = `${props.label} is not an Email address`
    }

    setIsValid(currentValidity)

    if (props.onInput) {
      props.onInput({
        value: v,
        isValid: currentValidity
      })
    }
  })

  return (
    <label class={`flex flex-col ${props.className}`}>
      <span class="text-gray-700 uppercase font-semibold mb-2 text-sm">{props.label}</span>
      <input type={props.type} placeholder={props.placeholder}
        onInput={(event) => {
          if (!editFlag()) setEditFlag(true)
          setValue((event.target as HTMLInputElement).value)
        }}
        class={`rounded bg-black text-white bg-none p-3 lg:p-2 lg:roun outline-none border-2 ${isValid() ? 'border-black' : 'border-red-500'
          }`}
        value={props.default ? props.default : ''}
        autofocus={props.autofocus}
        autocomplete={props.autocomplete}
      />
      {
        isValid()
          ? <></>
          : <span class="text-red-600 font-semibold text-sm">{errMessage}</span>
      }
    </label>
  )
}

export const createTextField = (value = '') => {
  return createSignal({
    value,
    isValid: false
  })
}
