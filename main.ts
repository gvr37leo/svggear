/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/networking/entity.ts" />
/// <reference path="libs/networking/server.ts" />
/// <reference path="gear.ts" />

//editabe
//serialize and deserialize queryparameter

var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
ctxt.font = "2px Arial";

var camera = new Camera(ctxt)
camera.pos = new Vector(40,0)
camera.scale = new Vector(1/7,1/7)
var dragging = false
var mousepos = new Vector(0,0)


// galileo-escapement
// https://www.youtube.com/watch?v=-FEAN5k9Kyk&list=LL&index=1&t=655s
// https://www.youtube.com/watch?v=v2sQF0UFVVE&list=LL&index=17
// https://www.youtube.com/watch?v=tvd1USfd6QU&list=LL&index=16&t=1s

// https://www.calculatorsoup.com/calculators/math/prime-factors.php

//60 seconds,60 minutes,12 hours
//60 * 12 = 720
//6 * 6 * 5 * 4 =  720
// var gears = generateGears2([36, 36, 30, 24],28,new Vector(0,0))//150


// 12 / 60 / 60
// 4 * 3 / 5 * 4 * 3 / 4 * 15
var smallteethcount = 6
var gears = generateGears([4,3,5,3,2,2,4].map(v => v * smallteethcount),smallteethcount,new Vector(0,0))
var gearlevels = [2,2,3,3,4,4,3,3,2,2,1,1,0,0,1]
gears.forEach((g,i) => g.level = gearlevels[i])
//0.083 days
//1 hours
//60 minutes
//240 * 15 = 3600 seconds

//todo
//fix teethwidth on small gear
//display secondsgear
//fix clipping

function generateGears(teethcounts:number[],smallteethcount,startpos:Vector):Gear[]{
    var alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
    var ai = 0;
    var gears:Gear[] = []
    
    //both
    //teethwidth

    //big
    //slag


    //small
    //min-coreradius
    //slag

    var currentpos = startpos.c()
    var slagmargin = 0.25
    var teethbasewidth = 1
    var teethtopwidth = 1
    var dedendummargin = 0.1

    var bigslag = teethtopwidth + 2 * slagmargin + 1
    var bigride = bigslag + teethbasewidth
    
    var smallslag = teethtopwidth + slagmargin
    var smallride = smallslag + teethbasewidth
    var smallCircumference = smallteethcount * smallride
    var smallRadius = calcRadius(smallCircumference)

    for(var i = 0; i < teethcounts.length;i++){
        var teethcount = teethcounts[i]
        
        var bigCircumference = teethcount * bigride
        var bigRadius = calcRadius(bigCircumference)
        var parent = i == 0 ? null : last(gears)
        
        // var a = smallRadius
        // var b = smallRadius + bigRadius
        // var smallgearangle = (smallride - teethbasewidth / 4) / smallCircumference * TAU
        // var bigaddendum = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(smallgearangle)) - bigRadius

        var teethHeight = 1.25
        var bigaddendum = teethHeight
        var smalladdendum = teethHeight
        var smalldedendum = 0
        var bigdedendum = 0

        var bigdriver = new Gear({
            parent:parent,
            name:alphabet[ai++],
            pos:currentpos.c(),
            teeth:teethcounts[i],
            ride:bigride,
            slag:bigslag,
            radius:bigRadius,
            circumference:bigCircumference,
            addendum:bigaddendum,
            dedendum:bigdedendum,
            axleConnected:true,
            teethbasewidth:teethbasewidth,
            teethtopwidth:teethtopwidth,
            level:0,
        })
        if(parent){
            parent.children = [bigdriver]
        }
        gears.push(bigdriver)
        
        currentpos.x += smallRadius + bigRadius + teethHeight + dedendummargin

        var smallslopeangle = teethbasewidth / 4 / calcCircumference(smallRadius - smalldedendum)
        var smallteethcoreangle = teethtopwidth / smallCircumference
        var smallslagangle = smallslag / smallCircumference
        var rideangle = smallslopeangle * 2 + smallteethcoreangle + smallslagangle
        var x = smallteethcount * rideangle
        var smalldriven = new Gear({
            parent:bigdriver,
            name:alphabet[ai++],
            pos:currentpos.c(),
            teeth:smallteethcount,
            ride:smallride,
            slag:smallslag,
            radius:smallRadius,
            circumference:smallCircumference,
            addendum:smalladdendum,
            dedendum:smalldedendum,
            axleConnected:false,
            teethbasewidth:teethbasewidth,
            teethtopwidth:teethtopwidth,
            level:1,
        })
        gears.push(smalldriven)
        bigdriver.children = [smalldriven]
    }

    var teeth = 15
    var radius = 15
    var circ = calcCircumference(radius)
    var ride = circ / teeth
    var parent = last(gears)
    var secondsgear = new Gear({
        parent:parent,
        name:alphabet[ai++],
        pos:currentpos.c(),
        teeth:teeth,
        ride:ride,
        slag:ride - teethbasewidth,
        circumference:circ,
        radius:radius,
        addendum:teethHeight,
        dedendum:0,
        axleConnected:true,
        teethbasewidth:teethbasewidth,
        teethtopwidth:teethtopwidth,
    })
    parent.children = [secondsgear]
    gears.push(secondsgear)

    
    return gears
}

function drawgear(gear:Gear){
    var path:Vector[] = []

    //slag . teethbottom

    var rideangle = gear.ride / gear.circumference
    var slagangle = gear.slag / gear.circumference
    var teethbaseangle = gear.teethbasewidth / gear.circumference
    var teethcoreangle = gear.teethtopwidth /  calcCircumference(gear.radius + gear.addendum)
    var teethslopeangle = (teethbaseangle - teethcoreangle) / 2

    
    var x = slagangle + teethcoreangle + 2 * teethslopeangle//should equal rideangle
    var shouldequal1 = x * gear.teeth

    var halfteethrotation = teethslopeangle + teethcoreangle / 2
    var rot = gear.rotation - halfteethrotation
    if(gear.teeth  == 8){
        rot += rideangle / 2
    }

    var inner = gear.radius - gear.dedendum
    var outer = gear.radius + gear.addendum

    ctxt.fillStyle = 'black'
    circle(new Vector(0,-inner + 1).rotate2d(gear.rotation).add(gear.pos),0.5,true)
    ctxt.beginPath()
    moveTo(new Vector(0,-inner).rotate2d(rot).add(gear.pos))
    for(var i = 0; i < gear.teeth;i++){

        lineTo(new Vector(0,-inner).rotate2d(rot).add(gear.pos))
        var arcstart = new Vector(0,-outer).rotate2d(rot += teethslopeangle).add(gear.pos)
        var arcend = new Vector(0,-outer).rotate2d(rot += teethcoreangle).add(gear.pos)
        lineTo(arcstart)
        arcTo(arcstart,arcend,gear.pos)
        var arcstart = new Vector(0,-inner).rotate2d(rot += teethslopeangle).add(gear.pos)
        var arcend = new Vector(0,-inner).rotate2d(rot += slagangle).add(gear.pos)
        lineTo(arcstart)
        arcTo(arcstart,arcend,gear.pos)
    }
    ctxt.stroke()
    circle(gear.pos,0.7,false)
    ctxt.textAlign = 'center'
    ctxt.textBaseline = 'middle'
    if(gear.axleConnected || last(gears) == gear){
        ctxt.fillText(gear.name,gear.pos.x,gear.pos.y - 20)
        ctxt.fillText(gear.rotation.toFixed(2),gear.pos.x,gear.pos.y - 25)
    }else{
        ctxt.fillText(gear.name,gear.pos.x,gear.pos.y + 5)
    }

    var gearheight = 3
    if(gear.axleConnected){
        ctxt.fillStyle = 'black'
    }else{
        ctxt.fillStyle = 'red'
    }
    var gearwidth = gear.radius + gear.addendum
    ctxt.fillRect(gear.pos.x - gearwidth,gear.pos.y + 50 + gear.level * gearheight,gearwidth * 2, gearheight)
}






document.querySelector('#gearinfo').innerHTML = JSON.stringify(gears.map(g => g.summarize()),null,2)

document.addEventListener('mousedown',() => {
    dragging = true
})

document.addEventListener('mouseup', (e) => {
    dragging = false
})

window.addEventListener('blur', () => {
    dragging = false
})

document.addEventListener('mousemove', (e) => {
    var oldmousepos = mousepos.c()
    mousepos = getMousePos(canvas,e)

    if(dragging){
        var change = oldmousepos.to(mousepos)
        change.mul(camera.scale)
        camera.pos.add(change.scale(-1))
    }
})

canvas.addEventListener('wheel', (e) => {
    camera.scale.scale(1 + e.deltaY / 1000) 
})


loop((dt) => {
    var rotspeed = 0.03
    if(keys['Shift']){
        rotspeed *= 0.1
    }
    if(keycodes['KeyW']){
        gears[0].rotate(dt * rotspeed)
    }
    if(keycodes['KeyS']){
        gears[0].rotate(-dt * rotspeed)
   }

    if(keycodes['KeyE']){
        gears[0].rotate(dt * rotspeed,false)
    }
    if(keycodes['KeyD']){
        gears[0].rotate(-dt * rotspeed,false)
    }
    if(keycodes['KeyT']){
        gears[1].rotate(dt * rotspeed,false)
    }
    if(keycodes['KeyG']){
        gears[1].rotate(-dt * rotspeed,false)
    }
    ctxt.lineWidth = camera.scale.x
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    camera.begin()
    for(let gear of gears){
        drawgear(gear)
    }
    camera.end()
    
})




function circle(center:Vector,radius:number,fill = false){
    ctxt.beginPath()
    ctxt.ellipse(center.x,center.y,radius,radius,0,0,TAU)
    if(fill){
        ctxt.fill()
    }else{
        ctxt.stroke()
    }
}



function line(a:Vector,b:Vector){
    linepath([a,b])
}

function lineTo(v:Vector){
    ctxt.lineTo(v.x,v.y)
}

function moveTo(v:Vector){
    ctxt.moveTo(v.x,v.y)
}

function arcTo(start:Vector,end:Vector,center:Vector){
    var radius = center.to(start).length()
    var halfway = center.to(start.lerp(end,0.5)).setMagnitude(radius).add(center)
    ctxt.arcTo(halfway.x,halfway.y,end.x,end.y,radius)
    lineTo(end)
}

function linepath(path:Vector[]){
    ctxt.beginPath()
    ctxt.moveTo(path[0].x,path[0].y)
    for(var i = 1; i < path.length;i++){
        ctxt.lineTo(path[i].x,path[i].y)    
    }
    ctxt.stroke()
}

