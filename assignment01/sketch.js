function setup() {
  createCanvas(650, 600);
}

function draw() {
  background(240);

  //head
  stroke(0, 0, 0, 255);
  fill(255, 244, 235, 255);
  strokeWeight(5);
  ellipse(323, 156, 257, 205);

  //body
  stroke(0, 0, 0, 255);
  fill(255, 244, 235, 255);
  strokeWeight(5);
  ellipse(349, 392, 305, 330);

  //eye left white
  stroke(0, 0, 0, 255);
  fill(255, 255, 255, 255);
  strokeWeight(1);
  ellipse(257, 137, 58, 55);

  //eye right white
  stroke(0, 0, 0, 255);
  fill(255, 255, 255, 255);
  strokeWeight(1);
  ellipse(375, 123, 58, 55);

  // eye left blue
  stroke(0, 157, 225, 175);
  fill(199, 255, 254, 255);
  strokeWeight(3);
  ellipse(254, 135, 49, 46);

  //eye right blue
  stroke(0, 157, 224, 193);
  fill(199, 255, 255, 255);
  strokeWeight(3);
  ellipse(372, 122, 49, 46);

  //ear left bg
  stroke(0, 0, 0, 255);
  fill(255, 200, 200, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(263, 65);
  curveVertex(263, 65);
  curveVertex(178, 88);
  curveVertex(141, 101);
  curveVertex(138, 119);
  curveVertex(158, 146);
  curveVertex(191, 169);
  curveVertex(199, 175);
  curveVertex(199, 175);
  endShape();

  //ear right bg
  stroke(0, 0, 0, 255);
  fill(255, 200, 200, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(340, 52);
  curveVertex(340, 52);
  curveVertex(415, 16);
  curveVertex(437, 15);
  curveVertex(445, 54);
  curveVertex(442, 106);
  curveVertex(439, 119);
  curveVertex(439, 119);
  endShape();

  //leg left
  stroke(0, 0, 0, 255);
  fill(255, 211, 204, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(225, 405);
  curveVertex(225, 405);
  curveVertex(193, 391);
  curveVertex(151, 391);
  curveVertex(135, 403);
  curveVertex(143, 429);
  curveVertex(164, 460);
  curveVertex(197, 482);
  curveVertex(243, 518);
  curveVertex(269, 529);
  curveVertex(296, 532);
  curveVertex(303, 513);
  curveVertex(287, 482);
  curveVertex(270, 456);
  curveVertex(245, 432);
  curveVertex(225, 406);
  curveVertex(225, 406);
  endShape(CLOSE);

  // leg right
  stroke(0, 0, 0, 255);
  fill(255, 211, 204, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(486, 363);
  curveVertex(486, 363);
  curveVertex(455, 409);
  curveVertex(435, 437);
  curveVertex(422, 461);
  curveVertex(420, 485);
  curveVertex(426, 502);
  curveVertex(430, 511);
  curveVertex(449, 510);
  curveVertex(476, 503);
  curveVertex(490, 493);
  curveVertex(508, 471);
  curveVertex(526, 454);
  curveVertex(545, 433);
  curveVertex(562, 413);
  curveVertex(566, 389);
  curveVertex(565, 369);
  curveVertex(558, 356);
  curveVertex(549, 344);
  curveVertex(531, 342);
  curveVertex(503, 352);
  curveVertex(503, 352);
  endShape(CLOSE);

  // left arm
  stroke(0, 0, 0, 255);
  fill(254, 217, 210, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(207, 315);
  curveVertex(207, 315);
  curveVertex(210, 278);
  curveVertex(248, 259);
  curveVertex(280, 277);
  curveVertex(304, 309);
  curveVertex(319, 352);
  curveVertex(315, 379);
  curveVertex(289, 378);
  curveVertex(264, 367);
  curveVertex(264, 367);
  endShape(CLOSE);

  // right arm 
  stroke(0, 0, 0, 255);
  fill(255, 217, 211, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(428, 248);
  curveVertex(428, 248);
  curveVertex(376, 281);
  curveVertex(352, 330);
  curveVertex(356, 359);
  curveVertex(368, 377);
  curveVertex(393, 373);
  curveVertex(416, 355);
  curveVertex(452, 332);
  curveVertex(474, 304);
  curveVertex(470, 273);
  curveVertex(458, 255);
  curveVertex(458, 255);
  endShape(CLOSE);

  // beginShape();
  // curveVertex(428, 248);
  // curveVertex(428, 248);
  // curveVertex(376, 281);
  // curveVertex(352, 330);
  // curveVertex(368, 377);
  // curveVertex(416, 355);
  // curveVertex(474, 304);
  // curveVertex(458, 255);
  // curveVertex(458, 255);
  // endShape(CLOSE);

  // scarf main
  stroke(0, 0, 0, 255);
  fill(255, 200, 200, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(209, 264);
  curveVertex(209, 264);
  curveVertex(234, 235);
  curveVertex(273, 213);
  curveVertex(325, 198);
  curveVertex(364, 198);
  curveVertex(408, 201);
  curveVertex(445, 208);
  curveVertex(476, 220);
  curveVertex(475, 253);
  curveVertex(455, 272);
  curveVertex(409, 280);
  curveVertex(364, 302);
  curveVertex(307, 297);
  curveVertex(273, 292);
  curveVertex(242, 301);
  curveVertex(206, 280);
  curveVertex(206, 280);
  endShape(CLOSE);

  // scarf leftside
  stroke(0, 0, 0, 255);
  fill(255, 200, 200, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(225, 221);
  curveVertex(225, 221);
  curveVertex(173, 233);
  curveVertex(99, 233);
  curveVertex(55, 239);
  curveVertex(26, 256);
  curveVertex(57, 303);
  curveVertex(108, 313);
  curveVertex(160, 274);
  curveVertex(198, 249);
  curveVertex(224, 239);
  curveVertex(239, 235);
  curveVertex(239, 235);
  endShape(CLOSE);

  // scarf back
  stroke(0, 0, 0, 255);
  fill(247, 161, 161, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(236, 237);
  curveVertex(236, 237);
  curveVertex(203, 248);
  curveVertex(170, 267);
  curveVertex(144, 294);
  curveVertex(131, 302);
  curveVertex(163, 298);
  curveVertex(198, 296);
  curveVertex(208, 298);
  curveVertex(211, 304);
  curveVertex(216, 290);
  curveVertex(210, 277);
  curveVertex(208, 267);
  curveVertex(221, 254);
  curveVertex(221, 254);
  endShape(CLOSE);

  // X
  stroke(0, 0, 0, 255);
  fill(255, 200, 200, 255);
  strokeWeight(2);
  line(345, 492, 372, 498);
  line(348, 500, 368, 489);

  // mouth
  stroke(0, 0, 0, 255);
  fill(252, 198, 198, 255);
  strokeWeight(1);
  beginShape();
  curveVertex(294, 171);
  curveVertex(294, 171);
  curveVertex(318, 164);
  curveVertex(354, 163);
  curveVertex(352, 172);
  curveVertex(330, 188);
  curveVertex(305, 180);
  curveVertex(295, 175);
  curveVertex(295, 175);
  endShape(CLOSE);

  // tail
  stroke(0, 0, 0, 255);
  fill(251, 197, 197, 255);
  strokeWeight(5);
  ellipse(365, 538, 105, 57);

  // shadow
  stroke(0, 0, 0, 0);
  fill(251, 197, 197, 160);
  strokeWeight(5);
  beginShape();
  curveVertex(244, 350);
  curveVertex(244, 350);
  curveVertex(230, 346);
  curveVertex(217, 348);
  curveVertex(204, 362);
  curveVertex(205, 346);
  curveVertex(211, 328);
  curveVertex(214, 325);
  curveVertex(214, 325);
  endShape(CLOSE);

  // s2
  stroke(0, 0, 0, 0);
  fill(251, 197, 197, 109);
  strokeWeight(5);
  beginShape();
  curveVertex(283, 473);
  curveVertex(283, 473);
  curveVertex(298, 495);
  curveVertex(303, 512);
  curveVertex(304, 526);
  curveVertex(301, 530);
  curveVertex(294, 533);
  curveVertex(287, 533);
  curveVertex(273, 530);
  curveVertex(270, 530);
  curveVertex(294, 546);
  curveVertex(320, 553);
  curveVertex(315, 543);
  curveVertex(313, 533);
  curveVertex(318, 526);
  curveVertex(327, 519);
  curveVertex(317, 519);
  curveVertex(309, 510);
  curveVertex(299, 496);
  curveVertex(299, 496);
  endShape(CLOSE);

  // s3
  stroke(0, 0, 0, 0);
  fill(251, 197, 197, 113);
  strokeWeight(5);
  beginShape();
  curveVertex(201, 186);
  curveVertex(201, 186);
  curveVertex(212, 204);
  curveVertex(222, 217);
  curveVertex(234, 228);
  curveVertex(237, 232);
  curveVertex(247, 226);
  curveVertex(263, 218);
  curveVertex(286, 208);
  curveVertex(265, 209);
  curveVertex(248, 215);
  curveVertex(235, 212);
  curveVertex(226, 208);
  curveVertex(218, 201);
  curveVertex(218, 201);
  endShape(CLOSE);

  // s4
  stroke(0, 0, 0, 0);
  fill(238, 165, 165, 169);
  strokeWeight(5);
  beginShape();
  curveVertex(345, 516);
  curveVertex(345, 516);
  curveVertex(334, 527);
  curveVertex(338, 549);
  curveVertex(363, 554);
  curveVertex(398, 556);
  curveVertex(409, 553);
  curveVertex(368, 569);
  curveVertex(333, 561);
  curveVertex(318, 544);
  curveVertex(318, 534);
  curveVertex(322, 526);
  curveVertex(344, 516);
  curveVertex(344, 516);
  endShape(CLOSE);

  // s5
  stroke(0, 0, 0, 0);
  fill(255, 217, 211, 123);
  strokeWeight(5);
  beginShape();
  curveVertex(453, 510);
  curveVertex(453, 510);
  curveVertex(428, 516);
  curveVertex(404, 515);
  curveVertex(417, 529);
  curveVertex(418, 541);
  curveVertex(418, 541);
  endShape(CLOSE);

  // left ear light
  stroke(0, 0, 0, 0);
  fill(255, 255, 255, 86);
  strokeWeight(1);
  beginShape();
  curveVertex(142, 121);
  curveVertex(142, 121);
  curveVertex(161, 127);
  curveVertex(188, 133);
  curveVertex(214, 136);
  curveVertex(212, 151);
  curveVertex(206, 163);
  curveVertex(203, 164);
  curveVertex(203, 164);
  endShape(CLOSE);

  // right ear light
  stroke(0, 0, 0, 0);
  fill(255, 220, 219, 255);
  strokeWeight(1);
  beginShape();
  curveVertex(439, 26);
  curveVertex(439, 26);
  curveVertex(437, 53);
  curveVertex(430, 77);
  curveVertex(427, 87);
  curveVertex(420, 93);
  curveVertex(418, 95);
  curveVertex(415, 100);
  curveVertex(432, 111);
  curveVertex(432, 111);
  endShape(CLOSE);

  // left face fur
  stroke(0, 0, 0, 255);
  fill(247, 212, 212, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(197, 180);
  curveVertex(197, 180);
  curveVertex(195, 193);
  curveVertex(194, 201);
  curveVertex(197, 206);
  curveVertex(202, 208);
  curveVertex(206, 211);
  curveVertex(206, 215);
  curveVertex(211, 216);
  curveVertex(216, 218);
  curveVertex(225, 220);
  curveVertex(236, 222);
  curveVertex(236, 222);
  endShape();

  // right face fur
  stroke(0, 0, 0, 255);
  fill(247, 212, 212, 255);
  strokeWeight(5);
  beginShape();
  curveVertex(446, 126);
  curveVertex(446, 126);
  curveVertex(454, 130);
  curveVertex(461, 133);
  curveVertex(461, 137);
  curveVertex(459, 144);
  curveVertex(459, 147);
  curveVertex(461, 151);
  curveVertex(467, 154);
  curveVertex(464, 160);
  curveVertex(457, 171);
  curveVertex(449, 177);
  curveVertex(446, 179);
  curveVertex(446, 180);
  curveVertex(446, 180);
  endShape();

  // pawL
  stroke(0, 0, 0, 255);
  fill(248, 165, 173, 255);
  strokeWeight(5);
  ellipse(171, 428, 42, 24);
  ellipse(161, 391, 23, 14);
  ellipse(131, 402, 15, 7);
  ellipse(129, 418, 7, 4);

  // pawR
  stroke(0, 0, 0, 255);
  fill(248, 165, 173, 255);
  strokeWeight(5);
  ellipse(527, 392, 52, 29);
  ellipse(525, 348, 29, 16);
  ellipse(559, 358, 18, 10);
  ellipse(569, 379, 9, 8);


}
