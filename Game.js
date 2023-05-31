window.onload=() => {
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")

    const CANVASWIDTH = 800
    const CANVASHEIGHT = 640
    const SCALE = 2
    const GRAVITY = 1.25

//vairables for movement 
var aKeyPressed = false
var dKeyPressed = false
var sKeyPressed = false
var jumpKeyPressed = false
//variables for animaion
var runFrame = 0
var idleFrame = 0
var enemyRunFrame = 0 
//player object with x,y,width,height, viarables for jumping and also some properties for its hammer
    class Player{
        constructor(){
            this.x = 0
            this.y = 0
            this.oldY
            this.width = 21 * SCALE
            this.height 
            this.xVelocity = 9
            this.yVelocity = 0
            this.canJump = true

            this.hammer = {
                x:0,
                y:0,
                headWidth:12 * SCALE,
                handleWidth:4 * SCALE,
                totlaWidth:16 * SCALE,
                height:0,
                attackSpeed:0,
                attackDamage:0,
            }

//stores all info about drawing each frame of the animation
            this.lastFacing = "right"
            this.imageRunRight = new Image()
            this.imageRunLeft = new Image()
            this.imageIdleRight = new Image()
            this.imageIdleLeft = new Image()
            this.imageJumpRight = new Image()
            this.imageJumpLeft = new Image()
            this.imageAttackRight = new Image()
            this.imageAttackLeft = new Image()
            this.currentAnimation = "idle"
            this.animation = {
                runRight: {
                    frameCount:8,
                    frameWidth:37,
                    height:26,
                },
                runLeft: {
                    frameCount:8,
                    frameWidth:37,
                    height:26,
                },
                idleRight: {
                    frameCount:11,
                    frameWidth:37,
                    height:28,
                },   
                idleLeft: {
                    frameCount:11,
                    frameWidth:37,
                    height:28,
                }             
            }
        }
 
//controls horizontal movement of the player
            moveRight(){
                this.x = this.x + this.xVelocity
                this.lastFacing = "right"
                if(this.currentAnimation != "jump"){
                    this.currentAnimation = "runRight"
                }
            }
            moveLeft(){
                this.x = this.x - this.xVelocity
                this.lastFacing = "left"
                if(this.currentAnimation != "jump"){
                    this.currentAnimation = "runLeft"
                }
            }
//controls the player jumping
            jump(){
                this.yVelocity = 18
                this.canJump = false
                this.currentAnimation = "jump"
            }
            fall(){
                this.oldY = this.y
                this.y = this.y - this.yVelocity
                this.yVelocity = this.yVelocity - GRAVITY
                this.yVelocity = Math.max(-25,this.yVelocity)
                this.y = Math.min(CANVASHEIGHT-this.height,this.y)
                if (this.oldY == this.y){
                    this.canJump = true
                    this.currentAnimation = "idle"
                }
            }
//draws all the animations, sets the height of the player to the height of the image,
//then draws it using the timer "animate" to change the x position of where to draw the image 
//and with a strip of images identical in width and height it gives the player animation 
//also sets hitbox parameters for collsision
            animate(){
//draws jump animation
                if (this.currentAnimation == "jump"){
                    if(this.lastFacing == "right"){
                this.drawHeight = 58
                ctx.drawImage(this.imageJumpRight, 0, 0, 37, 29, this.x - this.hammer.headWidth, this.y, 
                    74 ,this.height)
                    } else {
                        this.height = 58
                        ctx.drawImage(this.imageJumpLeft, 0, 0, 37, 29, this.x - this.hammer.handleWidth, this.y, 
                            74 ,this.height)   
                    }
                } else if (this.currentAnimation == "runRight"){
//draws run right animation
                this.height = this.animation.runRight.height * SCALE
                ctx.drawImage(this.imageRunRight, this.animation.runRight.frameWidth * runFrame,
                    0, this.animation.runRight.frameWidth, 
                    this.animation.runRight.height, this.x - this.hammer.headWidth, this.y, 
                    this.width + this.hammer.totlaWidth, this.height)
                }else if (this.currentAnimation == "runLeft"){
//draws run left animation
                this.height = SCALE * this.animation.runLeft.height
                ctx.drawImage(this.imageRunLeft, this.animation.runLeft.frameWidth * runFrame,
                    0, this.animation.runLeft.frameWidth, 
                    this.animation.runLeft.height, this.x - this.hammer.handleWidth,
                    this.y, this.width + this.hammer.totlaWidth, this.height)
                } else if (this.currentAnimation == "idle"){
//draws idle animations
                if (this.lastFacing == "left"){
                this.height = SCALE * this.animation.idleLeft.height
                ctx.drawImage(this.imageIdleLeft, this.animation.idleLeft.frameWidth * idleFrame,
                    0, this.animation.idleLeft.frameWidth, 
                    this.animation.idleLeft.height, this.x - this.hammer.handleWidth,
                    this.y, this.width + this.hammer.totlaWidth, this.height)
                } else {
                    this.height = SCALE * this.animation.idleRight.height
                ctx.drawImage(this.imageIdleRight, this.animation.idleLeft.frameWidth * idleFrame,
                    0, this.animation.idleRight.frameWidth, 
                    this.animation.idleRight.height, this.x - this.hammer.headWidth,
                    this.y, this.width + this.hammer.totlaWidth, this.height)
                }
            }
            }
    }
//a enemy that walks left and right and damages player
    class Enemy{
        constructor(){
            this.x = 0
            this.y = 0 
            this.width = 19
            this.height = 17
            this.turnLeft
            this.turnRight
            this.currentAnimation = "runRight"
            this.lastFacing = "right"

            this.imageRunRight = new Image()
            this.imageRunLeft = new Image()
        }
        runRight(){
            this.x++
        }
        runLeft(){
            this.y++
        }
        animate(){
            if(this.lastFacing == "right"){
            ctx.drawImage(this.imageRunRight, this.width * enemyRunFrame, 0, 
                this.width, this.height, this.x, this.y, this.width*SCALE, this.height*SCALE)
            }
        }
    }
//a platform class with x,y,width,height and jump through properties as well as collision
    class Platform{
        constructor(x,y,width,height,jumpThrough){
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.jumpThrough = jumpThrough
        }
        draw(){
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }
//Checks and resolves collision with player 
        collidingWithPlayer(){
            if ((player.x + player.width > this.x)
            &&(player.y + player.height > this.y)
            &&(player.x < this.x + this.width)
            &&(player.y < this.y + this.height)
            ) {
//Caculates overlap (I got these 2 lines from chat.GPT)
            var xOverlap = Math.min(player.x + player.width, this.x + this.width) - Math.max(player.x, this.x)
            var yOverlap = Math.min(player.y + player.height, this.y + this.height) - Math.max(player.y, this.y)
//resolves overlap
            if (xOverlap < yOverlap){
                if (player.x > this.x){
                player.x = player.x + xOverlap
                } 
                else if (player.x < this.x){
                    player.x = player.x - xOverlap
                }
            }
            if (yOverlap < xOverlap){
                if (player.y > this.y){
                player.y = player.y + yOverlap
// makes it so the character starts falling when hitting the bottom of a platform
                player.yVelocity = -1    
            }else if((player.y < this.y)){
                player.oldY = player.y
                player.y = player.y - yOverlap
                player.yVelocity = 0
                console.log(player.y,player.oldY)
                if (player.oldY == player.y){
                    player.canJump = true
                    player.currentAnimation = "idle"
                }
            }
            }
        }
    }   
    }

//Bomb blows up and damages player
/*class Bomb{
    constructor(){
        this.centerX = 300
        this.centerY = 500
        this.radius = 10
        this.fillStyle = "black"
        this.collidingSideX
        this.collidingSideY
    }
    draw(){
        ctx.fillStyle = this.fillStyle
        ctx.arc(this.centerX,this.centerY, this.radius*2 , 0, 2*Math.PI) 
        ctx.fill()
    }
    collidingWithPlayer(){
        if (this.centerX < player.x){
            this.collidingSideX = player.x
        } else if (this.centerX > player.x + player.width*2){
            this.collidingSideX = player.x + player.width*2
        }
        if(this.centerY < player.y){
            this.collidingSideY = player.y
        } else if (this.centerY > player.y + player.height){
            this.collidingSideY = player.y + player.height
        }
        var distanceX = this.centerX - this.collidingSideX
        var distanceY = this.centerY - this.collidingSideY
        var distance = Math.sqrt((distanceX*distanceX)+(distanceY*distanceY))
        if (distance <= this.radius*2){
        } else {
            console.log(distance)
            
        }
    }
}*/
//creates a new player and underneath has all the sources for the image files used to animate the character
var player = new Player()
player.imageRunRight.src = "Sprites/01-King Human/Run_Right.png"
player.imageRunLeft.src = "Sprites/01-King Human/Run_Left.png"
player.imageIdleRight.src = "Sprites/01-King Human/Idle_Right.png"
player.imageIdleLeft.src = "Sprites/01-King Human/Idle_Left.png"
player.imageJumpRight.src = "Sprites/01-King Human/JumpRight.png"
player.imageJumpLeft.src = "Sprites/01-King Human/JumpLeft.png"
player.imageAttackRight = ""
player.imageAttackLeft = ""
//creates a new enemy
var enemy = new Enemy()
enemy.imageRunRight.src = "Sprites/03-Pig/Pig_Run_Right.png"
//creates a new object
var platform = new Platform(100,550,100,26,false)
//changes the fps of the players animations
setInterval(animate,100)
function animate(){
    runFrame = runFrame + 1
    if (runFrame == 8 ){
        runFrame = 0
    }
    idleFrame = idleFrame + 1
    if (idleFrame == 11 ){
        idleFrame = 0
    }
    enemyRunFrame = enemyRunFrame + 1
    if (enemyRunFrame == 6){
    enemyRunFrame = 0
    } 
}
//runs the lvl (or scene whatever you want to call it)
    function RunScene(){
//clears the canvas allowing animations to look clean and not have after images 
        ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT)
//trigers all key pressed related things 
        if (jumpKeyPressed & player.canJump){
            player.jump()
        }
            if((dKeyPressed == true)&&(aKeyPressed == false)){
            player.moveRight()
            }else if((aKeyPressed == true)&&(dKeyPressed == false)){
                player.moveLeft()
            }else if (player.currentAnimation != "jump"){
                player.currentAnimation = "idle"
            }
        enemy.animate()
        platform.draw()
        platform.collidingWithPlayer()
        console.log(player.x,player.hitboxX,player.y,player.hitboxY)
        player.animate()
        player.fall()
        ctx.strokeStyle = "green"
        ctx.strokeRect(player.x,player.y,player.width,player.height)
        requestAnimationFrame(RunScene)
    }

RunScene()

//moves player left and right based off key pressed and stops them aswell
addEventListener("keydown", keyPressed)

    function keyPressed(keyDown){
        var keyPressed = keyDown.key
        if ((keyPressed == "a")||(keyPressed == "A")){
            aKeyPressed = true
        }
        if ((keyPressed == "d")||(keyPressed == "D")){
            dKeyPressed = true
        }
        if ((keyPressed == "s")||(keyPressed == "S")){
            sKeyPressed = true
        }
        if (keyPressed == " "){
            jumpKeyPressed = true
        }
    }

addEventListener("keyup", keyReleased)

    function keyReleased(keyUp){
        var keyReleased = keyUp.key
        if ((keyReleased == "a")||(keyReleased == "A")){
            aKeyPressed = false
        }
        if ((keyReleased == "d")||(keyReleased == "D")){
            dKeyPressed = false
        }
        if ((keyReleased == "s")||(keyReleased == "S")){
            sKeyPressed = false
        }
        if (keyReleased == " "){
            jumpKeyPressed = false
        }
    }

}