
class Gear{
    static screwRadius = 0.5
    geartype:'screw'|'triangleteeth'
    name:string
    pos:Vector
    teeth:number
    radius:number
    angle:number
    ride:number
    slag:number
    circumference:number
    addendum:number
    dedendum:number
    rotation = 0
    teethbasewidth:number
    teethtopwidth:number
    level = 0
    // teethslopeangle
    // teethcoreangle
    
    parent:Gear
    children:Gear[] = []
    axleConnected = false

    constructor(data:Partial<Gear>){
        Object.assign(this,data)
    }

    rotate(turns,rotateChildren = true){
        this.rotation += turns

        if(rotateChildren){
            for(var child of this.children){
                if(child.axleConnected){
                    child.rotate(turns)
                }else{
                    child.rotate(-turns * (this.teeth / child.teeth))
                }
            }
        }
    }

    fill(ride){
        this.ride = ride
        this.circumference = this.teeth * ride
        this.radius = calcRadius(this.circumference)
        this.angle = 1 / this.teeth
        // if(this.geartype == 'triangleteeth' && this.axleConnected){
        //     this.rotation += ((this.teeth / 4) % 2) * this.angle 
        // }
    }

    // calcAddendumForDrivenGear(other:Gear){
    //     var A = this.angle / 2
    //     var c = this.radius
    //     var distA = c * Math.cos(A * TAU)

    //     var distB = this.radius + other.radius - distA
    //     var Addendum = distB / Math.cos(other.angle * TAU / 2)

    //     return Addendum
    // }

    static calcAddendumForTeethGear(screwgear:Gear,teethgear:Gear,screwgearslipanglepercentage = 1){
        var c = screwgear.radius// + Gear.screwRadius
        var A = screwgear.angle * screwgearslipanglepercentage * TAU
        var length1 = c * Math.cos(A)
        var length3 = c * Math.sin(A)

        var length2 = screwgear.pos.to(teethgear.pos).length() - length1
        var perfectaddendum = Math.sqrt(length2 * length2 + length3 * length3)// - Gear.screwRadius
        return perfectaddendum
    }

    calcMaxAddendumForDrivenGear(other:Gear){
        var diagonal = this.radius + other.radius
        var adjacent = this.radius

        var angle = Math.asin(adjacent/diagonal)
        return Math.sqrt(diagonal * diagonal - adjacent * adjacent)
    }


    summarize(){
        return {
            'name':this.name,
            'teeth':this.teeth,
            'radius':round(this.radius,2) ,
            'addendum':round(this.addendum,2),
            'dedendum':round(this.dedendum,2),
            'angle':round(this.angle,4) ,
            'circumference':round(this.circumference,2) ,
            'ride':round(this.ride,2),
            'position':round(this.pos.x,3) 
        }
    }
}

function calcCircumference(radius){
    return radius * TAU
}

function calcRadius(circumference){
    return circumference / TAU
}



