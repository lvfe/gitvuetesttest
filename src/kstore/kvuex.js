let Vue
// 声明Store类
class Store {
  constructor(options) {
    let computed = {};
    this._vm = new Vue({
      // data中的值都会做响应化处理
      data: {
        $$state: options.state
      },
      getters: options.getters,
      computed
    })

    // 保存mutations
    this._mutations = options.mutations
    this._actions = options.actions
    this.getters = options.getters

    // 锁死commit,dispatch函数this指向
    const store = this
    const { commit, dispatch } = store
    this.commit = function boundCommit(type, payload) {
      commit.call(store, type, payload)
    }
    this.dispatch = function boundDispatch(type, payload) {
      dispatch.call(store, type, payload)
    }
    

    Object.keys(this.getters).forEach(key => {
      console.log(store.state);
      computed[key] = () => store.getters[key](store.state);
      Object.defineProperty(store.getters, key, {
        get: ()=>this._vm[key]
      })
    });
    
  }
  // 存取器使之成为只读
  get state() {
    return this._vm._data.$$state
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }

  // commit，修改状态
  commit(type, payload) {
    // 1.获取mutation
    const entry = this._mutations[type]

    if (!entry) {
      console.error('大兄弟，没有这个mutation');
      return;
    }

    entry(this.state, payload)

  }

  // dispatch，执行异步任务或复杂逻辑
  dispatch(type, payload) {
    // 1.获取action
    const entry = this._actions[type]

    if (!entry) {
      console.error('大兄弟，没有这个action');
      return;
    }

    entry(this, payload)

  }

}

// install方法
function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    // 尽早执行
    beforeCreate() {
       if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }