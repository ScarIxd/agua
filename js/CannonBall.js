class CannonBall{
    constructor(x,y){
        var options = {
            isStatic: true
        };
        this.r = 30;
        this.speed = 0.05
        this.body = Bodies.circle(x,y,this.r,options);
        this.image = loadImage("./assets/cannonball.png");
        this.animation = [this.image];
        this.isSink = false 
        World.add(world,this.body);   
        this.tracer = []; 
    }

    shoot(){
        var newAngle = cannon.angle -28;
        newAngle *= (   3.14/180);
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body,0);
        Matter.Body.setVelocity(this.body,{x: velocity.x*(180/3.14),y: velocity.y*(180/3.14)});
    }

    remove(index){
        Matter.Body.setVelocity(this.body, {x:0,y:0});
        this.isSink = true
        this.animation = waterAnimation;
        this.speed = 0.05;
        this.r = 100
        setTimeout(() =>{
            Matter.World.remove(world,this.body);
            delete balls[index];
        },600);
    }
    show(){
        var angle = this.body.angle
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);
        push();
        translate(pos.x ,pos.y)
        rotate(angle)
        imageMode(CENTER);
        image(this.animation[index],0,0,this.r,this.r);
        pop();
        if(this.body.velocity.x > 1 && pos.x > 170 && !this.isSink){
          var pos2 = [pos.x, pos.y]; 
            this.tracer.push(pos2);
        }
        for(var i = 0 ; i < this.tracer.length ; i += 1 ){
            image(this.image , this.tracer[i][0],this.tracer[i][1],5,5);
        }
    }

    animate(){
        this.speed +=0.05;
    }

}


    