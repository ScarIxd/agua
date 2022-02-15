const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var cannon, cannonImg, baseImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var balls = [];
var boats = [];
var position = [];
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var BrokenboatAnimation = [];
var BrokenboatSpritedata, BrokenboatSpritesheet;

var backgroundSound;
var towerSound;
var ballSound;
var WaterSound;

var isGameOver = false;
var isLaughing = false; 

var waterAnimation = [];
var waterSpritedata , waterSpritesheet;


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  BrokenboatSpritedata = loadJSON("assets/boat/brokenBoat.json");
  BrokenboatSpritesheet = loadImage("assets/boat/brokenBoat.png");
  backgroundSound = loadSound("assets/background_music.mp3");
  towerSound = loadSound("assets/pirate_laugh.mp3");
  ballSound = loadSound("assets/cannon_explosion.mp3");
  waterSound = loadSound("assets/cannon_water.mp3");
  waterSpritedata = loadJSON("assets/waterSplash/waterSplash.json");
  waterSpritesheet = loadImage("assets/waterSplash/waterSplash.png");
}

function setup() {
 
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  var options = {
    isStatic: true
  }
  
  angleMode(DEGREES);
  angle = 20;

  cannon = new Cannon(170,165,150,100,angle);

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  var boatFrames = boatSpritedata.frames;
  for(var i=0; i<boatFrames.length; i++){
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }

  var BrokenboatFrames = BrokenboatSpritedata.frames;
  for(var i=0; i<BrokenboatFrames.length; i++){
    var pos = BrokenboatFrames[i].position;
    var img = BrokenboatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    BrokenboatAnimation.push(img);
  }

  var waterFrames = waterSpritedata.frames;
  for(var i=0; i<waterFrames.length; i++){
    var pos = waterFrames[i].position;
    var img = waterSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    waterAnimation.push(img);
  }





}

function draw() {
  image(backgroundImg,0,0,1200,600)

  Engine.update(engine);

  if(!backgroundSound.isPlaying()){
    backgroundSound.play()
    backgroundSound.setVolume(0.1)
  }

  rect(ground.position.x, ground.position.y, width * 2, 1);
  
  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();  

  
  

  for(var i = 0 ; i < balls.length ; i += 1 ){
    showBalls(balls[i],i)
    collisionWithBoat(i);
    
  }
  
  showBoats();
  cannon.show(); 

}

function keyReleased() {

  if(keyCode===RIGHT_ARROW)
  {
   balls[balls.length - 1].shoot();
   ballSound.play();
   ballSound.setVolume(0.1);
  }

}

function keyPressed(){

  if(keyCode === RIGHT_ARROW)
  {
    cannonBall = new CannonBall(cannon.x,175);
    balls.push(cannonBall)
  }

}

function showBalls(ball,index)
{
 if(ball)
 {
  cannonBall.show();
  cannonBall.animate();

  if(ball.body.position.x >= width || ball.body.position.y >= height - 50 ){
    waterSound.play();
    ball.remove(index);
  }
 }
}

function showBoats(){
  if(boats.length > 0){
    

    if(boats[boats.length -1] == undefined || boats[boats.length - 1].body.position.x < width - 200){
      position = [-80,-70,-90,-60]
      var algo = random(position) 
      var boat  = new Boat(width, height-50,150,150,algo,boatAnimation);
      boats.push(boat);
      
    }
    for(var i = 0 ; i < boats.length ; i += 1 )
      {
        if(boats[i]){
          //aqui foi inserido o set velocity que estava na classe boats, linha 16
          Matter.Body.setVelocity(boats[i].body,{x: -0, y: 0});
          boats[i].show();
          boats[i].animate();
          var collision = Matter.SAT.collides(this.tower, boats[i].body);
          if(collision.collided && !boats[i].isBroken){

            if(!isLaughing && !towerSound.isPlaying()){

              isLaughing = true;   
              towerSound.play();
              towerSound.setVolume(0.1);
                     
            }

            isGameOver = true;
            gameOver();
          }
        }
      }
  }     
  else 
  {
    var boat = new Boat(width,height-50,150,150,-80,boatAnimation);
    boats.push(boat);
  }
} 

function collisionWithBoat(index){
  for(var i=0; i<boats.length; i++){
    if(balls[index] !== undefined && boats[i] !== undefined){
      var collision = Matter.SAT.collides(balls[index].body,boats[i].body);
      
      if(collision.collided){
        boats[i].remove(i);
        Matter.World.remove(world,balls[index].body);
        delete balls[index];
      }
    }
      
  }
}

function gameOver(){
  swal(
    {
      title: 'Game Over',
      text: "",
      imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again" 
    }, function(isConfirm){
      if(isConfirm){
        location.reload();
      }
    }
  )

}