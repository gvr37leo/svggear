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
/// <reference path="gearcalc.ts" />

declare var SVG

var screensize = new Vector(1000,500)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
var path = generateGearPath(200,6,20,60,80, new Vector(0,0))


for(var i = 0; i < path.length - 1; i++){
    line(path[i], path[i + 1])
}


var draw = SVG().addTo('#drawing').size(400,400).viewbox(-300, -300, 600, 600)
var stringpath = path2string(path) + ' ' +  path2string(generateCircle(20,10))
var svgpath = draw.path(stringpath).attr('fill-rule', 'evenodd')


// var circlemask = draw.mask()
//     .add(draw.rect(600,600).move(-300,-300).fill('white'))
//     .add(draw.circle(50).move(-25,-25).fill('black'))
// svgpath.maskWith(circlemask)
function generateGearPath(radius,teethcount,depth,height,teethwidth,center){
    var path:Vector[] = []
    var localstart = new Vector(0,1)
    var pitch = 1 / teethcount
    var innerradius = radius - depth
    var outerradius = radius + height
    var circumference = TAU * radius
    var teethpitch = teethwidth / circumference
    var freespace = circumference - teethwidth * teethcount
    var freepitch = freespace / circumference / teethcount
    for(var i = 0; i < teethcount;i++){
        localstart.rotate2d(-teethpitch/2)
        path.push(localstart.c().scale(innerradius).round())
        path.push(localstart.c().scale(outerradius).round())
        localstart.rotate2d(teethpitch)
        path.push(localstart.c().scale(outerradius).round())
        path.push(localstart.c().scale(innerradius).round())
        localstart.rotate2d(freepitch + teethpitch/2)
    }
    path.forEach(p => p.add(center))
    return path
}

function generateCircle(radius,res){
    var path = []
    var start = new Vector(0,1)
    for(var i = 0; i < res;i++){
        path.push(start.c().scale(radius).round())
        start.rotate2d(1/res)
    }
    return path
}

function path2string(path:Vector[]){
    var res = `M${path[0].x} ${path[0].y}`

    for(var i = 1; i < path.length;i++){
        res += `,L ${path[i].x} ${path[i].y}`
    }
    res += ', z'
    return res
}

function line(a:Vector,b:Vector){
    ctxt.beginPath()
    ctxt.moveTo(a.x,a.y)
    ctxt.lineTo(b.x,b.y)
    ctxt.stroke()
}

