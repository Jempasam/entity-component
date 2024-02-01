import { eatKeyPress, isKeyPressed } from "../../controls/Keyboard.mjs";
import { Behaviour } from "./Behaviour.mjs";

export class MoveBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} speed
     * @param {number=} jump_strength
     * @param {number=} jump_count
     */
    constructor(speed=10, jump_strength=200, jump_count=2){
        super()
        this.speed=speed
        this.jump_strength=jump_strength
        this.jump_count=jump_count
    }

    /** @override */
    init(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").add("MoveBehaviour", (v,obj1,obj2) => {
                if(v[1]>0){
                    obj1.jump_count=this.jump_count
                }
            })
        }
    }

    /** @override */
    tick(world, objects){
        // Move
        let dx=0
        let dz=0
        if(isKeyPressed("q")) dx+=-1
        if(isKeyPressed("d")) dx+=1
        if(isKeyPressed("z")) dz+=1
        if(isKeyPressed("s")) dz+=-1
        let d=Math.sqrt(dx*dx+dz*dz)
        if(d){
            dx*=this.speed/d
            dz*=this.speed/d

            for(let object of objects){
                object.dx+=dx
                object.dz+=dz
            }
        }

        // Jump
        if(eatKeyPress(" ")){
            for(let object of objects){
                if(object.jump_count>0){
                    let dy=Math.max(0,this.jump_strength+object.dy)
                    object.dy-=dy
                    object.jump_count--
                }
            }
        }
    }

    /** @override */
    finish(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").remove("MoveBehaviour")
        }
    }

    
}