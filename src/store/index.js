import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import * as actions from './actions.js'
import * as getters from './getters.js'
import mutations from './mutations.js'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state,
	actions,
	getters,
	mutations,
	strict: debug,
	plugins: debug ? [createLogger()] : []
})
