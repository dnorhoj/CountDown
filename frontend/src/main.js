import './app.css';
import App from './App.svelte';
import { API } from './lib/helpers';
import { user } from './lib/stores';

let app;

const token = localStorage.getItem('token');
if (token && !location.pathname.match("^/countdown")) {
  API('me', { body: { token } })
    .then(([status, data]) => {
      if (status) {
        user.set(data.user);
      } else if (data.message === 'Invalid token') {
        localStorage.removeItem('token');
      }
    })
    .finally(() => {
      app = new App({
        target: document.getElementById('app')
      });
    });
} else {
  app = new App({
    target: document.getElementById('app')
  });
}

export default app
