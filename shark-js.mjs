export class Vector3 {
  constructor([x, y, z]) {
    this.x = x;
    this.y = y;  
    this.z = z;
  }
  sum(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }
  subs(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  unscale(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }
  mult(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  div(vector) {
    return this.x / vector.x + this.y / vector.y + this.z / vector.z;
  }
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  normalize() {
    const mag = Math.max(this.mag(), 1);
    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
  }
  rotate_z(a) {
    let sin = (x) => Math.sin(x);
    let cos = (x) => Math.cos(x);
    const xprime = cos(a) * this.x - this.y * sin(a);
    const yprime = sin(a) * this.x + this.y * cos(a);
    this.x = xprime;
    this.y = yprime;
  }
  rotate_x(a) {
    const y = Math.cos(a) * this.y - Math.sin(a) * this.z;
    const z = Math.sin(a) * this.y + Math.cos(a) * this.z;
    this.y = y;
    this.z = z;
  }
  rotate_y(a) {
    const x = this.x * Math.cos(a) - this.z * Math.sin(a);
    const z = this.x * Math.sin(a) + this.z * Math.cos(a);
    this.x = x;
    this.z = z;
  }
  get position() {
    return [this.x, this.y, this.z]
  }
  static _mag_([x, y, z]) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  }
  static _subs_(v1, v2) {
    return [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
  }
  static _add_(v1, v2) {
    return [v2[0] + v1[0], v2[1] + v1[1], v2[2] + v1[2]];
  }
  static _rotate_z_([x, y, z], a) {
    let sin = Math.sin(a);
    let cos = Math.cos(a);
    return [cos * x - y * sin, sin * x + y * cos, z];
  }
  static _rotate_x_([x, y, z], a) {
    let sin = Math.sin(a);
    let cos = Math.cos(a);
    return [x, cos * y - sin * z, sin * y + cos * z];
  }
  static _rotate_y_([x, y, z], a) {
    let sin = Math.sin(a);
    let cos = Math.cos(a);
    return [x * cos - z * sin, y, x * sin + z * cos];
  }
  static _normalize_(v) {
    let mag = Vector3._mag_(v);
    return v.map((e) => e / mag);
  }

  copy() {
    return new Vector3(this.x, this.y, this.z);
  }
}
export class Render {
  /**
   *@type {CanvasRenderingContext2D}
   */
  CTX;
  constructor(CTX, W_WIDHT, W_HIGH) {
    (this.CTX = CTX), (this.W_HIGH = W_HIGH), (this.W_WIDHT = W_WIDHT);
  }

  vertexProjection(vector3, FOV = 1) {
    return {
      x: (vector3[0] * FOV) / vector3[2],
      y: (vector3[1] * FOV) / vector3[2],
      z: vector3[2],
    };
  }
  screenProjection({ x, y, z }) {
    //0..1 -> 1..2 --> screen
    return {
      screen_x: ((x + 1) / 2) * this.W_WIDHT,
      screen_y: (1 - (y + 1) / 2) * this.W_HIGH,
      screen_z: z,
    }; 
  }
  drawVertex({ screen_x, screen_y, screen_z }, color = "#ffffffff", index = -1) {
    const ctx = this.CTX;

    let dist = ((1 - (1 / screen_z + 1)) / 2) * 100;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(screen_x, screen_y, dist, dist);
    ctx.fill();
    ctx.closePath();
   // if (index != -1) {
      //ctx.textRendering = "geometricPrecision" | 1;
     // ctx.strokeText(index, screen_x, screen_y - 10, 30);
    //}
  }
  drawEdge({ fromScreenX, fromScreenY, toScreenX, toScreenY }) {
    const ctx = this.CTX;
    ctx.beginPath();

    ctx.moveTo(fromScreenX, fromScreenY);
    ctx.lineTo(toScreenX, toScreenY);
    ctx.stroke();
    ctx.closePath();
  }
  drawObject(obj, mode = "vertex", color = "#7ae86dff") {
      this.drawVertex(
          this.screenProjection(this.vertexProjection(obj.origin)),
      "hsla(37, 94%, 51%, 1.00)"
    );
    this.CTX.strokeStyle = color;
    this.CTX.fillStyle = color;
    switch (mode) {
      case "vertex":
        obj.vertex.forEach((vertex, index) => {
          this.drawVertex(
            this.screenProjection(this.vertexProjection(vertex)),
            color,
            index
          );
        });
        break;
      case "edges":
        obj.faces.forEach((face) => {
          for (let i = 0; i < face.length; i++) {
            let nextIndex = i === face.length - 1 ? 0 : i + 1;
            let from = this.screenProjection(
              this.vertexProjection(obj.vertex[face[i]])
            );
            let to = this.screenProjection(
              this.vertexProjection(obj.vertex[face[nextIndex]])
            );
            this.drawEdge({
              fromScreenX: from.screen_x,
              fromScreenY: from.screen_y,
              toScreenX: to.screen_x,
              toScreenY: to.screen_y,
            });
          }
        });
        break;
    }
  }

  clearWindow() {
    this.CTX.clearRect(0, 0, this.W_WIDHT, this.W_HIGH);
  }
}

export function timeLine(handler) {
  let play = true;
  const stop = () => (play = false);
  const resume = () => {
    timeLine(handler);
  };
  let f = (frame) => {
    requestAnimationFrame(f);
    if (!play) {
       cancelAnimationFrame(f)
      return
    }
    handler(frame, stop, resume);
  };
  f();
}

class Object {
  constructor(origin, vertex, faces) {
    (this.origin = origin), (this.vertex = vertex), (this.faces = faces);
  }
  static calculateTriangles (faces) {
      

  }
  setPosition(newPosition) {
    this.vertex = this.vertex.map((v) => {
      let diff = Vector3._subs_(this.origin, v);
      return Vector3._add_(newPosition, diff);
    });
    this.origin = newPosition;
  }
  rotate_x(a) {
    this.vertex = this.vertex.map((v) => {
      let vector = Vector3._subs_(this.origin, v);
      vector = Vector3._rotate_x_(vector, a);
      vector = Vector3._add_(this.origin, vector);
      return vector;
    });
  }
  rotate_y(a) {
    this.vertex = this.vertex.map((v) => {
      let vector = Vector3._subs_(this.origin, v);
      vector = Vector3._rotate_y_(vector, a);
      vector = Vector3._add_(this.origin, vector);
      return vector;
    });
  }
  rotate_z(a) {
    this.vertex = this.vertex.map((v) => {
      let vector = Vector3._subs_(this.origin, v);
      vector = Vector3._rotate_z_(vector, a);
      vector = Vector3._add_(this.origin, vector);
      return vector;
    });
  }

  scale([x, y, z]) {
    this.vertex = this.vertex.map((v) => {
      const diff = Vector3._subs_(this.origin, v);
      return [v[0] * x, v[1] * y, v[2] + diff[2] * z];
    });
  }
  setScale([x, y, z]) {
    this.vertex = this.vertex.map((v) => {
      let mag = Vector3._mag_(v);
      return [(v[0] / mag) * x, (v[1] / mag) * y, (v[2] / mag) * z];
    });
  }
  get points() {
    return this.vertex;
  }
}

export class Cube extends Object {
  constructor() {
    super(
      [0, 0, 3],
      [
        [-1, 1, 2],
        [-1, -1, 2],
        [1, 1, 2],
        [1, -1, 2],

        [-1, 1, 4],
        [-1, -1, 4],
        [1, 1, 4],
        [1, -1, 4],
      ],
      [
        //front
        [0, 2, 3, 1],
        //down
        [1, 5, 7, 3],
        //right
        [0, 4, 5, 1],
        //left
        [2, 6, 7, 3],
        //backoff
        [6, 4, 5, 7],
        //dow
        [5, 7, 3, 1],
      ]
    );
  }
}

export class Torus extends Object {
  constructor(subdivisionX,subdivisionY){

        let vertex = Torus.calculateVertex([0,0,10],subdivisionY, subdivisionX)
        let face = Torus.calculateFaces(vertex,subdivisionX, subdivisionY)
        super(
            [0,0,10],
            vertex,
            face
          )
        }
      static calculateVertex(origin, subdivisionY=10, subdivisionX = 10) {  
            let torus = []
            for(let e = 0, angle=0; e < subdivisionY; e++, angle+= 360/subdivisionY){
                let arc = []
                for(let i = 0; i < subdivisionX; i++){
                    let x = Math.cos(i*Math.PI/(subdivisionX/2)) 
                    let y = Math.sin(i*Math.PI/(subdivisionX/2))
                    arc.push([x+3 ,y,10]) 
                }
                arc = arc.map((v,i)=>{
                    let vector = Vector3._subs_(origin,v)
                    vector = Vector3._rotate_y_(vector, angletoRad(angle))
                    vector = Vector3._add_(vector, origin)
                    return vector
                })
                torus.push(...arc)
            }
            return torus
        }
      static calculateFaces(vertex, subdivisionY, subdivisionX){
         let faces = []
          for(let ring = 0; ring < vertex.length/subdivisionY; ring++) {
              //calcular los index del arco actual y el arco vecino que vamos a usar para iterar
              let currentArc = subdivisionY*ring
              let neighborArc = subdivisionY*ring === vertex.length - subdivisionY ? 0 : subdivisionY*ring+subdivisionY
      
              console.log({currentArc, neighborArc}) 
              for(let x1=currentArc, x2=neighborArc; x1 < currentArc+subdivisionY; x1++,x2++){
                let nx1 = x1 === currentArc+subdivisionY-1 ? currentArc : x1+1
                let nx2 = x2 === neighborArc+subdivisionY-1 ? neighborArc : x2+1
                
               /** 
                * forma de la cara
                    x1---->x2
                    |       |
                    |       |
                    nx1<---nx2
                   
                */
               faces.push([x1,x2,nx2,nx1])
              } 
          }
          return faces
      
      }
    }

export function angletoRad(x) {
  return (x * Math.PI) / 180;
}
