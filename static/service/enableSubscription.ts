import store from "../store";
import {eventsName, pathNames} from "../constants";
import {webSocketApi} from "./API/webSocket-api";
import {historyPush} from "./utils";

export const enableSubscription = () => {
  store.events.on(eventsName.stateChange, ({prevState, newState}) => {
    // isUserAuth: boolean - пользователь авторизован и находится на '/login' или '/signin'
    const isUserAuth = store.state.auth
      && (window.location.pathname === pathNames.login
        || window.location.pathname === pathNames.signin)

    // isUserNoAuth: boolean - пользователь НЕавторизован и НЕ находится на '/login' или '/signin'
    const isUserNoAuth = !store.state.auth &&
      window.location.pathname !== pathNames.login &&
      window.location.pathname !== pathNames.signin

    if (isUserAuth) {
      historyPush(pathNames.chats);
    } else if (isUserNoAuth) {
      historyPush(pathNames.login);
    }

    if (prevState.activeChat !== newState.activeChat) {
      if (newState.activeChat) webSocketApi.createSocket(newState.activeChat);
    }
  })
}