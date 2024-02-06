import { Drawable } from "../drawable/Drawable.mjs"
import { fastDelete } from "../lang/Array.mjs"
import { Behaviour } from "./behaviour/Behaviour.mjs"
import { ObserverGroup } from "./observers/ObserverGroup.mjs"

let obj_counter=0

/**
 * represents a game object tag.
 * @typedef {(string|number)} Tag
 */

/**
 * Represents a game object.
 * @extends {any}
 * @class
 */
export class GameObject{
    /** @type {World} */
    world

    /** @type {Tag[]} */
    tags=[]

    /** @type {number} */
    id=obj_counter++

    /** @type {Object.<string|number,ObserverGroup>} */
    #observers={}


    /**
     * 
     * @param {World} world 
     * @param {any=} data 
     */
    constructor(world, data){
        this.world=world
        if(data){
            Object.assign(this,data)
        }
    }

    /**
     * @param {Drawable} drawable
     */
    draw(drawable){
        drawable.paintCircle(this["color"] || [255,255,255,1])
    }

    /**
     * @param {string|number} name
     * @returns {ObserverGroup}
     */
    observers(name){
        let group=this.#observers[name]
        if(group===undefined){
            group=new ObserverGroup()
            this.#observers[name]=group
        }
        return group
    }
}

class BehaviourEntry{
    /** @type {Behaviour} */
    behaviour
    /** @type {Tag[]} */
    tags=[]

    /**
     * @param {Behaviour} behaviour
     */
    constructor(behaviour){
        this.behaviour=behaviour
    }
}

/**
 * Represente a dictionnary associating multiple tags to taggeds objects with fast access.
 * @class
 * @template {{tags:Tag[]}} T
 */
class TaggedDict{
    /** @type {Object.<Tag,T[]>} */
    dict={}

    /**
     * Adds an entry to the tagged dictionary.
     * @param {Tag[]} tags - The tags for the entry.
     * @param {T} entry - The entry to add.
     */
    add(tags, entry) {
        // Add to the dictionaries
        for(const tag of tags){
            if(!entry.tags.includes(tag)){
                let list=this.dict[tag]
                if(list===undefined){
                    list=[]
                    this.dict[tag]=list
                }
                list.push(entry)
                entry.tags.push(tag)
            }
        }
    }

    /**
     * 
     * @param {T} entry 
     * @param {Tag} tag 
     */
    removeTag(entry,tag){
        // Find in entry tag list
        let inside_index=entry.tags.indexOf(tag)
        if(inside_index===undefined)throw new Error(`Does not have tag ${tag}`)
        fastDelete(entry.tags,inside_index)
        
        // Remove from dict tag list
        let list=this.dict[tag]
        if(list===undefined)throw new Error("Corrupted Tagged Dict")
        var index=list.indexOf(entry)
        if(index===undefined)throw new Error("Corrupted Tagged Dict")
        fastDelete(list,index)
    }

    /**
     * Remove an entry
     * @param {T} entry 
     */
    remove(entry){
        for(const tag of entry.tags){
            this.removeTag(entry,tag)
        }
    }
    
}

export class World{

    /** @type {TaggedDict<GameObject>} */
    objects=new TaggedDict()

    /** @type {GameObject[]} */
    objects_list=[]

    /** @type {TaggedDict<BehaviourEntry>} */
    behaviours=new TaggedDict()

    /** @type {BehaviourEntry[]} */
    behaviours_list=[]

    /* @type {number} */
    width

    /* @type {number} */
    height

    /* @type {number} */
    depth


    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth
     */
    constructor(width, height, depth){
        this.width = width
        this.height = height
        this.depth = depth
    }

    
    /**
     * @param {Drawable} drawable 
     */
    draw(drawable){
        for(let object of /** @type {any[]} */(this.objects_list)){
            if(object.get_shape){
                let shape=object.get_shape()
                shape.draw(
                    drawable,
                    object["color"] || [255,255,255,1],
                    this.height,
                    this.width,
                    this.depth
                )
            }
        }
    }

    tick(){
        for(let behav of this.behaviours_list){
            behav.behaviour.tick(this,...this.#getParams(behav))
        }
    }

    /**
     * @param {Tag[]} tags The object tags
     * @param {any=} data Custom objet data
     * @param {number=} count Number of objects to add, default to 1 unique
     * @returns {GameObject|GameObject[]} An array of the objects added, or one object if no count is passed
     */
    addObj(tags,data,count){
        // Add object
        if(!tags)throw new Error("Cannot add an object with no tags")
        let c=count || 1
        let addeds=[]
        for(let i=0;i<c;i++){
            let object=new GameObject(this)
            this.objects.add(tags,object)
            this.objects_list.push(object)
            addeds.push(object)
        }

        // Init behaviours
        this.forBehav(tags, behaviour=>{
            behaviour.behaviour.init(this,...this.#getParamsOf(behaviour,tags,addeds))
        })

        for(let object of addeds){
            Object.assign(object,data)
        }

        if(count===undefined)return addeds[0]
        else return addeds
    }

    /**
     * @param {GameObject} object The object to remove
     */
    removeObj(object){
        // Finish behaviours
        this.forBehav(object.tags, behaviour=>{
            behaviour.behaviour.init(this,...this.#getParamsOf(behaviour,object.tags,[object]))
        })

        // Remove
        this.objects.remove(object)
        let index=this.objects_list.indexOf(object)
        fastDelete(this.objects_list,index)
    }

        

    /**
     * Add a behaviour to the world.
     * @param {Tag[]} tags - The tags for the behaviour.
     * @param {Behaviour} behaviour - The behaviour to add.
     * @returns {BehaviourEntry} The behaviour entry.
     */
    addBehav(tags, behaviour) {
        // Add
        let entry=new BehaviourEntry(behaviour)
        this.behaviours_list.push(entry)
        this.behaviours.add(tags, entry)

        // Init behaviour
        entry.behaviour.init(this,...this.#getParams(entry))
        return entry
    }

    /**
     * Remove a behaviour from the world.
     * @param {BehaviourEntry} behaviour - The behaviour to remove.
     */
    removeBehav(behaviour) {
        // Finish behaviour
        behaviour.behaviour.finish(this,...this.#getParams(behaviour))

        // Remove
        this.behaviours.remove(behaviour)
        fastDelete(this.behaviours_list,this.behaviours_list.indexOf(behaviour))
    }

    /**
     * Get object list to give to behaviour
     * @param {BehaviourEntry} behaviour 
     * @returns {Iterable<GameObject>[]}
     */
    #getParams(behaviour){
        let params=[]
        for(let tag_param of behaviour.tags){
            // Get tag group
            let tag_group
            if(Array.isArray(tag_param)){
                tag_group=tag_param
            }
            else{
                tag_group=[tag_param]
            }

            // Get object groups
            let object_groups=tag_group.map(tag=>this.objects.dict[tag] || [])

            // Get iterable
            let iterator=function*(){
                for(let objs of object_groups){
                    yield* objs
                }
            }

            params.push({
                [Symbol.iterator](){
                    return iterator()
                }
            })
        }
        return params
    }

    /**
     * Get object list to give to behaviour
     * @param {BehaviourEntry} behaviour 
     * @param {Tag[]} tags
     * @param {GameObject[]} objects
     */
    #getParamsOf(behaviour, tags, objects){
        let params=[]
        for(let tag of behaviour.tags){
            if(tags.includes(tag))params.push(objects)
            else params.push([])
        }
        return params
    }

    /**
     * 
     * @param {Tag[]} tags
     * @param {(behaviour:BehaviourEntry)=>void} callback
     */
    forBehav(tags, callback){
        for(let tag of tags){
            let list=this.behaviours.dict[tag]
            if(list!==undefined){
                for(let behaviour of list){
                    callback(behaviour)
                }
            }
        }
    }
}