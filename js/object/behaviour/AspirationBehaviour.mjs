import { Behaviour } from "./Behaviour.mjs";

export class AspirationBehaviour extends Behaviour{

    /** @type {number} */
    aspiration=0

    /**
     * 
     * @param {number=} aspiration
     */
    constructor(aspiration){
        super()
        this.aspiration=aspiration || 1
    }

    /** @override */
    init(world, objects){}

    /** @override */
    tick(world, aspirators, aspireds){
        //console.log(Array.from(aspireds).map(a=>a.id), Array.from(aspirators).map(a=>a.id))
        for(let aspirator of aspirators){
            for(let aspired of aspireds){
                console.log(aspirator.id, aspired.id)
                let dx=aspired.x-aspirator.x
                let dy=aspired.y-aspirator.y
                let d=Math.sqrt(dx*dx+dy*dy)
                if(d>0){
                    dx/=d
                    dy/=d
                    aspired.dx-=dx*this.aspiration
                    aspired.dy-=dy*this.aspiration
                }
            }
        }
    }

    /** @override */
    finish(world, objects){ }

    
}