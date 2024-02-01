import { Drawable } from "./Drawable.mjs"
import { defined } from "../lang/Utils.mjs"

import "https://cdn.babylonjs.com/babylon.js"

/**
 * @template T
 */
class ObjectPool{
    
    /** @type {T[]} */ #pool
    
    /** @type {number} */ #count

    /** @type {function(): T} */ #factory

    /** @type {function(T)} */ #destructor


    /**
     * @param {function(): T} factory
     * @param {function(T)} destructor
     */
    constructor(factory,destructor){
        this.#pool=[]
        this.#count=0
        this.#factory=factory
        this.#destructor=destructor
    }

    /**
     * Deallocate all objects
     */
    reset(){
        const count=this.#pool.length-this.#count
        for(let i=0; i<count; i++){
            const removed=this.#pool[this.#pool.length-1]
            destructor(removed)
            this.#pool.pop()
        }        
        this.#count=0
    }

    /**
     * Get a new object from the pool
     * @returns {T}
     */
    get(){
        let obj
        if(this.#count>=this.#pool.length){
            obj=this.#factory()
            this.#pool.push(obj)
        }
        else obj=this.#pool[this.#count]
        this.#count++
        return obj
    }
}

export class BabylonJSDrawable extends Drawable{

    #spheres

    #boxs

    get width(){ return this._width }

    get height(){ return this._height }

    get depth(){ return this._depth }


    /**
     * Create a drawable from a canvas
     * @param {HTMLCanvasElement} canvas
     * @param {number=} [x]
     * @param {number=} [y]
     * @param {number=} [z]
     * @param {number=} [width]
     * @param {number=} [height]
     * @param {number=} [depth]
     */
    constructor(canvas, x, y, z, width, height, depth){
        super()
        defined(canvas)
        if(canvas instanceof BabylonJSDrawable){
            this.scene=canvas.scene
            this.engine=canvas.engine
            this.#spheres=canvas.#spheres
            this.#boxs=canvas.#boxs
            this.x=x
            this.y=y
            this.z=z
            this._width=defined(width)
            this._height=defined(height)
            this._depth=defined(depth)
        }
        else{
            this.#spheres=new ObjectPool(
                ()=>{
                    const ret=BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 10}, this.scene)
                    ret.material=new BABYLON.StandardMaterial("sphere", this.scene)
                    return ret
                },
                (obj) => {
                    obj.material.dispose()
                    obj.dispose()
                }
            )

            this.#boxs=new ObjectPool(
                ()=>{
                    const ret=BABYLON.MeshBuilder.CreateBox("box", {size: 1}, this.scene)
                    ret.material=new BABYLON.StandardMaterial("sphere", this.scene)
                    return ret
                },
                (obj) => {
                    obj.material.dispose()
                    obj.dispose()
                }
            )
            this.x=-5
            this.y=-5
            this.z=-5
            this._width=10
            this._height=10
            this._depth=10

            this.engine=new BABYLON.Engine(canvas,true)
            this.scene = new BABYLON.Scene(this.engine);

            // Camera
            const camera = new BABYLON.ArcRotateCamera("cam", 0, 0, 0, new BABYLON.Vector3(0, 5, -15), this.scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, true);
            
            // Light
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.7;

            // Our built-in 'ground' shape.
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, this.scene);
            ground.position.y=-5

            const back = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, this.scene);
            back.position.z=5
            back.rotation.x=-Math.PI/2
        }
    }

    /**
     * @inheritDoc
     */
    draw(image){
        //this.canvas.drawImage(image,this.x,this.y,this.width,this.height)
    }

    /** @inheritdoc */
    paint(color){
        let box=this.#boxs.get()
        box.material.diffuseColor = new BABYLON.Color3(color[0]/255, color[1]/255, color[2]/255);
        box.position= new BABYLON.Vector3(this.x+this.width/2, -(this.y+this.height/2), this.z+this.depth/2)
        box.scaling=new BABYLON.Vector3(this.width, this.height, this.depth)
    }

    /** @inheritdoc */
    paintCircle(color) {
        let sphere=this.#spheres.get()
        sphere.material.diffuseColor = new BABYLON.Color3(color[0]/255, color[1]/255, color[2]/255);
        sphere.position= new BABYLON.Vector3(this.x+this.width/2, -(this.y+this.height/2), this.z+this.depth/2)
        sphere.scaling=new BABYLON.Vector3(this.width, this.height, this.depth)
    }

    /** @inheritdoc */
    clear(){
        this.#spheres.reset()
        this.#boxs.reset()
        this.scene.render();
    }
    
    /** @inheritdoc */
    sub(x,y,z,width,height,depth){
        if(width>this.width-x)width=this.width-x
        if(height>this.height-y)height=this.height-y
        if(depth>this.depth-z)depth=this.depth-z

        if(x<0){
            width+=x
            x=0
        }
        if(y<0){
            height+=y
            y=0
        }
        if(z<0){
            depth+=z
            z=0
        }
        return new BabylonJSDrawable(this, this.x+x, this.y+y, this.z+z, width, height, depth)
    }
}