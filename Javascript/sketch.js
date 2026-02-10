var contenders = [];
let url = '';
var rocks = [];
var papers = [];
var scissors = [];
let state = 0;
let winner = "";

function setup() {

  let key = '18dcWFRWby5OJNEKCF3koE70oYit2nYqrmzJ4GoNDy7w';
  
  url = "https://opensheet.vercel.app/" + key + "/Form+Responses" ;
  
  loadJSON(url, gotData);

  let cnv = createCanvas(600, 600);
  cnv.id('battlefield');
  cnv.parent('movecanvas');

  textAlign(CENTER, CENTER);
  ellipseMode(CENTER);
  rectMode(CENTER);
  //print("Press Enter to start!");
  //print("Find the form at: https://forms.gle/meuHmuZZpKMbVsxeA");
}

function gotData(data) {

  //console.log(data);

  for (let i = 0; i < data.length; i++) {
    contenders.push(new Contender(data[i]["Enter your first name"], data[i]["Enter an X coordinate (0 - 100)"], data[i]["Enter a Y coordinate (0 - 100)"], data[i]["Make your choice"]));
  }

  
}


function draw() {
  background('lightblue');
  textSize(10);
  switch(state) {
    case 0:
      pause();
      break;
    case 1:
      play();
      break;
    case 2:
      finish();
      break;
  }
}

function pause() {
  if (keyCode === ENTER) {
    state = 1;
  }
  for (let i = 0; i < contenders.length; i++) {
    contenders[i].display();
  }
}

function play() {
  rocks = [];
  papers = [];
  scissors = [];
  for (let i = 0; i < contenders.length; i++) {
    contenders[i].display();
  }
  for (let i = 0; i < contenders.length; i++) {
    contenders[i].check();
  }
  for (let i = 0; i < contenders.length; i++) {
    contenders[i].move();
  }
  let tally = 0;
  if (rocks.length <= 0) {tally++;} else {winner = "Rock";}
  if (papers.length <= 0) {tally++;} else {winner = "Paper";}
  if (scissors.length <= 0) {tally++;} else {winner = "Scissors";}
  if (tally > 1) {state = 2;}
}

function finish() {
  for (let i = 0; i < contenders.length; i++) {
    contenders[i].display();
  }
  textSize(50);
  fill('black');
  text("The winner is: " + winner, 600/2, 600/2);

  if (winner == 'Rock') {
    document.body.style.backgroundColor = "#00FF00";
  }
  else if (winner == 'Paper') {
    document.body.style.backgroundColor = "#FFFF00";
  }
  else if (winner == 'Scissors') {
    document.body.style.backgroundColor = "#FF0000";
  }
}

class Contender {
  constructor(name, x, y, hand) {
    this.name = name;
    this.pos = createVector((x/100) * 600, (y/100) * 600);
    if (hand == 'Rock') { 
      this.c = 'green';
      this.hand = 0;
    }
    else if (hand == 'Paper') { 
      this.c = 'yellow';
      this.hand = 1;
    }
    else if (hand == 'Scissors') {
      this.c = 'red';
      this.hand = 2;
    }
  }
  
  display() {
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, 30, 30);
    fill('black');
    text(this.name, this.pos.x, this.pos.y);
    switch(this.hand) {
      case 0:
        rocks.push(this.pos);
        break;   
      case 1:
        papers.push(this.pos);
        break;  
      case 2:
        scissors.push(this.pos);
        break;
    }
  }
  
  check() {
    switch(this.hand) {
      case 0:
        for (let i = 0; i < papers.length; i++) {
          if (this.pos.dist(papers[i])<30) {
            for (let i = 0; i < contenders.length; i++) {
              if (contenders[i] == this) {
                contenders.splice(i, 1);
              }
            }
          }
        }
        break;
      case 1:
        for (let i = 0; i < scissors.length; i++) {
          if (this.pos.dist(scissors[i])<30) {
            for (let i = 0; i < contenders.length; i++) {
              if (contenders[i] == this) {
                contenders.splice(i, 1);
              }
            }
          }
        }
        break;
      case 2:
        for (let i = 0; i < rocks.length; i++) {
          if (this.pos.dist(rocks[i])<30) {
            for (let i = 0; i < contenders.length; i++) {
              if (contenders[i] == this) {
                contenders.splice(i, 1);
              }
            }
          }
        }
        break;
    }
  }
  
  move() {
    switch(this.hand) {
      case 0:
        this.target = createVector(-1,-1);
        this.distance = -1;
        if (scissors.length > 0) {
          for (let i = 0; i < scissors.length; i++) {
            if (this.pos.dist(scissors[i])<this.distance||this.distance==-1) {
              this.target = scissors[i];
              this.distance = this.pos.dist(scissors[i]);
            }
          }
        }
        break; 
      case 1:
        this.target = createVector(-1,-1);
        this.distance = -1;
        if (rocks.length > 0) {
          for (let i = 0; i < rocks.length; i++) {
            if (this.pos.dist(rocks[i])<this.distance||this.distance==-1) {
              this.target = rocks[i];
              this.distance = this.pos.dist(rocks[i]);
            }
          }
        }
        break;
      case 2:
        this.target = createVector(-1,-1);
        this.distance = -1;
        if (papers.length > 0) {
          for (let i = 0; i < papers.length; i++) {
            if (this.pos.dist(papers[i])<this.distance||this.distance==-1) {
              this.target = papers[i];
              this.distance = this.pos.dist(papers[i]);
            }
          }
        }
        break;
    }
    if (this.target.x != -1) {
      this.dir = abs(this.pos.x - this.target.x) + abs(this.pos.y - this.target.y)
      this.pos = createVector(this.pos.x - (this.pos.x - this.target.x)/this.dir, this.pos.y - (this.pos.y - this.target.y)/this.dir);
    }
  }
}