import './app.css'
import App from './App.svelte'
import { API } from './lib/helpers'
import { user } from './lib/stores'

const app = new App({
  target: document.getElementById('app')
})

const token = localStorage.getItem('token');
if (token) {
  API('user', { body: { token } }).then(([status, data]) => {
    if (status) {
      user.set(data.user);
    } else if (data.message === 'Invalid token') {
      localStorage.removeItem('token');
    }
  })
}

export default app
