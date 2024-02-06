import { CanvasDrawable } from "./drawable/CanvasDrawable.mjs";
import { World } from "./object/GameObject.mjs";
import { MovementBehaviour } from "./object/behaviour/MovementBehaviour.mjs";
import { GravityBehaviour } from "./object/behaviour/force/GravityBehaviour.mjs";
import { WorldLimitBehaviour } from "./object/behaviour/collision/WorldLimitBehaviour.mjs";
import { PushCollisionBehaviour } from "./object/behaviour/force/PushCollisionBehaviour.mjs";
import { CollisionBehaviour } from "./object/behaviour/collision/CollisionBehaviour.mjs";
import { AspirationBehaviour } from "./object/behaviour/force/AspirationBehaviour.mjs";
import { ShapeBehaviour } from "./object/behaviour/ShapeBehaviour.mjs";
import { BoxShape, CircleShape } from "./collision/Shape.mjs";
import { BabylonJSDrawable } from "./drawable/BabylonJSDrawable.mjs";
import { FrictionBehaviour } from "./object/behaviour/force/FrictionBehaviour.mjs";
import { ControlMoveBehaviour } from "./object/behaviour/controls/ControlMoveBehaviour.mjs";
import { ControlJumpBehaviour } from "./object/behaviour/controls/ControlJumpBehaviour.mjs";
import { ControlDashBehaviour } from "./object/behaviour/controls/ControlDashBehaviour.mjs";
import { ControlSizeBehaviour } from "./object/behaviour/controls/ControlSizeBehaviour copy.mjs";
import { isKeyPressed } from "./controls/Keyboard.mjs";
import { tickWorld } from "./object/plugin/Plugin.mjs";
import { TestPlugin } from "./ExamplePlugin.mjs";


async function main() {
    // Get Display
    const canvas = document.getElementById("target")
    if(!(canvas instanceof HTMLCanvasElement))throw new Error("Canvas not found")
    //const drawable=new CanvasDrawable(canvas)
    const drawable=new BabylonJSDrawable(canvas, 0,0,0, 100,100,100)

    // Initialisation du monde
    const size=10_000
    const world = new World(size,size,size);

    tickWorld(canvas, drawable, [new TestPlugin()], 30)

    /*
    // Ajout des tags
    let counter=0
    let id = ()=>{return counter++}

    let PHYSICAL = id()

    let MOVING = id()
    let FIXED = id()
    let BOUNCING = id()

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
    world.addBehav([MOVING],new FrictionBehaviour(0.96))
    world.addBehav([MOVING],new GravityBehaviour(0,10,0))

    world.addBehav([BOUNCING],new MovementBehaviour(0.99))
    world.addBehav([BOUNCING],new PushCollisionBehaviour(0.2))
    world.addBehav([BOUNCING],new GravityBehaviour(0,8,0))

    world.addBehav([FIXED],new MovementBehaviour(0))

    world.addBehav([PHYSICAL],new WorldLimitBehaviour(0.1))
    world.addBehav([PHYSICAL],new CollisionBehaviour())

    world.addBehav([CONTROL],new ControlMoveBehaviour(10))
    world.addBehav([CONTROL],new ControlJumpBehaviour(200,2))
    world.addBehav([CONTROL],new ControlDashBehaviour(200,100))
    world.addBehav([CONTROL],new ControlSizeBehaviour())

    world.addBehav([ASPIRATOR,PHYSICAL],new AspirationBehaviour(1))

    // Ajout des objets
    for(let i=0; i<4; i++){
        //world.addObj(["jeton"],{x:Math.random()*5000,y:500+Math.random()*500,size:300, color:[255,0,0,1]})
        //world.addObj(["jeton"],{x:Math.random()*5000,y:500+Math.random()*500,size:300, color:[0,0,255,1]})
    }
    //world.addObj(["mur"],{x:2500,y:4500,size:4000})

    // Boucle de jeu
    setInterval(()=>{
        if(isKeyPressed("KeyU")){
            let x=world.width/2 + Math.random()*100
            let z=world.depth/2 + Math.random()*100
            let dx=Math.random()*1000-500
            let dz=Math.random()*1000-500
            world.addObj([PHYSICAL, CIRCLE, MOVING],{
                x:x, y:world.height*0.9, z:z,
                dx:dx, dy:-500, dz:dz,
                size:800,
                color:[255,200,200,1]
            })
        }
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
            world.addObj([PHYSICAL, BOUNCING, CIRCLE],{x:x, y:y, z:2500, size:800, color:[255,255,0,1]})
        }
        else if(e.ctrlKey){
            world.addObj([PHYSICAL, FIXED, WALL],{x:x, y:y, z:2500, size:300, color:[255,0,255,1]})
        }
        else if(e.altKey){
            world.addObj([PHYSICAL, CIRCLE, MOVING, CONTROL],{x:x, y:y, z:2500, size:1000, color:[255,0,0,1]})
        }
        else{
            world.addObj([PHYSICAL, SQUARE, MOVING],{x:x, y:y, z:2500, size:1000, color:[0,255,0,1]})
        }
    }*/

}

main().catch(console.error);
