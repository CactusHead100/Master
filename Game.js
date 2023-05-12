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
//variable for player animaion
var frame = 0
//player object with x,y,width,height,velocities and also similar properties for its hammer
    class Player{
        constructor(){
            this.x = 0
            this.y = 0
            this.width = 100
            this.height = 100
            this.xVelocity = 7
            this.yVelocity = 7
            this.image = new Image()

//stores all info about drawing each frame of the animation
            this.animation = {
                runRight:[
                    9,18,37,25,
                    87,16,37,26,
                    165,17,37,26,
                    243,20,37,25,
                    321,18,37,25,
                    399,16,37,26,
                    477,17,37,26,
                    555,20,37,25
                    ]
            }

            this.hammer = {
                x:0,
                y:0,
                width:0,
                height:0,
                attackSpeed:0,
                attackDamage:0,
            }

        }

//controls horizontal movement of the player
            moveRight(){
                this.x = this.x + this.xVelocity
                ctx.drawImage(this.image,this.animation.runRight[frame],this.animation.runRight[frame+1],this.animation.runRight[frame+2],this.animation.runRight[frame+3],this.x,this.y,78,58)
            }
            moveLeft(){
                this.x = this.x - this.xVelocity
                ctx.drawImage(this.image,this.animation.runRight[frame],this.animation.runRight[frame+1],this.animation.runRight[frame+2],this.animation.runRight[frame+3],this.x,this.y,78,58)
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
var player = new Player()
player.image.src = "Sprites/01-King Human/Run (78x58).png"
var object = new Object(100,100,100,100,false)

//changes the fps of the players animations
setInterval(animate,100)
function animate(){
    frame = frame + 4

    if (frame > 28 ){
        frame = 0
    }
}
//runs the lvl (or scene whatever you want to call it)
    function RunScene(){
        ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT)
        if((dKeyPressed == true)&&(aKeyPressed == false)){
        player.moveRight()
        }
        if((aKeyPressed == true)&&(dKeyPressed == false)){
            player.moveLeft()
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