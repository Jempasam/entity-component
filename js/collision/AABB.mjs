
/**
 * 3 Dimentionnal Axis Aligned Bounding Box
  
 */
export class AABB{

    constructor(x, y, z, width, height, depth){
        this.x=x
        this.y=y
        this.z=z
        this.width=width
        this.height=height
        this.depth=depth
    }

    /**
     * Test if a point is inside the box
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {boolean}
     */
    testPoint(x, y, z){
        return (
            x>=this.x && x<=this.x+this.width &&
            y>=this.y && y<=this.y+this.height &&
            z>=this.z && z<=this.z+this.depth
        )
    }

    /**
     * Test if an AABB collide with this
     * @param {AABB} aabb
     * @returns {boolean}
     */
    testAABB(aabb){
        return (
            this.x+this.width>=aabb.x && this.x<=aabb.x+aabb.width &&
            this.y+this.height>=aabb.y && this.y<=aabb.y+aabb.height &&
            this.z+this.depth>=aabb.z && this.z<=aabb.z+aabb.depth
        )
    }
    
    /**
     * Test if an AABB collide with this and return the penetration vector else return false
     * @param {AABB} aabb
     * @returns {boolean|[number,number,number]}
     */
    penetrationAABB(aabb){
        // Center of AABB This
        let center_x=this.x+this.width/2
        let center_y=this.y+this.height/2
        let center_z=this.z+this.depth/2

        // Center of AABB aabb
        let center_x2=aabb.x+aabb.width/2
        let center_y2=aabb.y+aabb.height/2
        let center_z2=aabb.z+aabb.depth/2

        // Offset between center of AABB This and center of AABB aabb
        let ox=center_x-center_x2
        let oy=center_y-center_y2
        let oz=center_z-center_z2

        // Distance between center of AABB This and center of AABB aabb
        let dx=Math.abs(ox)
        let dy=Math.abs(oy)
        let dz=Math.abs(oz)

        // Cumulated radius of AABB This and AABB aabb
        let sx=(this.width+aabb.width)/2
        let sy=(this.height+aabb.height)/2
        let sz=(this.depth+aabb.depth)/2

        // If distance between center of AABB This and center of AABB aabb is less than cumulated radius of AABB This and AABB aabb
        if(dx<sx && dy<sy && dz<sz){
            // Relative distance between center of AABB This and center of AABB aabb
            let ddx=Math.abs(dx/sx)
            let ddy=Math.abs(dy/sy)
            let ddz=Math.abs(dz/sz)
            if(ddx>ddy){
                if(ddz>ddx){
                    return [0,0,oz<0 ? sz-dz : -sz+dz ]
                }
                else{
                    return [ox<0 ? sx-dx : -sx+dx,0,0]
                }
            }
            else{
                if(ddz>ddy){
                    return [0,0,oz<0 ? sz-dz : -sz+dz]
                }
                else{
                    return [0,oy<0 ? sy-dy : -sy+dy,0]
                }
            }
        }
        else return false
    }

    /**
     * Test if a sphere collide with this and return the penetration vector else return false
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} radius
     */
    testSphere(x,y,z,radius){
        // Center of AABB This
        let center_x=this.x+this.width/2
        let center_y=this.y+this.height/2
        let center_z=this.z+this.depth/2

        // Offset between center of AABB This and center of sphere
        let ox=center_x-x
        let oy=center_y-y
        let oz=center_z-z

        // Distance between center of AABB This and center of sphere
        let dx=Math.abs(ox)
        let dy=Math.abs(oy)
        let dz=Math.abs(oz)
        let d=Math.sqrt(dx**2+dy**2+dz**2)
        
        // Nearest point of the box to the sphere
        let nx,ny,nz
        if(dx>this.width/2){
            nx=this.width/2*(ox>0 ? 1 : -1)
        }
        else nx=ox
        if(dy>this.height/2){
            ny=this.height/2*(oy>0 ? 1 : -1)
        }
        else ny=oy
        if(dz>this.depth/2){
            nz=this.depth/2*(oz>0 ? 1 : -1)
        }
        else nz=oz

        
        // Distance between the center of this and the border of this in the direction of sphere
        let cdx=Math.sqrt(nx**2+ny**2+nz**2)
        // If distance between center of AABB This and center of sphere is less than cumulated radius of AABB This and sphere
        return radius+cdx>d
    }

    /**
     * Test if a sphere collide with this and return the penetration vector else return false
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} radius
     */
    penetrationSphere(x,y,z,radius){
        // Center of AABB This
        let center_x=this.x+this.width/2
        let center_y=this.y+this.height/2
        let center_z=this.z+this.depth/2

        // Offset between center of AABB This and center of sphere
        let ox=center_x-x
        let oy=center_y-y
        let oz=center_z-z

        // Distance between center of AABB This and center of sphere
        let dx=Math.abs(ox)
        let dy=Math.abs(oy)
        let dz=Math.abs(oz)
        let d=Math.sqrt(dx**2+dy**2+dz**2)
        
        // Nearest point of the box to the sphere
        let nx,ny,nz
        if(dx>this.width/2){
            nx=this.width/2*(ox>0 ? 1 : -1)
        }
        else nx=ox
        if(dy>this.height/2){
            ny=this.height/2*(oy>0 ? 1 : -1)
        }
        else ny=oy
        if(dz>this.depth/2){
            nz=this.depth/2*(oz>0 ? 1 : -1)
        }
        else nz=oz

        
        // Distance between the center of this and the border of this in the direction of sphere
        let cdx=Math.sqrt(nx**2+ny**2+nz**2)
        let depth=radius+cdx-d
        // If distance between center of AABB This and center of sphere is less than cumulated radius of AABB This and sphere
        if(radius+cdx<d)return false
        else{
            let ddx=dx/this.width
            let ddy=dy/this.height
            let ddz=dz/this.depth
            // Penetration vector perpendicular to the cube surface
            if(ddx>ddy){
                if(ddz>ddx){
                    return [0,0,oz<0 ? depth : -depth ]
                }
                else{
                    return [ox<0 ? depth : -depth,0,0]
                }
            }
            else{
                if(ddz>ddy){
                    return [0,0,oz<0 ? depth : -depth]
                }
                else{
                    return [0,oy<0 ? depth : -depth,0]
                }
            }
        }
    }
}

/**
 * Test a collision between two spheres
 * @param {number} x1
 * @param {number} y1
 * @param {number} z1
 * @param {number} radius1
 * @param {number} x2
 * @param {number} y2
 * @param {number} z2
 * @param {number} radius2
 */
export function sphereTestSphere(x1,y1,z1,radius1,x2,y2,z2,radius2){
    let dx=x1-x2
    let dy=y1-y2
    let dz=z1-z2
    let d=Math.sqrt(dx**2+dy**2+dz**2)
    return d<radius1+radius2
}

/**
 * Test a collision between two spheres and return the penetration vector else return false
 * @param {number} x1
 * @param {number} y1
 * @param {number} z1
 * @param {number} radius1
 * @param {number} x2
 * @param {number} y2
 * @param {number} z2
 * @param {number} radius2
 */
export function spherePenetrationSphere(x1,y1,z1,radius1,x2,y2,z2,radius2){
    let dx=x1-x2
    let dy=y1-y2
    let dz=z1-z2
    let d=Math.sqrt(dx**2+dy**2+dz**2)
    let depth=radius1+radius2-d
    if(depth<0)return false
    else{
        let ddx=dx/d
        let ddy=dy/d
        let ddz=dz/d
        return [-ddx*depth,-ddy*depth,-ddz*depth]
    }
}