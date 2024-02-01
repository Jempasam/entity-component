import { CanvasDrawable } from "./drawable/CanvasDrawable.mjs";
import { World } from "./object/GameObject.mjs";
import { MovementBehaviour } from "./object/behaviour/MovementBehaviour.mjs";
import { GravityBehaviour } from "./object/behaviour/GravityBehaviour.mjs";
import { WorldLimitBehaviour } from "./object/behaviour/WorldLimitBehaviour.mjs";
import { PushCollisionBehaviour } from "./object/behaviour/PushCollisionBehaviour.mjs";
import { CollisionBehaviour } from "./object/behaviour/CollisionBehaviour.mjs";
import { AspirationBehaviour } from "./object/behaviour/AspirationBehaviour.mjs";
import { ShapeBehaviour } from "./object/behaviour/ShapeBehaviour.mjs";
import { BoxShape, CircleShape } from "./collision/Shape.mjs";
import { BabylonJSDrawable } from "./drawable/BabylonJSDrawable.mjs";
import { FrictionBehaviour } from "./object/behaviour/FrictionBehaviour.mjs";
import { ControlBehaviour } from "./object/behaviour/ControlBehaviour.mjs";

async function main() {
    // Get Display
    const canvas = document.getElementById("target")
    if(!(canvas instanceof HTMLCanvasElement))throw new Error("Canvas not found")
    //const drawable=new CanvasDrawable(canvas)
    const drawable=new BabylonJSDrawable(canvas)

    // Initialisation du monde
    const world = new World(5000,5000,5000);

    // Ajout des tags
    let counter=0
    let id = ()=>{return counter++}

    let PHYSICAL = id()

    let MOVING = id()
    let FIXED = id()

    let ASPIRATOR = id()

    let CIRCLE=id()
    let SQUARE=id()
    let WALL=id()

    let CONTROL=id()


    // Ajout des behaviours
    world.addBehav([CIRCLE],new ShapeBehaviour(new CircleShape(0,0,0,1)))
    world.addBehav([SQUARE],new ShapeBehaviour(new BoxShape(0,0,0,100,100,100)))
    world.addBehav([WALL],new ShapeBehaviour(new BoxShape(0,0,0,1000,100,100)))
    
    world.addBehav([MOVING],new MovementBehaviour(0.98))
    world.addBehav([MOVING],new PushCollisionBehaviour(0.2))
    world.addBehav([MOVING],new FrictionBehaviour(0.95))
    world.addBehav([MOVING],new GravityBehaviour(0,10,0))

    world.addBehav([FIXED],new MovementBehaviour(0))

    world.addBehav([PHYSICAL],new WorldLimitBehaviour(0.1))
    world.addBehav([PHYSICAL],new CollisionBehaviour())

    world.addBehav([CONTROL],new ControlBehaviour(10, 200, 2))

    world.addBehav([ASPIRATOR,PHYSICAL],new AspirationBehaviour(1))

    // Ajout des objets
    for(let i=0; i<4; i++){
        //world.addObj(["jeton"],{x:Math.random()*5000,y:500+Math.random()*500,size:300, color:[255,0,0,1]})
        //world.addObj(["jeton"],{x:Math.random()*5000,y:500+Math.random()*500,size:300, color:[0,0,255,1]})
    }
    //world.addObj(["mur"],{x:2500,y:4500,size:4000})

    // Boucle de jeu
    setInterval(()=>{
        world.tick()
    },30)

    requestAnimationFrame(function draw(){
        drawable.clear()
        //drawable.paint([0,0,0,1])
        world.draw(drawable)
        requestAnimationFrame(draw)
    })

    canvas.onclick=function(e){
        let x=(e.x-canvas.clientLeft)/canvas.clientWidth*world.width
        let y=(e.y-canvas.clientTop)/canvas.clientHeight*world.height
        if(e.shiftKey){
            world.addObj([PHYSICAL, MOVING, CIRCLE],{x:x, y:y, z:2500, size:1000, color:[255,255,0,1]})
        }
        else if(e.ctrlKey){
            world.addObj([PHYSICAL, FIXED, WALL],{x:x, y:y, z:2500, size:300, color:[255,0,255,1]})
        }
        else if(e.altKey){
            world.addObj([PHYSICAL, SQUARE, MOVING, CONTROL],{x:x, y:y, z:2500, size:1000, color:[255,0,0,1]})
        }
        else{
            world.addObj([PHYSICAL, SQUARE, MOVING],{x:x, y:y, z:2500, size:1000, color:[0,255,0,1]})
        }
    }

}

main().catch(console.error);
