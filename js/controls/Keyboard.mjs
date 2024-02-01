
let keyPresseds={}

document.addEventListener("keydown",(e)=>{
    if(!keyPresseds[e.key])keyPresseds[e.key]=1
})

document.addEventListener("keyup",(e)=>{
    delete keyPresseds[e.key]
})

export function isKeyPressed(code){
    return keyPresseds[code]
}

export function eatKeyPress(code){
    if(keyPresseds[code]==1){
        keyPresseds[code]=2
        return true
    }
    return false
}