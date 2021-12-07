import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tarefas: [
      {
        id: 1,
        descricao: "Tarefa X",
        status: "ABERTA",
      },
      {
        id: 2,
        descricao: "Tarefa Z",
        status: "EM_ANDAMENTO",
      },
      {
        id: 3,
        descricao: "Tarefa W",
        status: "CONCLUIDA",
      },
      {
        id: 4,
        descricao: "Tarefa Y",
        status: "CANCELADA",
      },
    ],
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
    }
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
    }

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
