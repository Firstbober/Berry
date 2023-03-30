import { Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import ReloadToast from './misc/ReloadToast';

const App: Component = () => {
  return (
    <div class='w-full h-full'>
      <ReloadToast />

      <Routes>
        <Route path="/welcome" component={lazy(() => import("./scenes/Welcome/Welcome"))} />
      </Routes>
    </div>
  );
};

export default App;
