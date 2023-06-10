window.onload=() => {
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")

    const CANVASWIDTH = 800
    const CANVASHEIGHT = 640
    const SCALE = 2
    const GRAVITY = 1.25

//vairables for movement and attack
var aKeyPressed = false
var dKeyPressed = false
var sKeyPressed = false
var jumpKeyPressed = false
var attackButtonPressed = false
//variables for animaion
var runFrame = 0
var idleFrame = 0
var attackFrame = 0
var hurtFrame = 0
var enemyRunFrame = 0 
var enemyAttackFrame = 0
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
            this.health = 6

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
            this.imageHurtRight = new Image()
            this.imageHurtLeft = new Image()
            this.imageHearts = new Image()
            this.imageHeartsBorder = new Image()
            this.currentAnimation = "idle"
            this.lastAnimation = "idle"
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
                },
                attack: {
                    frameCount:3,
                    frameWidth:71,
                    frameHeight:58,
                    height:28,
                },
                hurt: {
                    frameCount:4,
                    frameWidth:37,
                    height:26,
                },
                hearts: {
                    frameCount:8,
                    frameWidth:36,
                    frameHeight:7,
                }             
            }
        }
 
//controls horizontal movement of the player
            moveRight(){
                this.x = this.x + this.xVelocity
                this.lastFacing = "right"
                if((this.currentAnimation != "hurt")&&(this.currentAnimation != "jump")&&(this.currentAnimation != "attacking")){
                    this.currentAnimation = "runRight"
                }
            }
            moveLeft(){
                this.x = this.x - this.xVelocity
                this.lastFacing = "left"
                if((this.currentAnimation != "hurt")&&(this.currentAnimation != "jump")&&(this.currentAnimation != "attacking")){
                    this.currentAnimation = "runLeft"
                }
            }
//controls the player jumping
            jump(){
                this.yVelocity = 18
                this.canJump = false
                if(player.currentAnimation != "hurt"){
                this.currentAnimation = "jump"
                }
            }
            fall(){
                this.oldY = this.y
                this.y = this.y - this.yVelocity
                this.yVelocity = this.yVelocity - GRAVITY
                this.yVelocity = Math.max(-25,this.yVelocity)
                this.y = Math.min(CANVASHEIGHT-this.height,this.y)
                if (this.oldY == this.y){
                    this.canJump = true
                    if((this.currentAnimation != "attacking")&&(this.currentAnimation != "hurt")){
                    this.currentAnimation = "idle"
                    }
                }
            }
//draws all the animations, sets the height of the player to the height of the image,
//then draws it using the timer "animate" to change the x position of where to draw the image 
//and with a strip of images identical in width and height it gives the player animation 
//also sets hitbox parameters for collsision
            animate(){
                ctx.drawImage(this.imageHeartsBorder, 0, 0, 66, 32, 10, 10, 66 * SCALE, 32 * SCALE)
                ctx.drawImage(this.imageHearts, this.animation.hearts.frameWidth * runFrame, 0, 
                    this.animation.hearts.frameWidth/6*this.health, this.animation.hearts.frameHeight, 40, 36,
                    this.animation.hearts.frameWidth/6*this.health*SCALE, 14)
//draws jump animation
                    if(this.currentAnimation == "hurt"){
                        this.height = this.animation.hurt.height * SCALE    
                        if(this.lastFacing == "right"){
                            ctx.drawImage(this.imageHurtRight, this.animation.hurt.frameWidth * hurtFrame,
                                0, this.animation.hurt.frameWidth, this.animation.hurt.height, this.x - this.hammer.headWidth,
                                this.y, this.animation.hurt.frameWidth * SCALE, this.height)
                        }else if(this.lastFacing == "left"){
                            console.log("drawing...")
                            ctx.drawImage(this.imageHurtLeft, this.animation.hurt.frameWidth * hurtFrame,
                                0, this.animation.hurt.frameWidth, this.animation.hurt.height, this.x - this.hammer.handleWidth,
                                this.y, this.animation.hurt.frameWidth * SCALE, this.height)
                        }
                    }else if (this.currentAnimation == "attacking"){
                    this.height = this.animation.attack.height * SCALE
                    if(this.lastFacing == "right"){
                        ctx.drawImage(this.imageAttackRight, attackFrame * this.animation.attack.frameWidth,
                            0,this.animation.attack.frameWidth,this.animation.attack.frameHeight,this.x - 30,this.y - 32,
                            this.animation.attack.frameWidth * SCALE, this.animation.attack.frameHeight * SCALE)
                    } else if(this.lastFacing == "left"){
                        ctx.drawImage(this.imageAttackLeft, attackFrame * this.animation.attack.frameWidth,
                            0,this.animation.attack.frameWidth,this.animation.attack.frameHeight,this.x - 76,this.y - 32,
                            this.animation.attack.frameWidth * SCALE, this.animation.attack.frameHeight * SCALE)
                    }
                }else if (this.currentAnimation == "jump"){
                    this.height = 58
                    if(this.lastFacing == "right"){
                ctx.drawImage(this.imageJumpRight, 0, 0, 37, 29, this.x - this.hammer.headWidth, this.y, 
                    74 ,this.height)
                    } else {
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
            this.width = 19
            this.height = 17
            this.attackSize = 28
            this.y = CANVASHEIGHT - this.height * SCALE
            this.turnLeft
            this.turnRight
            this.currentAnimation = "running"
            this.lastAnimation = "running"
            this.facing = "right"
            this.health = 3
            this.imageRunRight = new Image()
            this.imageRunLeft = new Image()
            this.imageAttackRight = new Image()
            this.imageAttackLeft = new Image()
        }
        move(){
            if (this.currentAnimation == "running"){
            if(this.facing == "right"){
                this.x = this.x + 3
            }else if(this.facing == "left"){
                this.x = this.x - 3
            }
        }   
            if(this.currentAnimation != "attack"){
            if(this.x + this.width * SCALE >= CANVASWIDTH){
                this.facing = "left"
            } else if(this.x <= 0){
                this.facing = "right"
            }
        }
        }
        animate(){
            if(this.currentAnimation == "attack"){
                ctx.drawImage(this.imageAttackRight, enemyAttackFrame * this.attackSize, 0,
                    this.attackSize, this.attackSize, this.x, this.y - 22, this.attackSize * SCALE,
                    this.attackSize * SCALE)
            }else if (this.currentAnimation == "running") {
            if(this.facing == "right"){
            ctx.drawImage(this.imageRunRight, this.width * enemyRunFrame, 0, 
                this.width, this.height, this.x, this.y, this.width*SCALE, this.height*SCALE)
            } else if (this.facing == "left"){
                ctx.drawImage(this.imageRunLeft, this.width * enemyRunFrame, 0, 
                    this.width, this.height, this.x, this.y, this.width*SCALE, this.height*SCALE)
            }
        }
        }
        collidingWithPlayer(){
            if ((player.x + player.width > this.x)
            &&(player.y + player.height > this.y)
            &&(player.x < this.x + this.width * SCALE)
            &&(player.y < this.y + this.height)
            ) {
//Caculates overlap (I got these 2 lines from chat.GPT)
            var xOverlap = Math.min(player.x + player.width, this.x + this.width * SCALE) - Math.max(player.x, this.x)
            var yOverlap = Math.min(player.y + player.height, this.y + this.height) - Math.max(player.y, this.y)
//resolves overlap
            if (xOverlap < yOverlap){
                if (player.x > this.x){
                player.x = player.x + xOverlap
                if(this.currentAnimation != "attack"){
                this.lastAnimation = this.currentAnimation
                }
                this.currentAnimation = "attack"
                this.facing = "right"
                if(player.currentAnimation != "hurt"){
                player.health = player.health - 1
                player.lastFacing = "left"
                }
                player.currentAnimation = "hurt"
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
                if (player.oldY == player.y){
                    player.canJump = true
                    player.currentAnimation = "idle"
                }
            }
            }
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
player.imageAttackRight.src = "Sprites/01-King Human/Attack_Right.png" 
player.imageAttackLeft.src = "Sprites/01-King Human/Attack_Left.png"
player.imageHurtRight.src = "Sprites/01-King Human/Hurt_Right.png"
player.imageHurtLeft.src = "Sprites/01-King Human/Hurt_Left.png"
player.imageHearts.src = "Sprites/12-Live and Coins/Health_Animation.png"
player.imageHeartsBorder.src = "Sprites/12-Live and Coins/Live Bar.png"
//creates a new enemy
var enemy = new Enemy()
enemy.imageRunRight.src = "Sprites/03-Pig/Pig_Run_Right.png"
enemy.imageRunLeft.src = "Sprites/03-Pig/Pig_Run_Left.png"
enemy.imageAttackRight.src = "Sprites/03-Pig/Pig_Attack_Right.png"
enemy.imageAttackLeft.src = "Sprites/03-Pig/Pig_Attack_Left.png"
//creates a new object
var platform = new Platform(100, 550, 100, 26, false)
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
    if(player.currentAnimation == "attacking"){
    attackFrame = attackFrame + 1
    }
    if (attackFrame == 2 ){
        attackFrame = 0
        player.currentAnimation = player.lastAnimation
        attackButtonPressed = false
    }
    if(player.currentAnimation == "hurt"){
        hurtFrame = hurtFrame + 1
        }
        if (hurtFrame == 4 ){
            hurtFrame = 0
            console.log("done")
            player.currentAnimation = player.lastAnimation
        }
    enemyRunFrame = enemyRunFrame + 1
    if (enemyRunFrame == 6){
    enemyRunFrame = 0
    } 
    if(enemy.currentAnimation == "attack"){
        enemyAttackFrame = enemyAttackFrame + 1
        }
        if (enemyAttackFrame == 5 ){
            enemyAttackFrame = 0
            enemy.currentAnimation = enemy.lastAnimation
        }
}
//runs the level (or scene whatever you want to call it)
    function RunScene(){
//clears the canvas allowing animations to look clean and not have after images 
        ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT)
        ctx.fillRect(0,0,CANVASWIDTH,CANVASHEIGHT)
//trigers all key pressed related things 
        if (jumpKeyPressed & player.canJump){
            player.jump()
        }
        if(player.currentAnimation != "hurt"){
        if(attackButtonPressed == true){
            if(player.currentAnimation != "attacking"){
                player.lastAnimation = player.currentAnimation
            }
            player.currentAnimation = "attacking" 
        }
    } 
            if((dKeyPressed == true)&&(aKeyPressed == false)){
            player.moveRight()
            }else if((aKeyPressed == true)&&(dKeyPressed == false)){
                player.moveLeft()
            }else if ((player.currentAnimation != "hurt")
            &&(player.currentAnimation != "jump")
            &&(player.currentAnimation != "attacking")){
                player.currentAnimation = "idle"
            }   
        enemy.move()
        enemy.animate()
        enemy.collidingWithPlayer()
        platform.draw()
        platform.collidingWithPlayer()
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



addEventListener("mousedown", mouseClicked)

    function mouseClicked(mouseDown){
        var mouseClicked = mouseDown.button
        if (mouseClicked == 0){
            attackButtonPressed = true
        }
    }
//incase i ever need it
/*
addEventListener("mouseup", mouseReleased)

    function mouseReleased(mouseUp){
        var mouseReleased = mouseUp.button
        if (mouseReleased == 0){
            attackButtonPressed = false
        }
    }
    */
}