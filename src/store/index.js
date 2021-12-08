import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tarefas: [],
    usuario: null
  },
  mutations: {
    setUsuario(state, usuario){
      state.usuario = usuario 
      Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${usuario.token}`
      localStorage.setItem('__minhastarefas_user', JSON.stringify(usuario))
    },
    limparUsuario(state ){
      state.usuario = null 
      delete Vue.prototype.$http.defaults.headers.common['Authorization']
      localStorage.removeItem('__minhastarefas_user')
    },
    setTarefas( state, response ) {
      state.tarefas = response.data._embedded.tarefaResponseList
    },
  },
  actions: {
    login({ commit}, usuario) {
      Vue.prototype.$http
        .post('http://localhost:8081/minhastarefas/api/auth/login', usuario)
        .then(response => {
            commit('setUsuario', response.data)
            router.push({name: 'Home'})
        })
        .catch(error => {
            console.log(error)
        })
    },
    logout({commit }){
      commit('limparUsuario')
      router.push({name: 'Login'})
    }, 
    carregarUsuario({ commit }) {
      const usuarioString= localStorage.getItem('__minhastarefas_user')

      if (usuarioString) {
        const usuario = JSON.parse(usuarioString)
        commit('setUsuario', usuario)
        Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${usuario.token}`
      }
    },
    carregarTarefas({ commit }) {

      Vue.prototype.$http
      .get('http://localhost:8081/minhastarefas/tarefa')
      .then(response => {
        commit('setTarefas',  response)
      })
      .catch(error => {
        console.log(error)
      })
    },
    executarAcao({ dispatch }, url) {
      Vue.prototype.$http
        .put(url)
        .then((response) => {
          if (response.status === 200)
            dispatch('carregarTarefas')
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  getters: {
     // https://vuex.vuejs.org/guide/getters.html#method-style-access
    tarefasPorStatus(state) {
      return status => state.tarefas.filter(
        tarefa => { return tarefa.status == status }
      )
    },
    usuario(state) {
      return state.usuario
    }
  },
  modules: {
    
  }
})
