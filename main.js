import {Torus, Render, timeLine, Cube, angletoRad} from './shark-js.mjs'

//canvas setup
const canvas = document.createElement('canvas')
const CTX = canvas.getContext('2d')
const WINDOW_SIZE = Math.min(window.innerHeight,window.innerWidth) -20
canvas.width = WINDOW_SIZE 
canvas.height = WINDOW_SIZE
document.body.appendChild(canvas)

const render = new Render(CTX,WINDOW_SIZE,WINDOW_SIZE)

const cube = new Cube()
const cube2 = new Cube()

cube.scale([2,2,2 ])
cube.setPosition([4,5,15])
cube2.scale([4,4,4])
cube2.rotate_y(angletoRad(0))
cube2.setPosition([-2,-5,15])

let torus = new Torus()

torus.setPosition([0,-5,10])
torus.rotate_x(angletoRad(0)) 
timeLine((frame, stop, resume)=>{
    /*
    cube.rotate_x(angletoRad(-1))
    cube.rotate_y(angletoRad(-0.366666))
    cube2.rotate_y(angletoRad(1))
    render.drawObject(cube, 'edges', '#13d4ffff')
    render.drawObject(cube2, 'edges')*/
    render.clearWindow()
    torus.rotate_y(angletoRad(1))
    render.drawObject(torus, 'vertex', "#fff")

})
