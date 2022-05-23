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



// https://www.calculatorsoup.com/calculators/math/prime-factors.php

//60 seconds,60 minutes,12 hours
//60 * 12 = 720
//6 * 6 * 5 * 4 =  720
var gears = generateGears([36, 36, 30, 24],28,new Vector(0,0))//150


function generateGears(teethvalues:number[],firstradius,startpos:Vector):Gear[]{
    var alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
    var ai = 0;
    var gears:Gear[] = []
    
    var currentpos = startpos.c()
    var slagmargin = 1
    var firstCircumference = calccircumference(firstradius)
    var bigride = firstCircumference / teethvalues[0]
    var teethwidth = (bigride - 2 * slagmargin) / 2
    // var teethwidth = 2
    var bigslag = teethwidth + slagmargin * 2
    
    var smallCircumference = 6 * (teethwidth * 2 + slagmargin)
    var smallride = teethwidth * 2 + slagmargin
    var smallslag = teethwidth + slagmargin
    var smallRadius = calcradius(smallCircumference)
    // var addendum = 0.5//should be long enough for driver gear to push the teeth far enough so the next teeth fa
    var dedendummargin = 0.2
    // var dedendum = addendum + dedendummargin//dedendum should sink as much ad the addendum rises plus a small margin

    for(var i = 0; i < teethvalues.length;i++){
        var teethvalue = teethvalues[i]
        
        var bigCircumference = teethvalue * bigride
        var bigRadius = calcradius(bigCircumference)
        var parent = i == 0 ? null : last(gears)
        var a = smallRadius
        var b = smallRadius + bigRadius
        
        // var bigaddendum = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos((smallride - teethwidth / 4) / smallCircumference * TAU)) - bigRadius
        var bigaddendum = 1.5
        var smalladdendum = 0
        var smalldedendum = bigaddendum + dedendummargin
        var bigdedendum = smalladdendum + dedendummargin

        var bigdriver = new Gear({
            parent:parent,
            name:alphabet[ai++],
            pos:currentpos.c(),
            teeth:teethvalues[i],
            ride:bigride,
            slag:bigslag,
            radius:bigRadius,
            circumference:bigCircumference,
            addendum:bigaddendum,
            dedendum:bigdedendum,
            slopewidth:teethwidth / 4,
            axleConnected:true,
        })
        if(parent){
            parent.children = [bigdriver]
        }
        gears.push(bigdriver)
        
        currentpos.x += smallRadius + bigRadius
        var smalldriven = new Gear({
            parent:bigdriver,
            name:alphabet[ai++],
            pos:currentpos.c(),
            teeth:6,
            ride:smallride,
            slag:smallslag,
            radius:smallRadius,
            circumference:smallCircumference,
            addendum:smalladdendum,
            dedendum:smalldedendum,
            slopewidth:teethwidth / 4,
            axleConnected:false,
        })
        gears.push(smalldriven)
        bigdriver.children = [smalldriven]
    }

    
    return gears
}

function drawgear(gear:Gear){
    var path:Vector[] = []
    var slagangle = gear.slag / gear.circumference
    var teethriseangle = gear.slopewidth / gear.circumference
    var teethcoreangle = (gear.ride - gear.slag - 2 * gear.slopewidth) / gear.circumference
    var rot = gear.rotation
    var inner = gear.radius - gear.dedendum
    var outer = gear.radius + gear.addendum

    ctxt.beginPath()
    moveTo(new Vector(0,-inner).rotate2d(rot).add(gear.pos))
    for(var i = 0; i < gear.teeth;i++){

        lineTo(new Vector(0,-inner).rotate2d(rot).add(gear.pos))
        lineTo(new Vector(0,-outer).rotate2d(rot += teethriseangle).add(gear.pos))
        lineTo(new Vector(0,-outer).rotate2d(rot += teethcoreangle).add(gear.pos))
        var arcstart = new Vector(0,-inner).rotate2d(rot += teethriseangle).add(gear.pos)
        var arcend = new Vector(0,-inner).rotate2d(rot += slagangle).add(gear.pos)
        lineTo(arcstart)
        arcTo(arcstart,arcend,gear.pos)
    }
    ctxt.stroke()
    circle(gear.pos,0.7,false)
    ctxt.textAlign = 'center'
    ctxt.textBaseline = 'middle'
    if(gear.axleConnected){
        ctxt.fillText(gear.name,gear.pos.x,gear.pos.y - 15)
    }else{
        ctxt.fillText(gear.name,gear.pos.x,gear.pos.y + 5)
    }
}






// document.querySelector('#gearinfo').innerHTML = JSON.stringify(gears.map(g => g.summarize()),null,2)

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
    if(keys['w']){
        gears[0].rotate(dt * rotspeed)
    }
    if(keys['s']){
        gears[0].rotate(-dt * rotspeed)
   }

    if(keys['e']){
        gears[0].rotate(dt * rotspeed,false)
    }
    if(keys['d']){
        gears[0].rotate(-dt * rotspeed,false)
    }
    if(keys['t']){
        gears[1].rotate(dt * rotspeed,false)
    }
    if(keys['g']){
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

