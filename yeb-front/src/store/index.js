import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "@/utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Notification } from 'element-ui'

Vue.use(Vuex)
const now = new Date();
// const Stomp = require('webstomp-client')
const store = new Vuex.Store({
  state: {
    routes:[],
    user: {
      name: window.sessionStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.sessionStorage.getItem('user' || '[]')).name,
      userFace: window.sessionStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.sessionStorage.getItem('user' || '[]')).userFace
    },
    sessions: {},
    admins: [],
    currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
    currentSession: null,
    filterKey:'',
    stomp: null,
    idDot: {}
  },
  
  mutations:{
    initRoutes(state,data){
      state.routes = data;
    },
    initUser(state, user) {
      window.sessionStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    changeCurrentSession (state,currentSession) {
      state.currentSession = currentSession;
      Vue.set(state.idDot, state.currentAdmin.username + '#' + currentSession.username, false)
    },
    addMessage (state, msg) {
      let mss = state.sessions[state.currentAdmin.username + '#' + msg.to];
      if(!mss){
        // state.sessions[state.currentAdmin.username + '#' + msg.to] = [];
        Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, []);
      }
      state.sessions[state.currentAdmin.username + '#' + msg.to].push({
        content: msg.content,
        date: new Date(),
        self: !msg.notSelf
      })
    },
    INIT_DATA (state) {
      //浏览器本地历史聊天记录
      // let data = localStorage.getItem('vue-chat-session');
      // //console.log(data)
      // if (data) {
      //   state.sessions = JSON.parse(data);
      // }
    },
    INIT_ADMINS(state, data){
      state.admins = data;
    },
  },
  
  actions:{
    connect(context){
      context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
      let token = window.sessionStorage.getItem('tokenStr');
      context.state.stomp.connect({'Auth-Token':token},success=>{
        // 订阅消息
        context.state.stomp.subscribe('/user/queue/chat', msg => {
          // console.log(msg.body);
          let receiveMsg = JSON.parse(msg.body);
          console.log(receiveMsg);
          if(!context.state.currentSession || receiveMsg.from != context.state.currentSession.username){
            Notification.info({
              title: '[' + receiveMsg.fromNickName + ']发来了一条消息',
              message: receiveMsg.content.length>10?receiveMsg.content.substr(0,10):receiveMsg.content,
              position: 'bottom-right'
            });
            Vue.set(context.state.idDot, context.state.currentAdmin.username + '#' + receiveMsg.from, true)
          }
          receiveMsg.notSelf = true;
          receiveMsg.to = receiveMsg.from;
          context.commit('addMessage', receiveMsg);
        })
      },error=>{

      })
    },
    initData (context) {
      getRequest('/chat/admin').then(resp=>{
        if(resp){
          context.commit('INIT_ADMINS', resp)
        }
      })
      // context.commit('INIT_DATA')
    }
  }

})


store.watch(function (state) {
  return state.sessions
},function (val) {
  console.log('CHANGE: ', val);
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})
export default store;
