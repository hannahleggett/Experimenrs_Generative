const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const { noise3D } = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');


const settings = {
  // can update setup units, ppi, dimensions etc
  dimensions: [ 2048, 2048 ],
  animate: true,
  duration: 20
};

const params = {
  z: 10,
  freq: 0.01,
  amp: 1,
  animate: true,
  frame: 1,
  count: 30,
  wide: 0.1,
  length: 0.1,
  margin: 600,
  h: 0,
  s: 0,
  l: 90,
  light: false,
  dark: false,
  opacity: 0.5,
};

const sketch = () => {

  //render function
  return ({ context, width, height, frame }) => {

    if(params.light === true){
      context.fillStyle = `hsl(0, 0%, 90%)`;
    }
    else if (params.dark === true) {
      context.fillStyle = `hsl(0, 0%, 10%)`;
    }
    else{
    context.fillStyle = `hsl(${params.h}, ${params.s}%, ${params.l}%)`
    }

    context.fillRect(0, 0, width, height);

    // Get a seamless 0..1 value for our loop
    const t = Math.sin(frame * Math.PI);
  
    const f = params.animate ? frame : params.frame;
  
  const createGrid = () => {
    const points = [];
    const count = params.count;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {


          n = Math.abs(random.noise3D(x, y, params.z, frequency = (f * params.freq) * 0.1, amplitude = params.amp))

          //creates uv space 0.0 top left to 1.0 bottom right
          // const u = x / (count - 1);    //(-1 shifts it so it is centred onscreen)
          const u = count <= 1 ? 0.5 : x / (count - 1);         // (-1 shifts it so it is drawn centred to the point)
          const v = count <= 1 ? 0.5 : y / (count - 1);         // terniary fixes if its a low number the circle is centred (0.5) 
          
          points.push({
            // radius: random.value() * 0.005,
            // radius: n * 0.005,
            length: n * params.length,
            wide: n * params.wide,
            position: [ u, v ]
          });
      }
    }
      return points;
  };

  random.setSeed(515);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = params.margin;

  let hrange = [43, 20, 79];
  let srange = [54, 40, 76];
  let lrange = [113, 5, 83];

    // destructures the u and v values from points using ES6
    points.forEach(data => {
      const {
        position,
        wide,
        length
      } = data;

      const [ u, v ] = position;

      let h = hrange[random.rangeFloor(0, 3)];
      let s = srange[random.rangeFloor(0, 3)];
      let l = lrange[random.rangeFloor(0, 3)];

      // scale back up to pixel space so gives exact position of grid - const x = u * width;
      // add margin with lerp
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // draw circles
      context.beginPath();

      // console.log(s)
      let w = wide * width;
      let le = length * height;

      // context.arc( x, y, radius * width, 0, Math.PI * 2, false);
      context.strokeRect(x - w/2, y - le/2, w, le);
      // context.strokeStyle = "black";
      // context.lineWidth = 10;
      // context.fillStyle = `hsl(${params.h}, ${params.s}%, ${params.l}%)`
      context.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${params.opacity})`;

      // context.fillStyle = 'white'
      // context.fill();
    });
  };
}

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' })
  folder.addInput(params, 'count', { min: 10, max: 100, step: 1 })
  folder.addInput(params, 'wide', { min: 0.0001, max: 0.4 })
  folder.addInput(params, 'length', { min: 0.0001, max: 0.4 })
  folder.addInput(params, 'margin', { min: 0, max: 1000, step: 10})

  folder = pane.addFolder({ title: 'Noise' })
  folder.addInput(params, 'z', { min: 0, max: 50 })
  folder.addInput(params, 'freq', { min: -0.005, max: 0.1 })
  folder.addInput(params, 'amp', { min: 0, max: 3 })

  folder = pane.addFolder({ title: 'Animate' })
  folder.addInput(params, 'animate')
  folder.addInput(params, 'frame', { min: 0, max: 999 })

  folder = pane.addFolder({ title: 'Colour' })
  folder.addInput(params, 'light')
  folder.addInput(params, 'dark')
  folder.addInput(params, 'h', { min: 0, max: 360, step: 1 })
  folder.addInput(params, 's', { min: 0, max: 100, step: 1 })
  folder.addInput(params, 'l', { min: 0, max: 100, step: 1 })
  folder.addInput(params, 'opacity', { min: 0, max: 1 })

};

createPane();
canvasSketch(sketch, settings);