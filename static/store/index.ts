import mutations from './mutations';
import actions from './actions';
import state from './state';
import Store from './store';

export default new Store({
  actions,
  mutations,
  state,
});
