window.onload=() => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    const CANVASWIDTH = 800
    const CANVASHEIGHT = 640
    const GRAVITY = 1.25

//vairables for movement 
var aKeyPressed = false
var dKeyPressed = false
var sKeyPressed = false
var jumpKeyPressed = false
var wKeyPressed = false
//variables for player animaion
var runFrame = 0
var idleFrame = 0
//player object with x,y,width,height, viarables for jumping and also some properties for its hammer
    class Player{
        constructor(){
            this.x = 0
            this.y = 0
            this.oldY
            this.width = 37
            this.height 
            this.xVelocity = 9
            this.yVelocity = 0
            this.canJump = true

            this.hammer = {
                x:0,
                y:0,
                width:0,
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
            this.currentAnimation = "idle"
            this.animation = {
                runRight: {
                    frameCount:8,
                    width:37,
                    height:26,
                },
                runLeft: {
                    frameCount:8,
                    width:37,
                    height:26,
                },
                idleRight: {
                    frameCount:11,
                    width:37,
                    height:28,
                },   
                idleLeft: {
                    frameCount:11,
                    width:37,
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
//controls what way the character should idle when not doing anything
            animate(){
// jump animation
                if (this.currentAnimation == "jump"){
                    if(this.lastFacing == "right"){
                ctx.drawImage(this.imageJumpRight, 0, 0, 37, 29, this.x, this.y, 74,this.height)
                    } else {
                        this.height = 58
                        ctx.drawImage(this.imageJumpLeft, 0, 0, 37, 29, this.x, this.y, 
                            74,this.height)    
                    }
                } else if (this.currentAnimation == "runRight"){
//run right animation
                this.height = 2 * this.animation.runRight.height
                ctx.drawImage(this.imageRunRight, this.width*runFrame,
                    0, this.width, this.height, this.x,
                    this.y, 2*this.width, 2*this.height)
                    
                }else if (this.currentAnimation == "runLeft"){
//run left animation
                this.height = 2 * this.animation.runLeft.height
                ctx.drawImage(this.imageRunLeft, this.width*runFrame,
                    0, this.width, this.height, this.x,
                    this.y, 2*this.width, 2*this.height)
                } else if (this.currentAnimation == "idle"){
//idle animation
                if (this.lastFacing == "left"){
                this.height = 2 * this.animation.idleLeft.height
                ctx.drawImage(this.imageIdleLeft, this.width*idleFrame,
                    0, this.width, this.height, this.x,
                    this.y, 2*this.width,2*this.height)
                } else {
                    this.height = 2 * this.animation.idleRight.height
                ctx.drawImage(this.imageIdleRight, this.width*idleFrame,
                    0, this.width, this.height, this.x,
                    this.y, 2*this.width,2*this.height)
                }   
            }
            }
    }
//an object with x,y,width,height and jump through properties
    class Object{
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
        collidingWithPlayer(){
            console.log(player.x,player.width,this.x,player.x + player.width >= this.x)
            console.log(player.y + player.height >= this.y,
                player.x <= this.x + this.width,
                player.y <= this.y + this.height
            )
            if ((player.x + player.width >= this.x)
            &&(player.y + player.height >= this.y)
            &&(player.x <= this.x + this.width)
            &&(player.y <= this.y + this.height)
            ) {
            var xOverlap = Math.min(player.x + player.width, this.x + this.width) - Math.max(player.x, this.x)
            var yOverlap = Math.min(player.y + player.height, this.y + this.height) - Math.max(player.y, this.y)
            if (xOverlap < yOverlap){
                if (player.x >= this.x){
                player.x = player.x + xOverlap
                } 
                else if (player.x <= this.x){
                    player.x = player.x - xOverlap
                }
            }
            if (yOverlap < xOverlap){
                if (player.y >= this.y){
                player.y = player.y + yOverlap 
            }else if((player.y <= this.y)){
                player.y = player.y - yOverlap
            }
            }
            }
        }   
    }
//creates a new player and underneath has all the sources for the image files used to animate the character
var player = new Player()
player.imageRunRight.src = "Sprites/01-King Human/Run_Right.png"
player.imageRunLeft.src = "Sprites/01-King Human/Run_Left.png"
player.imageIdleRight.src = "Sprites/01-King Human/Idle_Right.png"
player.imageIdleLeft.src = "Sprites/01-King Human/Idle_Left.png"
player.imageJumpRight.src = "Sprites/01-King Human/JumpRight.png"
player.imageJumpLeft.src = "Sprites/01-King Human/JumpLeft.png"
//creates a new object
var object = new Object(100,550,100,100,false)
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
        object.draw()
        object.collidingWithPlayer()
        player.animate()
        player.fall()
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
        if ((keyPressed == " ")||(keyPressed == "w")||(keyPressed == "W")){
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
        if ((keyReleased == " ")||(keyReleased == "w")||(keyReleased == "W")){
            jumpKeyPressed = false
        }
    }

}