/* adapted from the p5 sound example library */

let osc, envelope, fft;

let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
let note = 0;

function setup() {
  createCanvas(800, 200);
  osc = new p5.SinOsc();

  // Instantiate the envelope
  envelope = new p5.Envelope();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  fill(125, 0, 0);
}

function draw() {
  background(106,13,173,20);
}

function keyPressed() {
  let midiValue;
  if (keyCode == 49) {
    osc.stop();
    midiValue = scaleArray[0];
    rect(0,0,100,200);
  }
  if (keyCode == 50) {
    osc.stop();
    midiValue = scaleArray[1];
    rect(100,0,100,200);
  }
  if (keyCode == 51) {
    osc.stop();
    midiValue = scaleArray[2];
    rect(200,0,100,200);
  }
  if (keyCode == 52) {
    osc.stop();
    midiValue = scaleArray[3];
    rect(300,0,100,200);
  }
  if (keyCode == 53) {
    osc.stop();
    midiValue = scaleArray[4];
    rect(400,0,100,200);
  }
  if (keyCode == 54) {
    osc.stop();
    midiValue = scaleArray[5];
    rect(500,0,100,200);
  }
  if (keyCode == 55) {
    osc.stop();
    midiValue = scaleArray[6];
    rect(600,0,100,200);
  }
  if (keyCode == 56) {
    osc.stop();
    midiValue = scaleArray[7];
    rect(700,0,100,200);
  }


  if (midiValue) {
    console.log(key, midiValue)

    osc.start();
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);

    envelope.play(osc, 0, 0.1);
    note = (note + 1) % scaleArray.length;
  }
}
