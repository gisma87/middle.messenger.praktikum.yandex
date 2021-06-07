import store from './store/index';
import { Router } from './service/Router';
import { chats } from './pages/chat/chat';
import { profile } from './pages/profile/profile';
import { profileChangeData } from './pages/profileChangeData/profileChangeData';
import { profileChangePassword } from './pages/profileChangePassword/profileChangePassword';
import { pageNotFound } from './pages/pageError/pageNotFound';
import { pageError500 } from './pages/pageError/pageError';
import { loginPage } from './pages/login/login';
import { signinPage } from './pages/signin/signin';
import { UserApi } from './service/API/user-api';
import { historyPush } from './service/utils';

const isAuth = sessionStorage.getItem('auth') || false;

const router = new Router('.root');
export const userApi = new UserApi(store, router.rerender);

router.use('/', chats);
router.use('/chat', chats);
router.use('/profile', profile);
router.use('/profileChangeData', profileChangeData);
router.use('/profileChangePassword', profileChangePassword);
router.use('/pageNotFound', pageNotFound);
router.use('/error500', pageError500);
router.use('/login', loginPage);
router.use('/signin', signinPage);

console.log('store.state.auth: ', store.state.auth);

router.addRedirect('/chat', '/login', () => !store.state.auth);
router.addRedirect('/login', '/chat', () => store.state.auth);
router.addRedirect('/signin', '/chat', () => store.state.auth);
router.addRedirect('/', '/login', () => !store.state.auth);
router.addRedirect('/', '/chat', () => store.state.auth);

router.start();

userApi.getUserInfo();
// chatApi.getChats()

store.events.on('stateChange', () => {
  if (
    store.state.auth &&
    (window.location.pathname === '/login' ||
      window.location.pathname === '/signin')
  ) {
    historyPush('/chat');
  }
  if (
    !store.state.auth &&
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/signin'
  ) {
    historyPush('/login');
  }
});

export { isAuth, router };
