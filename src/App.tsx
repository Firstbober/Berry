import { Route, Routes, useNavigate } from '@solidjs/router';
import { Component, createContext, createEffect, createSignal, lazy, Setter, Show, useContext } from 'solid-js';

import { client } from './client/client';
import { getClientDisplayName } from './client/common';
import ReloadToast from './misc/ReloadToast';

// Oh. My....... Really it isn't much different if I were to place it in the component
// but still, boilerplate.
const makeLoadingContext = () => {
	const [loadingScreen, setLoadingScreen] = createSignal(true)
	const [int_loadingScreen, int_setLoadingScreen] = createSignal(true)

	return [{ setLoadingScreen }, { int_loadingScreen, int_setLoadingScreen, loadingScreen }] as const
}

const LoadingContext = createContext<ReturnType<typeof makeLoadingContext>>()
export const useLoadingContext = () => useContext(LoadingContext)

// Component
const App: Component = () => {
	console.log(getClientDisplayName())

	// Loading screen context
	const loadingContext = makeLoadingContext()
	const [{ }, { int_loadingScreen, int_setLoadingScreen, loadingScreen }] = loadingContext

	let loadingDiv: HTMLDivElement

	// Timeouts in this effect correspond to the duration in loading screen class
	createEffect(() => {
		console.log("aaaa")
		loadingDiv.classList.remove('opacity-0')

		if (loadingScreen()) {
			int_setLoadingScreen(true)

			setTimeout(() => {
				if (loadingScreen()) {
					loadingDiv.classList.remove('opacity-0')
				}
			}, 150)
		} else {
			loadingDiv.classList.add('opacity-0')

			setTimeout(() => {
				if (!loadingScreen())
					int_setLoadingScreen(false)
			}, 300)
		}
	})

	// Load clients and check if there are any present
	const navigate = useNavigate()
	client.loadClientsFromStorage()

	navigate(client.account.isLoggedIn() ? '/' : '/welcome')

	return (
		<div class='w-full h-full'>
			<ReloadToast />

			<Show when={int_loadingScreen()}>
				<div ref={loadingDiv} class='absolute w-full h-full bg-white dark:bg-black z-40 flex justify-center items-center flex-col duration-300 opacity-0'>
					{/* TODO Better loading animation and loading screen as separate component */}
					<img src="/images/logos/logo.svg" alt="Berry Logo" class="w-36 lg:w-28 animate-pulse" />
					<span class='text-gray-400 font-semibold mt-8 mb-16'>Loading...</span>
				</div>
			</Show>

			<LoadingContext.Provider value={loadingContext}>
				<Routes>
					<Route path="/welcome" component={lazy(() => import("./scenes/Welcome/Welcome"))} />
				</Routes>
			</LoadingContext.Provider>
		</div>
	);
};

export default App;
