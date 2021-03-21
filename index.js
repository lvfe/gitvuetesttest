function defineReactive(obj, key, value){
    Object.defineProperty(obj, key, {
        get: ()=>{
            console.log('get', value);
            return value;
        },
        set: (newvalue) => {
            if(value!=newvalue)
                value = newvalue;
            console.log('set', newvalue)
        }
    })
}
const obj = {'a': 1};
defineReactive(obj, 'a', 2);