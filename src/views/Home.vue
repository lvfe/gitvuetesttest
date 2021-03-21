<template>
  <div class="home">hello {{ title }} - {{ courses }}</div>
</template>

<script>
// @ is an alias to /src
// 模拟异步调用
const getCources = () => {
      return new Promise(resolve => {
        setTimeout(()=> {
          resolve(['welcome', 'father'])
        }, 2000);
      })
    }
export default {
  name: 'Home',
  data() {
    return {
      title: 'hi',
      type: '~miniwebp',
      host: '',
      courses: [
        {image: `${this.host}01.jpg${this.type}`}
      ]
    }
  },
  beforeCreate(){
    console.log("beforecreate", this.$el)
  },
  async created(){
    console.log("create", this.$el)
    const a=0;
    
    const result = await getCources();
    this.courses = result;
  },
  beforeMount(){
    console.log("beforeMounted", this.$el)
  },
  mounted(){
    console.log("mounted", this.$el)
  },
  methods(){
    
  }
}
</script>
