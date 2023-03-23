import { Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';

const App: Component = () => {
  return (
    <Routes>
      <Route path="/welcome" component={lazy(() => import("./scenes/Welcome"))} />
    </Routes>
  );
};

export default App;
