import {Torus, Render, timeLine, Cube, angletoRad,Vector3} from './shark-js.mjs'

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

let torus = new Torus(15,20)
const positiontorus = new Vector3([0,0,12])

torus.setPosition([0,0,8])
torus.rotate_x(angletoRad(-90))  

// render.drawObject(torus, 'vertex', "#fff")


timeLine((frame, stop, resume)=>{
    render.clearWindow()
    torus.rotate_y(angletoRad(1))

render.drawObject(torus, 'edges', "#ffffffe5") 
    
    stop()
})

