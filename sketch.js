// variables array y ciclo para rect fondo
let c = [];
let size = 5
let columnas;
let largos;
let a = 90
let img;
let manchas = [];
let cantidad = 0;
let fifi;
let r;
let g;
let b;



//variables audio
let mic;
let amp;
let AMP_MIN = 0.03;
let AMP_MAX = 0.2;
let FREC_MIN = 0;
let FREC_MAX = 300;
let AMORTIGUACION = 0.7;
let haySonido = false;
let antesHabiaSonido;
let gestorAmp;
let gestorPitch;

// variables tiempo silencio
let marca;
let tiempoLimiteAgregar = 3000;
let tiempoLimiteFin = 3000;
// estados
let estado = "inicio";


function setup() {//----------------------------------------------------------------------
 //---------------RECT--------------
createCanvas(600, 400);
  noStroke();

columnas = width/size
largos = width/size +5
  push();
  colorMode(HSB);
for(let i = 0; i < columnas; i++ ){
  c[i] = [];
  for(let j = 0; j < largos; j++ ){
  c[i][j] = color(random(256), random(80), 100);
  } 
}
  pop();
  fifi = new Manchas();

 //---------------SONIDO--------------

mic = new p5.AudioIn();
mic.start(startPitch);
userStartAudio();
  gestorAmp = new GestorSenial(AMP_MIN,AMP_MAX);
  gestorAmp.f = AMORTIGUACION;
  gestorPitch = new GestorSenial( FREC_MIN, FREC_MAX );
  
  antesHabiaSonido = false;
        r = random(255);
  g = random(255); 
  b = random(255); 
  
}


function draw() { //----------------------------------------------------------------------
    
   //---------------SONIDO--------------
  // gestor de audio pitch
  gestorAmp.actualizar(mic.getLevel())
  amp = gestorAmp.filtrada;
  haySonido = amp > AMP_MIN;

let inicioElSonido = haySonido && !antesHabiaSonido; 
let finDelSonido = !haySonido && antesHabiaSonido; 
  
  
    

  
  
  //---------------ESTADOS--------------
  console.log(estado);
  if(estado == "inicio"){

    
      let y = 0
for(let i = 0; i < columnas; i++ ){
  for(let j = 0; j < largos; j++ ){
     fill(c[i][j]);
  rect(j*size -2,200,size,200);
  rect(i*size,y,size,200);
} }
  tint(255,127);
  image(img,0,0);
        let col = color(r,g,b,a)
        push();
  colorMode(RGB);
fill(r,g,b,a);
rect(0,0,600,400);
pop();

    
                  
  if(haySonido){
          push();
              colorMode(HSB);
      for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < largos; j++) {
      c[i][j] = color(random(256), random(80), 100);
      
    }
  } pop(); }
                    
    
        if(finDelSonido){//Evento
      marca = millis();
    }
        if(!haySonido){ //Estado SILENCIO
      let ahora = millis();
      if(ahora > marca + tiempoLimiteAgregar){
        estado = "agregar";
        marca = millis();
      }
    }
    
  
  } else if(estado == "agregar"){
    
    if(inicioElSonido){ 
      cantidad++
      if(cantidad == 1){

      fifi.dibujar();

      console.log("nuevo rectangulo");
      } }
            if(finDelSonido){//Evento
      cantidad++
    }
    
if(cantidad == 3){

      fifi.dibujar1();
      cantidad++
      console.log("nuevo rectangulo");
      }
if(cantidad == 6){

      fifi.dibujar2();
      cantidad++
      console.log("nuevo rectangulo");
      }
    if(cantidad == 9){

      fifi.dibujar2();
      cantidad++
      console.log("nuevo rectangulo");
      }
   if(finDelSonido){//Evento
      marca = millis();
    }
        if(!haySonido){ //Estado SILENCIO
      let ahora = millis();
      if(ahora > marca + tiempoLimiteFin){
        
        cantidad = 0;
        estado = "inicio";
        marca = millis();

      }
    } }
    
  
  



  

  

  


  
  

  
 antesHabiaSonido = haySonido;
}//-----------------------------------------------------------------------------

// funcion para la imagen textura de tela
function preload() {
  img = loadImage('./divozjandotp1e3/assets/Tela.jpg');
}



// funcion para datos de voz
function printData(){
textSize(16);
  fill(255);
let texto;
texto = ' amplitud: ' + amp;
text(texto,20,20);

}


// Funciones Pitch
function startPitch() {
  

    const audioContext = getAudioContext();
  const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);

}

function modelLoaded() {
getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
  gestorPitch.actualizar(frequency);
    }
    getPitch();
  })
}
