import eventBus from '../service/EventBus/eventBus';
import { stateType, stateKey } from './typeStore';
import { mutationsType, mutationsKey } from './mutations';
import { actionsKey, actionsType } from './actions';
import cloneDeep from '../service/cloneDeep';
import { eventsName } from '../constants';

type Params = {
  mutations: mutationsType;
  state: stateType;
  actions: actionsType;
};

export default class Store {
  actions!: actionsType;
  mutations!: mutationsType;
  state!: stateType;
  status!: string;
  events!: eventBus;

  constructor(params: Params) {
    const self = this;
    self.actions = params.actions;
    self.mutations = params.mutations;
    self.status = 'resting';
    self.events = new eventBus();
    self.state = this._makePropsProxy({...params.state}, self);
  }

  _makePropsProxy(state: stateType, self: Store) {
    return new Proxy(state || {}, {
      set: function (state, key: stateKey, value) {
        state[key] = value;
        console.log(`stateChange: ${key}: ${value}`);

        if (self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }
        self.status = 'resting';
        return true;
      },
    });
  }

  dispatch(actionKey: actionsKey, payload?: any) {
    const self = this;
    if (typeof self.actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey} doesn't exist.`);
      return false;
    }
    console.groupCollapsed(`ACTION: ${actionKey}, payload: `, payload);
    self.status = 'action';
    self.actions[actionKey](self, payload);
    // const oldState = cloneDeep(self.state);
    // console.log('oldState: ', oldState);
    console.groupEnd();

    return true;
  }

  commit(mutationKey: mutationsKey, payload?: any) {
    // console.log('mutation in commit: ', mutationKey, 'payload: ', payload);
    const self = this;
    if (typeof self.mutations[mutationKey] !== 'function') {
      console.log(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }
    self.status = 'mutation';
    const newState = self.mutations[mutationKey](self.state, payload);
    // console.log('newState: ', newState);
    const prevState = cloneDeep(self.state);
    self.state = this._makePropsProxy(newState, self);
    // console.log('prevState: ', prevState);
    // console.log('newState: ', newState);
    self.events.emit(eventsName.stateChange, {
      prevState: prevState,
      newState: self.state,
    });
    // console.log('STATE: ', self.state);

    return true;
  }
}
