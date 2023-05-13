window.onload=() => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    const CANVASWIDTH = 800
    const CANVASHEIGHT = 640
    const TILEWIDTH = 32
    const TILEHEIGHT = 32

//vairables for movement 
var aKeyPressed = false
var dKeyPressed = false
var sKeyPressed = false
var spaceKeyPressed = false
var wKeyPressed = false
//variables for player animaion
var runFrame = 0
var idleFrame = 0
//player object with x,y,width,height,velocities and also similar properties for its hammer
    class Player{
        constructor(){
            this.x = 0
            this.y = 0
            this.width = 100
            this.height = 100
            this.xVelocity = 7
            this.yVelocity = 7

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
                ctx.drawImage(this.imageRunRight, this.animation.runRight.width*runFrame,
                    0, this.animation.runRight.width, this.animation.runRight.height, this.x,
                    this.y, 2*this.animation.runRight.width, 2*this.animation.runRight.height)
            }
            moveLeft(){
                this.x = this.x - this.xVelocity
                this.lastFacing = "left"
                ctx.drawImage(this.imageRunLeft, this.animation.runLeft.width*runFrame,
                    0, this.animation.runLeft.width, this.animation.runLeft.height, this.x,
                    this.y, 2*this.animation.runLeft.width, 2*this.animation.runLeft.height)
            }
            idle(){
                if(this.lastFacing == "left"){
                ctx.drawImage(this.imageIdleLeft, this.animation.idleLeft.width*idleFrame,
                    0, this.animation.idleLeft.width, this.animation.idleLeft.height, this.x,
                    this.y, 2*this.animation.idleLeft.width,2*this.animation.idleLeft.height)
                } else {
                ctx.drawImage(this.imageIdleRight, this.animation.idleRight.width*idleFrame,
                    0, this.animation.idleRight.width, this.animation.idleRight.height, this.x,
                    this.y, 2*this.animation.idleRight.width,2*this.animation.idleRight.height)
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
    }
//creates a new player and underneath has all the sources for the image files used to animate the character
var player = new Player()
player.imageRunRight.src = "Sprites/01-King Human/Run_Right.png"
player.imageRunLeft.src = "Sprites/01-King Human/Run_Left.png"
player.imageIdleRight.src = "Sprites/01-King Human/Idle_Right.png"
player.imageIdleLeft.src = "Sprites/01-King Human/Idle_Left.png"
//creates a new object
var object = new Object(100,100,100,100,false)

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
        if((dKeyPressed == true)&&
        (aKeyPressed == false)){
        player.moveRight()
        }else if((aKeyPressed == true)&&
        (dKeyPressed == false)){
            player.moveLeft()
        } else {
            player.idle()
        }
        requestAnimationFrame(RunScene)
    }

RunScene()

//moves player left and right based off key pressed and stops them aswell
addEventListener("keydown", keyPressed)

    function keyPressed(keyDown){
        var keyPressed = keyDown.key
        if (keyPressed == "a"){
            aKeyPressed = true
        }
        if (keyPressed == "d"){
            dKeyPressed = true
        }
        if (keyPressed == "s"){
            sKeyPressed = true
        }
        if (keyPressed == " "){
            spaceKeyPressed = true
        }
    }

addEventListener("keyup", keyReleased)

    function keyReleased(keyUp){
        var keyReleased = keyUp.key
        if (keyReleased == "a"){
            aKeyPressed = false
        }
        if (keyReleased == "d"){
            dKeyPressed = false
        }
        if (keyReleased == "s"){
            sKeyPressed = false
        }
        if (keyReleased == " "){
            spaceKeyPressed = false
        }
    }
















}