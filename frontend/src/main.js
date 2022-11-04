import './app.css';
import App from './App.svelte';
import { API } from './lib/helpers';
import { user } from './lib/stores';

if (!location.pathname.match("^/countdown")) {
  const token = localStorage.getItem('token');
  if (token) {
    const [status, data] = await API('me', { body: { token } });

    if (status) {
      user.set(data.user);
    } else if (data.message === 'Invalid token') {
      localStorage.removeItem('token');
    }
  }
}

const app = new App({
  target: document.getElementById('app')
});

export default app
