import './scss/index.scss'
import store from './store/index';
import {Router} from './service/Router/Router';
import {chats} from './pages/chat/chat';
import {profile} from './pages/profile/profile';
import {profileChangeData} from './pages/profileChangeData/profileChangeData';
import {profileChangePassword} from './pages/profileChangePassword/profileChangePassword';
import {pageNotFound} from './pages/pageError/pageNotFound';
import {pageError500} from './pages/pageError/pageError';
import {loginPage} from './pages/login/login';
import {signinPage} from './pages/signin/signin';
import {UserApi} from './service/API/user-api';
import {enableSubscription} from './service/utils';
import {pathNames} from "./constants";

const isAuth = sessionStorage.getItem('auth') || false;

const router = new Router('.root');
export const userApi = new UserApi(store, router.rerender);

router.use(pathNames.defaultPath, chats);
router.use(pathNames.chats, chats);
router.use(pathNames.profile, profile);
router.use(pathNames.profileChangeData, profileChangeData);
router.use(pathNames.profileChangePassword, profileChangePassword);
router.use(pathNames.pageNotFound, pageNotFound);
router.use(pathNames.error500, pageError500);
router.use(pathNames.login, loginPage);
router.use(pathNames.signin, signinPage);

router.addRedirect(pathNames.chats, pathNames.login, () => !store.state.auth);
router.addRedirect(pathNames.login, pathNames.chats, () => store.state.auth);
router.addRedirect(pathNames.signin, pathNames.chats, () => store.state.auth);
router.addRedirect(pathNames.defaultPath, pathNames.login, () => !store.state.auth);
router.addRedirect(pathNames.defaultPath, pathNames.chats, () => store.state.auth);

router.start();

userApi.getUserInfo();

enableSubscription()

export {isAuth, router};
