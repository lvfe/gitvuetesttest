const express= require('express')

const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
const app = express()
const vapp ={
    template: `<div>tee</div>`,
    data(){
        return {
            items: []
        }
    }
}

app.get('/', async function(req,res){
    let vueapp = new Vue(vapp)
    const html = await renderer.renderToString(vueapp)
    res.send(html)
})
app.listen(3000)