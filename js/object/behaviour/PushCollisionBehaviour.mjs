import { Behaviour } from "./Behaviour.mjs";

export class PushCollisionBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} max_strength 
     */
    constructor(max_strength){
        super()
        this.max_strength=max_strength || 100
    }

    /** @override */
    init(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").add("PushCollision", (v,obj1,obj2) => {
                obj1.dx-=v[0]*this.max_strength
                obj1.dy-=v[1]*this.max_strength
                obj1.dz-=v[2]*this.max_strength
            })
        }
    }

    /** @override */
    tick(world, objects){}


    /** @override */
    finish(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").remove("PushCollision")
        }
    }

    
}