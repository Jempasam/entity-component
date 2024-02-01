import { AABB, spherePenetrationSphere } from "../../collision/AABB.mjs";
import { CircleShape } from "../../collision/Shape.mjs";
import { Behaviour } from "./Behaviour.mjs";

export class CollisionBehaviour extends Behaviour{

    constructor(){
        super()
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        let colliders=Array.from(objects)
        for(let i=0;i<colliders.length;i++){
            let obj1=colliders[i]
            for(let j=i+1;j<colliders.length;j++){
                let obj2=colliders[j]

                let v=obj1.get_shape().penetration(obj2.get_shape())
                
                if(v){
                    // Calculate collision depth vector
                    obj1.observers("on_collision").notify(v, obj1, obj2)
                    obj2.observers("on_collision").notify([-v[0],-v[1],-v[2]], obj2, obj1)
                }
            }
        }
    }


    /** @override */
    finish(world, objects){
    }

    
}