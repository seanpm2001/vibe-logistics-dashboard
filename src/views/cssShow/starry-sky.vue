<template>
  <div class="sky-container">
  </div>
</template>

<script setup>
import { onMounted } from "vue";


/* Begin draw */
const w = window.innerWidth;
const h = window.innerHeight;

const dustCanvas = document.createElement('canvas');
dustCanvas.className = "canvas dust-canvas";
const dustCtx = dustCanvas.getContext('2d');
const starCanvas = document.createElement('canvas');
const starCtx = starCanvas.getContext('2d');
starCanvas.className = "canvas star-canvas";

document.getElementById('app').appendChild(dustCanvas);
document.getElementById('app').appendChild(starCanvas);

dustCanvas.width = starCanvas.width = w;
dustCanvas.height = starCanvas.height = h;

dustCtx.globalCompositeOperation = 'lighter';
starCtx.globalCompositeOperation = 'lighter';

const galaxies = [];

const mouse = {
  pos: {
    x: w * 0.5,
    y: h * 0.5
  },
  speed: 0
};

const randomNumbers = length => Array.from(new Array(length), () => Math.random());
const PI = Math.PI;
const TAU = PI * 2;
const r = () => Math.random();
const angle2 = (p1,p2) => Math.atan2(
  p2[1]-p1[1],
  p2[0]-p1[0]
);
const distance2 = (p1,p2) => Math.sqrt(
  Math.pow(p1[0]-p2[0], 2) + 
  Math.pow(p1[1]-p2[1], 2)
);

const createDustParticle = yourColor => {
  
  const canvas = document.createElement('canvas');
  
  const w = 100;
  const h = 100;
  const cx = w * 0.5;
  const cy = h * 0.5;
  
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  canvas.ctx = ctx;
  
  const xRand = -5 + (r()*10);
  const yRand = -5 + (r()*10);
  const xRand2 = 10 + (r()*(cx/2));
  const yRand2 = 10 + (r()*(cy/2));
  
  const color = yourColor || {
    r: Math.round(150+(r()*100)),
    g: Math.round(50+(r()*100)),
    b: Math.round(50+(r()*100))
  };
  
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},.02)`;
  
  Array
    .from(new Array(200), () => randomNumbers(3))
    .forEach( (p,i,arr) => {
      const length = arr.length;
      
      const x = Math.cos( TAU/xRand/length*i ) * p[2]*xRand2 + cx;
      const y = Math.sin( TAU/yRand/length*i ) * p[2]*yRand2 + cy;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, p[2]*4, 0, TAU);
      ctx.fill();
    });
  
  return canvas;
};

const Galaxy = function(x,y) {
  
  const g = this;
  
  g.x = x;
  g.y = y;
  g.stars = [];
  g.dust = [];
  g.drag = r();
  
  g.angleOffsetX = TAU*r();
  g.angleOffsetY = TAU*r();
  g.realAngleOffsetX = 0;
  g.realAngleOffsetY = 0;
  
  g.color = {
    r: Math.round(50+(r()*100)),
    g: Math.round(50+(r()*100)),
    b: Math.round(150+(r()*100))
  };
  
  const calculateStarDustParams = o => {
    o.angle = angle2([g.x,g.y], [o.x,o.y]);
    o.distance = distance2([g.x,g.y], [o.x,o.y]);
    o.xAspect = [o.x/o.y];
    o.yAspect = [o.y/o.x];
  };
  
  g.calculateCenter = () => {
    if (!g.stars.length) return;
    g.x = g.stars
      .map(s => s.x)
      .reduce((previous,current) => previous + current)
      / g.stars.length;
    
    g.y = g.stars
      .map(s => s.y)
      .reduce((previous,current) => previous + current)
      / g.stars.length;
    
    g.stars.forEach(calculateStarDustParams);
    g.dust.forEach(calculateStarDustParams);
  };
  
};

const Star = function(x, y, spread) {
  const s = this;
  s.x = x + Math.cos(TAU*r()) * spread;
  s.y = y + Math.sin(TAU*r()) * spread;
  s.radius = r()+0.25;
  s.speed = r();
};

const Dust = function(x, y, size) {
  const d = this;
  d.x = x;
  d.y = y;
  d.size = size;
  d.texture = createDustParticle();
  d.speed = r();
};

const updateStarDust = (s,g) => {
  if (g == currentGalaxy && drawingMode) return;
  s.angle += (0.5+(s.speed*0.5))/s.distance;
  s.x = g.x + (Math.cos(s.angle+g.realAngleOffsetX)*s.distance);
  s.y = g.y + (Math.sin(s.angle+g.realAngleOffsetY)*s.distance);
};

const update = () => {
  galaxies.forEach(g => {
    if (g != currentGalaxy) {
      g.realAngleOffsetX +=
      g.realAngleOffsetX < g.angleOffsetX
        ? (g.angleOffsetX-g.realAngleOffsetX)*0.05 : 0;
      g.realAngleOffsetY +=
      g.realAngleOffsetY < g.angleOffsetY
        ? (g.angleOffsetY-g.realAngleOffsetY)*0.05 : 0;
    }
    g.stars.forEach((s) => {
      /*s.distance -= s.distance < 2
      ? 0
      : TAU/s.distance;*/
      updateStarDust(s,g);
    });
    g.dust.forEach((d) => {
      /*d.distance -= d.distance < 50
      ? 0
      : TAU/d.distance;*/
      updateStarDust(d,g);
    });
  });
};

const render = () => {
  
  dustCtx.globalCompositeOperation = 'source-over';
  dustCtx.fillStyle = 'rgba(0,0,0,.05)';
  dustCtx.fillRect(0,0,w,h);
  dustCtx.globalCompositeOperation = 'lighter';

  starCtx.clearRect(0,0,w,h);
  starCtx.fillStyle = '#ffffff';
  starCtx.strokeStyle = 'rgba(255,255,255,.05)';
  starCtx.beginPath();
  
  if (drawingMode) galaxies.forEach(g => {
    starCtx.moveTo(g.x, g.y);
    starCtx.arc(g.x,g.y,2,0,TAU);
  });
  
  galaxies.forEach(g => {
    g.stars.forEach(s => {
      starCtx.moveTo(s.x, s.y);
      starCtx.arc(s.x,s.y,s.radius,0,TAU);
    });
    g.dust.forEach(d => {
      dustCtx.drawImage(d.texture, d.x-(d.size*0.5), d.y-(d.size*0.5), d.size, d.size);
    });
  });
  
  dustCtx.fill();
  starCtx.fill();
  
  if (drawingMode && currentGalaxy) {
    starCtx.beginPath();
    currentGalaxy.stars.forEach((s,i) => {
      starCtx.moveTo(s.x, s.y);
      starCtx.lineTo(currentGalaxy.x, currentGalaxy.y);
    });
    starCtx.stroke();
  }
  
};

let currentGalaxy = null;

let drawingMode = false;

const activateDraw = e => {
  drawingMode = true;
  mouse.pos.x = e.layerX;
  mouse.pos.y = e.layerY;
  currentGalaxy = new Galaxy(e.layerX, e.layerY);
  galaxies.push(currentGalaxy);
};
const disableDraw = e => {
  drawingMode = false;
  currentGalaxy = null;
};
const draw = e => {
  if (!drawingMode) return;
  
  currentGalaxy.stars.push(new Star(mouse.pos.x, mouse.pos.y, mouse.speed));
  currentGalaxy.stars.push(new Star(mouse.pos.x, mouse.pos.y, mouse.speed));
  currentGalaxy.stars.push(new Star(mouse.pos.x, mouse.pos.y, mouse.speed));
  
  if (mouse.speed*1.5 > 13 && mouse.speed < 100) currentGalaxy.dust.push(
    new Dust(
      (currentGalaxy.x + (Math.cos(TAU*r()) * mouse.speed*0.1)),
      (currentGalaxy.y + (Math.sin(TAU*r()) * mouse.speed*0.1)),
      mouse.speed*1.5
    )
  );
  
  currentGalaxy.calculateCenter();
  
};

const loop = () => {
  draw();
  update();
  render();
  window.requestAnimationFrame(loop);
};

loop();

const moveEvent = e => {
  mouse.speed =  distance2(
    [e.layerX,e.layerY],
    [mouse.pos.x,mouse.pos.y]
  );
  mouse.pos.x = e.layerX;
  mouse.pos.y = e.layerY;
  draw(e);
};

window.addEventListener('mousedown', activateDraw);
window.addEventListener('mousemove', moveEvent);
window.addEventListener('mouseup',disableDraw);

/* Begin bg */

for (let i=0; i<50; i++){
  //console.log( random(10) );
}

function random(min,max) { // min<=n<=max
  if( arguments.length < 2 ){
    max = min;
    min = 0;
  }
  if( min > max ){
    const h = max;
    max = min;
    min = h;
  }
  return Math.floor( Math.random()*(max-min+1) )+min;
}


// 最大的轨道半径
function maxOrbit(x,y) {
  const max = Math.max(x,y);
  const diameter = Math.round( Math.sqrt( max*max + max*max ) );
  return (diameter/2);
}

onMounted(() => {
  const oC = document.getElementsByClassName('dust-canvas')[0];
  const cxt = oC.getContext('2d');
  const innerW = oC.width = window.innerWidth;
  const innerH = oC.height = window.innerHeight;

  const stars = []; // 星星对象
  const maxStars = 1200;
  let count = 0;  // 索引值
  const hue = 217; // 色调

  const oC2 = document.createElement('canvas');
  const cxt2 = oC2.getContext('2d');
  oC2.width = 100;
  oC2.height = 100;
  const half = oC2.width/2;
  const gradient2 = cxt2.createRadialGradient(half,half,0,half,half,half); // 径向渐变 x1,y1,r1,x2,y2,r2
  gradient2.addColorStop(0.025, '#fff');
  gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
  gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
  gradient2.addColorStop(1, 'transparent');

  cxt2.fillStyle = gradient2;
  cxt2.beginPath();
  cxt2.arc(half,half,half,0,2*Math.PI,false);
  cxt2.fill();
  //document.body.appendChild(oC2);
  //console.log( oC2.toDataURL() )
  const bgStar = function () {
    this.orbitRadius = random(maxOrbit(w,h)); // 轨道半径
    this.radius =  random(60,this.orbitRadius)/12;  // 星星半径
    this.orbitX = innerW/2;  // 轨道X
    this.orbitY = innerH/2; // 轨道Y
    this.timePassed = random(0,maxStars); // 随着时间推移，速度要累加
    this.speed = random(this.orbitRadius) / 900000;
    this.alpha = random(2,10)/10; // 星星的透明度

    count ++;
    stars[count] = this; // 注意: 第一次调用时 count = 0+1了,所以stars[1] = this;
  };

  bgStar.prototype.draw = function () {
    const x = Math.sin(this.timePassed)*this.orbitRadius+this.orbitX;
    const y = Math.cos(this.timePassed)*this.orbitRadius+this.orbitY;

    cxt.globalAlpha = this.alpha;
    // 复制oC2的图像到 oC画布上
    /*
      const img = new Image();
      img.src = oC2.toDataURL();
      img.onload = function () {
          //console.log( this )
          cxt.drawImage(img,500,100,50,50);
      }
    */

    // 星星闪烁
    const Twinkle = random(10);
    if ( Twinkle ===1 && this.alpha >0 ){
      this.alpha -=0.05;
    } else if( Twinkle === 2 && this.alpha<1 ){
      this.alpha += 0.05;
    }

    cxt.drawImage(oC2,x-this.radius/2,y-this.radius/2,this.radius,this.radius);
    this.timePassed += this.speed;
  };

  function play() {
    cxt.clearRect(0, 0, innerW, innerH);
    for (let i=1; i<stars.length; i++){
      // 注意: 第一次调用时 count = 0+1了,所以stars[1] = this;
      // 所以 i要从1开始
      //console.log(stars[i]);
      stars[i].draw();
    }
    requestAnimationFrame(play);
  }
  play();

  for (let i=0; i<maxStars; i++){
    new bgStar(); // 创建1200个星星对象
  }

});

</script>


<style lang="sass">
.canvas
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  &.dust-canvas
    background: black
    display: block
    box-shadow: inset 0 0 60px rgba(255,255,255,0.6)
    -box-shadow: inset 0 0 60px rgba(255,255,255,0.6)
</style>