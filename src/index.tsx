/* @refresh reload */
import './index.css';

import { render } from 'solid-js/web';
import { Router } from "@solidjs/router";

import "@fontsource/sarabun/400.css";
import "@fontsource/sarabun/600.css";
import "@fontsource/sarabun/800.css";
// import "@fontsource/noto-sans"

import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  );
}

render(() => <Router><App /></Router>, root!);
