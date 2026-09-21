const PASSWORD="elquequierelohace";
const passwordScreen=document.getElementById('passwordScreen');
const passwordForm=document.getElementById('passwordForm');
const passwordInput=document.getElementById('passwordInput');
const passwordError=document.getElementById('passwordError');
const togglePassword=document.getElementById('togglePassword');

passwordInput.focus();
togglePassword.addEventListener('click',()=>{
  const visible=passwordInput.type==='text';
  passwordInput.type=visible?'password':'text';
  togglePassword.textContent=visible?'◉':'○';
});
passwordForm.addEventListener('submit',e=>{
  e.preventDefault();
  if(passwordInput.value.trim()===PASSWORD){
    passwordError.textContent='';
    passwordScreen.classList.add('unlocked');
    document.body.classList.add('access-granted');
    setTimeout(()=>passwordScreen.remove(),850);
  }else{
    passwordError.textContent='Esa no es la palabra secreta. Inténtalo de nuevo 💛';
    passwordScreen.classList.remove('shake');
    void passwordScreen.offsetWidth;
    passwordScreen.classList.add('shake');
    passwordInput.select();
  }
});

const opening=document.getElementById('opening');
const main=document.getElementById('main');
const openBtn=document.getElementById('openBtn');
const petals=document.getElementById('petals');
let petalTimer;

function makePetal(delay=0){
  const p=document.createElement('span');p.className='petal';
  p.style.left=Math.random()*100+'vw';
  p.style.setProperty('--drift',(Math.random()*240-120)+'px');
  p.style.animationDuration=(6+Math.random()*7)+'s';
  p.style.animationDelay=delay+'s';
  p.style.transform=`rotate(${Math.random()*360}deg) scale(${.55+Math.random()*.8})`;
  petals.appendChild(p);setTimeout(()=>p.remove(),15000);
}
function shower(n=30){for(let i=0;i<n;i++)makePetal(i*.06)}

openBtn.addEventListener('click',()=>{
  opening.classList.add('hidden');main.classList.remove('hidden');
  shower(42);petalTimer=setInterval(()=>makePetal(),700);
  window.scrollTo({top:0,behavior:'instant'});
});

// Música: el modal conserva "Princesa". Además hay una melodía romántica original de fondo,
// creada con Web Audio para no depender de un archivo externo ni de reproducción automática bloqueada.
const musicModal=document.getElementById('musicModal');
const musicBtn=document.getElementById('musicBtn');
let audioCtx=null, musicTimer=null, musicOn=false, noteIndex=0;
const ROMANTIC_MELODY=[261.63,329.63,392,329.63,293.66,349.23,440,349.23,329.63,392,493.88,392,293.66,349.23,440,392];
function playSoftNote(freq){
  if(!audioCtx)return;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.type='sine';osc.frequency.value=freq;
  gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.08);
  gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+1.45);
  osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+1.5);
}
function toggleBackgroundMusic(){
  if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended')audioCtx.resume();
  musicOn=!musicOn;
  musicBtn.classList.toggle('music-playing',musicOn);
  musicBtn.querySelector('span').textContent=musicOn?'Melodía activa':'Princesa';
  if(musicOn){playSoftNote(ROMANTIC_MELODY[noteIndex++%ROMANTIC_MELODY.length]);musicTimer=setInterval(()=>playSoftNote(ROMANTIC_MELODY[noteIndex++%ROMANTIC_MELODY.length]),850)}
  else{clearInterval(musicTimer);musicTimer=null}
}
function openMusic(){musicModal.classList.add('show');musicModal.setAttribute('aria-hidden','false')}
function closeMusic(){musicModal.classList.remove('show');musicModal.setAttribute('aria-hidden','true')}
musicBtn.addEventListener('click',e=>{if(e.shiftKey)openMusic();else toggleBackgroundMusic()});
document.getElementById('musicBtnHero').addEventListener('click',openMusic);
document.getElementById('musicClose').addEventListener('click',closeMusic);
musicModal.addEventListener('click',e=>{if(e.target===musicModal)closeMusic()});

// Galería
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const lightboxCaption=document.getElementById('lightboxCaption');
function closeLb(){lightbox.classList.remove('show');lightbox.setAttribute('aria-hidden','true')}
document.querySelectorAll('.memory-card').forEach(card=>card.addEventListener('click',()=>{
  lightboxImg.src=card.querySelector('img').src;
  lightboxCaption.textContent=card.querySelector('figcaption').innerText;
  lightbox.classList.add('show');lightbox.setAttribute('aria-hidden','false');
}));
document.getElementById('closeLightbox').addEventListener('click',closeLb);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLb()});

// Juegos didácticos. Edita estas dos listas para actualizar las sorpresas sin tocar el HTML.
const SCRATCH_WORDS=[
  'Valiente','Especial','Radiante','Única','Mi princesa','Increíble',
  'Admirable','Luz','Hogar','Sonrisa','Fuerza','Amor'
];
const FLOWER_MESSAGES=[
  'Tu sonrisa hace más bonito cualquier día.',
  'Nunca olvides lo valiosa y especial que eres.',
  'Que la vida te regale muchísimas razones para florecer.',
  'Contigo, hasta los momentos pequeños se vuelven recuerdos enormes.',
  'Eres una de mis casualidades favoritas. 🌻',
  'Hoy te toca recordar cuánto te quiero.'
];
const scratchGrid=document.getElementById('scratchGrid');
function shuffled(list){return [...list].sort(()=>Math.random()-.5)}
function buildScratchCards(){
  scratchGrid.innerHTML='';
  shuffled(SCRATCH_WORDS).slice(0,3).forEach((word,i)=>{
    const card=document.createElement('div');card.className='scratch-card';
    card.innerHTML=`<div class=\"scratch-secret\"><div><span>Sorpresa ${i+1}</span>${word}</div></div><canvas aria-label=\"Raspa para descubrir: tarjeta ${i+1}\"></canvas>`;
    scratchGrid.appendChild(card);setupScratch(card);
  });
}
function setupScratch(card){
  const canvas=card.querySelector('canvas'),ctx=canvas.getContext('2d');let drawing=false,last=null,moves=0;
  function size(){const r=card.getBoundingClientRect();canvas.width=Math.max(1,Math.round(r.width*devicePixelRatio));canvas.height=Math.max(1,Math.round(r.height*devicePixelRatio));canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#d8bd6d');g.addColorStop(.5,'#f0d98c');g.addColorStop(1,'#b99645');ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='rgba(75,61,30,.72)';ctx.font='600 10px DM Sans';ctx.textAlign='center';ctx.fillText('RASPA AQUÍ ✦',r.width/2,r.height/2);}
  function point(e){const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top}}
  function scratch(e){if(!drawing)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=34;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(last)ctx.moveTo(last.x,last.y);else ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;if(++moves>28)card.classList.add('revealed')}
  canvas.addEventListener('pointerdown',e=>{drawing=true;last=point(e);canvas.setPointerCapture?.(e.pointerId);scratch(e)});
  canvas.addEventListener('pointermove',scratch);
  canvas.addEventListener('pointerup',()=>{drawing=false;last=null});canvas.addEventListener('pointercancel',()=>{drawing=false;last=null});
  size();
}
buildScratchCards();
document.getElementById('refreshScratch').addEventListener('click',()=>{buildScratchCards();shower(10)});
document.querySelectorAll('#flowerChoices button').forEach((btn,i)=>btn.addEventListener('click',()=>{
  const msg=FLOWER_MESSAGES[(i+Math.floor(Math.random()*FLOWER_MESSAGES.length))%FLOWER_MESSAGES.length];
  document.getElementById('flowerMessage').textContent=msg;shower(8);
}));

// Carta
const envelopeWrap=document.getElementById('envelopeWrap');
document.getElementById('letterBtn').addEventListener('click',()=>{
  const open=envelopeWrap.classList.toggle('open');
  document.getElementById('letterBtn').innerHTML=open?'Cerrar mi carta <span>×</span>':'Abrir mi carta <span>✉</span>';
  if(open){shower(18);setTimeout(()=>envelopeWrap.scrollIntoView({behavior:'smooth',block:'center'}),180)}
});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLb();closeMusic()}});
