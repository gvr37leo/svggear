// /// <reference path="libs/vector/vector.ts" />
// /// <reference path="libs/utils/rng.ts" />
// /// <reference path="libs/utils/store.ts" />
// /// <reference path="libs/utils/table.ts" />
// /// <reference path="libs/utils/utils.ts" />
// /// <reference path="libs/utils/stopwatch.ts" />
// /// <reference path="libs/utils/ability.ts" />
// /// <reference path="libs/utils/anim.ts" />
// /// <reference path="libs/rect/rect.ts" />
// /// <reference path="libs/event/eventqueue.ts" />
// /// <reference path="libs/event/eventsystem.ts" />
// /// <reference path="libs/utils/camera.ts" />
// /// <reference path="libs/networking/entity.ts" />
// /// <reference path="libs/networking/server.ts" />
// /// <reference path="gear.ts" />

// //editabe
// //serialize and deserialize queryparameter

// var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
// var crret = createCanvas(screensize.x,screensize.y)
// var canvas = crret.canvas
// var ctxt = crret.ctxt
// var zoom = 1/7
// ctxt.lineWidth = zoom
// var camera = new Camera(ctxt)
// camera.pos = new Vector(40,0)
// camera.scale = new Vector(zoom,zoom)
// var dragging = false
// var mousepos = new Vector(0,0)

// document.addEventListener('mousedown',() => {
//     dragging = true
// })

// document.addEventListener('mouseup', (e) => {
//     dragging = false
// })

// window.addEventListener('blur', () => {
//     dragging = false
// })

// document.addEventListener('mousemove', (e) => {
//     var oldmousepos = mousepos.c()
//     mousepos = getMousePos(canvas,e)

//     if(dragging){
//         var change = oldmousepos.to(mousepos)
//         change.mul(camera.scale)
//         camera.pos.add(change.scale(-1))
//     }
// })

// canvas.addEventListener('wheel', (e) => {
//     camera.scale.scale(1 + e.deltaY / 1000) 
// })

// // https://www.calculatorsoup.com/calculators/math/prime-factors.php
// // 4*4*3*3*5=720
// //24,24,18,18,30
// // 12 * 12 * 5
// //4 * 6 * 6 * 5




// function generateGears(teethvalues:number[]):Gear[]{
//     var alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
//     var gears:Gear[] = []

    
        
//     for(var i = 0; i < teethvalues.length;i++){
//         var teethcount = teethvalues[i]
//         gears.push(new Gear({
//             name:alphabet[i * 2],
//             geartype: 'triangleteeth',
//             teeth:teethcount,
//             axleConnected:i != 0,
//             radius:null,
//         }))

//         gears.push(new Gear({
//             name:alphabet[i * 2 + 1],
//             geartype: 'triangleteeth',
//             teeth:6,
//             axleConnected:false,
//             radius:null,
//         }))
//     }
//     gears.push(new Gear({
//         name:alphabet[gears.length],
//             geartype: 'triangleteeth',
//             teeth:24,
//             axleConnected:true,
//     }))
//     for(var i = 1; i < gears.length;i++){
//         gears[i].parent = gears[i - 1]
//     }
//     for(var i = 0; i < gears.length - 1;i++){
//         gears[i].children = [gears[i + 1]] 
//     }
    
//     return gears
// }


// var gears = generateGears([36, 36, 30, 24])//150
// var biggestgear = gears[findbestIndex(gears,g => g.teeth)]
// biggestgear.radius = 28
// biggestgear.circumference = circumference(biggestgear.radius)
// var screwgearride = biggestgear.circumference / biggestgear.teeth



// for(var i = 0; i < gears.length;i++){
//     var gear = gears[i]
//     if(gear.geartype == 'screw'){
//         gear.fill(screwgearride)
//     }else if(gear.geartype == 'triangleteeth'){
//         //should actually be, as soon as the screw ahead slips the new one should make contact
//         //so this also had to do with addendum
//         gear.fill(screwgearride * 0.6667)
//         // gear.fill(biggestgear.ride)
//     }
// }

// // last(gears).radius = 28
// positionGears(gears,new Vector(0,0))

// for(var i = 0; i < gears.length - 1;i += 2){
//     var screwgear = gears[i]
//     var teethgear = gears[i + 1]
//     teethgear.addendum = Gear.calcAddendumForTeethGear(screwgear,teethgear,0.5)
// }




// document.querySelector('#gearinfo').innerHTML = JSON.stringify(gears.map(g => g.summarize()),null,2)

// function positionGears(gears:Gear[],start:Vector){
//     gears[0].pos = start
//     for(var i = 1; i < gears.length;i++){
//         var current = gears[i]
//         var previous = gears[i - 1]
//         if(current.axleConnected){
//             current.pos = previous.pos.c()
//         }else{
//             current.pos = previous.pos.c().add(new Vector(current.radius + previous.radius, 0))
//         }
//     }
// }



// loop((dt) => {
//     var rotspeed = 0.03
//     if(keys['w']){
//         gears[0].rotate(dt * rotspeed)
//     }
//     if(keys['s']){
//         gears[0].rotate(-dt * rotspeed)
//     }

//     if(keys['e']){
//         gears[0].rotate(dt * rotspeed,false)
//     }
//     if(keys['d']){
//         gears[0].rotate(-dt * rotspeed,false)
//     }
//     if(keys['t']){
//         gears[1].rotate(dt * rotspeed,false)
//     }
//     if(keys['g']){
//         gears[1].rotate(-dt * rotspeed,false)
//     }



//     ctxt.clearRect(0,0,screensize.x,screensize.y)
//     camera.begin()
//     for(let gear of gears){
//         drawgear(gear)
//     }
//     camera.end()

    
// })



// function drawgear(gear:Gear){
//     circle(gear.pos,gear.radius)
//     // if(gear.minAddendum){
//     //     circle(gear.pos,gear.minAddendum)
//     // }
//     var current = new Vector(0,-1).rotate2d(gear.rotation)
//     ctxt.textAlign = 'center'
//     ctxt.textBaseline = 'middle'
//     ctxt.font = '5px Arial'
//     ctxt.fillText(gear.name,gear.pos.x,gear.pos.y - (gear.axleConnected ? gear.radius / 2 : 0))
//     if(gear.geartype == 'screw'){
//         // var path = []
//         for(var i = 0; i < gear.teeth;i++){

//             // var leftbottom = gear.pos.c().add(current.c().rotate2d(-gear.angle / 2).scale(gear.radius - 3));
//             // var rightbottom = gear.pos.c().add(current.c().rotate2d(gear.angle / 2).scale(gear.radius - 3));
//             // var leftteeth = gear.pos.c().add(current.c().rotate2d(-gear.angle / 12).scale(gear.radius + 0))
//             // var rightteeth = gear.pos.c().add(current.c().rotate2d(gear.angle / 12).scale(gear.radius + 0))
//             // path.push(leftbottom,leftteeth,rightteeth,rightbottom)

//             var nailpos = gear.pos.c().add(current.c().scale(gear.radius))
//             circle(nailpos,Gear.screwRadius,true)
//             current.rotate2d(gear.angle)
//         }
//         // linepath(path)
//     }else if(gear.geartype == 'triangleteeth'){
//         var path = []
//         for(var i = 0; i < gear.teeth;i++){
//             var leftbottom = gear.pos.c().add(current.c().rotate2d(-gear.angle / 2).scale(gear.radius - 1))
//             var rightbottom = gear.pos.c().add(current.c().rotate2d(gear.angle / 2).scale(gear.radius - 1))
//             var leftteeth = gear.pos.c().add(current.c().rotate2d(-gear.angle / 8).scale(gear.addendum ?? gear.radius))
//             var rightteeth = gear.pos.c().add(current.c().rotate2d(gear.angle / 8).scale(gear.addendum ?? gear.radius))
//             path.push(leftbottom,leftteeth,rightteeth,rightbottom)
            
//             // var inner = gear.pos.c().add(current.c().scale(gear.radius - 2))
//             // var outer = gear.pos.c().add(current.c().scale(gear.minAddendum + 0))
//             // line(inner,outer)
//             current.rotate2d(gear.angle)
//         }
//         linepath(path)
//     }
// }

// function circle(center:Vector,radius:number,fill = false){
//     ctxt.beginPath()
//     ctxt.ellipse(center.x,center.y,radius,radius,0,0,TAU)
//     if(fill){
//         ctxt.fill()
//     }else{
//         ctxt.stroke()
//     }
// }



// function line(a:Vector,b:Vector){
//     linepath([a,b])
// }

// function linepath(path:Vector[]){
//     ctxt.beginPath()
//     ctxt.moveTo(path[0].x,path[0].y)
//     for(var i = 1; i < path.length;i++){
//         ctxt.lineTo(path[i].x,path[i].y)    
//     }
//     ctxt.stroke()
// }

