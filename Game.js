window.onload=() => {
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")
    
    const CANVASWIDTH = 832
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
//variables to let me do collision with each of specified object
var platforms = []
var enemies = []
var currentObject = 0
var secondObject = 0
var collision = []
//Player object with x,y,width,height, viarables for jumping and also some properties for its hammer
    class Player{
//Holds all the variables for the player
        constructor(){
//These are used for the player hitbox and the animation is base of these 
//but also includes the hammer dimensions so that all frames draw reletive to each other
            this.x = 0
            this.y = 0
            this.width = 21 * SCALE
            this.height
//Used to make player jump and reset the jump
            this.oldY 
            this.xVelocity = 9
            this.yVelocity = 0
            this.canJump = true

            this.health = 6
//Used to make sure player hitbox stays centered on the player body
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

//Creates image vairables that are defined after var player is
//once sourced these are used to draw the images
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
//Controls the oreintation of the player and allows for switching from a once off animation to
//a repeditive one smoothly i.e. hit stops after 3 frames so once it stops ot goes back to a 
//repeditive animation "idle" for instance 
            this.lastFacing = "right"
            this.currentAnimation = "idle"
            this.lastAnimation = "idle"
//Stores widths and heights for player hitbox and how big/small to draw the animations
//as they differ in size 
            this.animation = {
                runRight: {
                    frameWidth:37,
                    height:26,
                },
                runLeft: {
                    frameWidth:37,
                    height:26,
                },
                idleRight: {
                    frameWidth:37,
                    height:28,
                },   
                idleLeft: {
                    frameWidth:37,
                    height:28,
                },
                attack: {
                    frameWidth:71,
                    frameHeight:58,
                    height:28,
                },
                hurt: {
                    frameWidth:37,
                    height:26,
                },
                hearts: {
                    frameWidth:36,
                    frameHeight:7,
                }             
            }
        }
 
//controls horizontal movement of the player
            moveRight(){
                this.x = this.x + this.xVelocity
//controls what oreintation to draw the animations ofthe player
                this.lastFacing = "right"
                if((this.currentAnimation != "hurt")&&(this.currentAnimation != "jump")&&(this.currentAnimation != "attacking")){
                    this.currentAnimation = "runRight"
                }
            }
            moveLeft(){
                this.x = this.x - this.xVelocity
//same thing here
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
//OldyY is set to y position, y position is changed and if the y postition is the same 
//as it was before it allows the player to jump again
                this.oldY = this.y
                this.y = this.y - this.yVelocity
                this.yVelocity = this.yVelocity - GRAVITY
                this.yVelocity = Math.max(-25,this.yVelocity)
                this.y = Math.min(CANVASHEIGHT-this.height,this.y)
                if (this.oldY == this.y){
                    this.canJump = true
                    if(this.currentAnimation == "jump"){
                    this.currentAnimation = "idle"
                    }
                }
            }
//draws all the animations, sets the height of the player to the height of the image,
//then draws it using the timer "animate" to change the x position of where to draw the image 
//and with a strip of images identical in width and height it gives the player animation 
//also changes hitbox parameters for collsision
            animate(){
                ctx.drawImage(this.imageHeartsBorder, 0, 0, 66, 32, 10, 10, 66 * SCALE, 32 * SCALE)
                ctx.drawImage(this.imageHearts, this.animation.hearts.frameWidth * runFrame, 0, 
                    this.animation.hearts.frameWidth/6 * this.health, this.animation.hearts.frameHeight, 40, 36,
                    this.animation.hearts.frameWidth/6 * this.health * SCALE, 14)
                    if(this.currentAnimation == "hurt"){
                        this.height = this.animation.hurt.height * SCALE    
                        if(this.lastFacing == "right"){
                            ctx.drawImage(this.imageHurtRight, this.animation.hurt.frameWidth * hurtFrame,
                                0, this.animation.hurt.frameWidth, this.animation.hurt.height, this.x - this.hammer.headWidth,
                                this.y, this.animation.hurt.frameWidth * SCALE, this.height)
                        }else if(this.lastFacing == "left"){
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
                this.height = this.animation.runRight.height * SCALE
                ctx.drawImage(this.imageRunRight, this.animation.runRight.frameWidth * runFrame,
                    0, this.animation.runRight.frameWidth, 
                    this.animation.runRight.height, this.x - this.hammer.headWidth, this.y, 
                    this.width + this.hammer.totlaWidth, this.height)
                }else if (this.currentAnimation == "runLeft"){
                this.height = SCALE * this.animation.runLeft.height
                ctx.drawImage(this.imageRunLeft, this.animation.runLeft.frameWidth * runFrame,
                    0, this.animation.runLeft.frameWidth, 
                    this.animation.runLeft.height, this.x - this.hammer.handleWidth,
                    this.y, this.width + this.hammer.totlaWidth, this.height)
                } else if (this.currentAnimation == "idle"){
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
        constructor(x,y,health){
            this.x = x
            this.width = 19
            this.height = 17
            this.attackSize = 28
            this.hurtSize = 18
            this.y = y
            this.turnLeft
            this.turnRight
            this.currentAnimation = "running"
            this.lastAnimation = "running"
            this.facing = "right"
            this.health = health
            this.attackFrame = 0
            this.hurtFrame = 0
            this.runFrame = 0
            this.speed = 3
            this.imageRunRight = new Image()
            this.imageRunLeft = new Image()
            this.imageAttackRight = new Image()
            this.imageAttackLeft = new Image()
            this.imageHurtRight = new Image()
            this.imageHurtLeft = new Image()
        }
        move(){
            if(this.currentAnimation != "hurt"){
                if (this.currentAnimation == "running"){
                    if(this.facing == "right"){
                        this.x = this.x + this.speed
                    }else if(this.facing == "left"){
                        this.x = this.x - this.speed
                    }
                }   
                if(this.currentAnimation != "attack"){
                    if(this.x + this.width * SCALE >= CANVASWIDTH){
                        this.facing = "left"
                    } else if(this.x <= 0){
                        this.facing = "right"
                    }
                }
            }else{
                if(this.facing == "right"){
                        this.x = this.x + this.speed * 1.5
                }else{
                    this.x = this.x - this.speed * 1.5
                }
            }
        }
        animate(){
            switch(this.currentAnimation){
                case "hurt":
                    if(this.facing == "right"){
                        ctx.drawImage(this.imageHurtRight, this.hurtFrame * this.hurtSize, 0,
                            this.hurtSize, this.hurtSize, this.x, this.y, this.hurtSize * SCALE,
                            this.hurtSize * SCALE)
                        }else{
                            ctx.drawImage(this.imageHurtLeft, this.hurtFrame * this.hurtSize, 0,
                                this.hurtSize, this.hurtSize, this.x, this.y, this.hurtSize * SCALE,
                                this.hurtSize * SCALE)
                        }
                break
                case "attack":
                    if(this.facing == "right"){
                    ctx.drawImage(this.imageAttackRight, this.attackFrame * this.attackSize, 0,
                        this.attackSize, this.attackSize, this.x, this.y - 22, this.attackSize * SCALE,
                        this.attackSize * SCALE)
                    }else{
                        ctx.drawImage(this.imageAttackLeft, this.attackFrame * this.attackSize, 0,
                            this.attackSize, this.attackSize, this.x - 8, this.y - 22, this.attackSize * SCALE,
                            this.attackSize * SCALE) 
                    }
                break
            case "running":
                if(this.facing == "right"){
                ctx.drawImage(this.imageRunRight, this.width * this.runFrame, 0, 
                    this.width, this.height, this.x, this.y, this.width*SCALE, this.height*SCALE)
                } else{
                    ctx.drawImage(this.imageRunLeft, this.width * enemies[currentObject].runFrame, 0, 
                        this.width, this.height, this.x, this.y, this.width*SCALE, this.height*SCALE)
                }
            break
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
            ctx.fillStyle = "blue"
            ctx.fillRect(this.x,this.y,this.width,this.height)
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
enemies.push(new Enemy(CANVASWIDTH-38,CANVASHEIGHT-34,3),new Enemy(0,CANVASHEIGHT-34,3))
currentObject = 0
while(enemies.length > currentObject){
enemies[currentObject].imageRunRight.src = "Sprites/03-Pig/Pig_Run_Right.png"
enemies[currentObject].imageRunLeft.src = "Sprites/03-Pig/Pig_Run_Left.png"
enemies[currentObject].imageAttackRight.src = "Sprites/03-Pig/Pig_Attack_Right.png"
enemies[currentObject].imageAttackLeft.src = "Sprites/03-Pig/Pig_Attack_Left.png"
enemies[currentObject].imageHurtRight.src = "Sprites/03-Pig/Hurt_Right.png"
enemies[currentObject].imageHurtLeft.src = "Sprites/03-Pig/Hurt_Left.png"
currentObject++
}
//creates a new object
platforms =[new Platform(100, 550, 100, 260, false), new Platform(300, 500,100,26)]
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
        player.currentAnimation = player.lastAnimation
    }
    currentObject = 0
    while(currentObject<enemies.length){
    enemies[currentObject].runFrame = enemies[currentObject].runFrame + 1
    if (enemies[currentObject].runFrame == 6){
    enemies[currentObject].runFrame = 0
    } 
    if(enemies[currentObject].currentAnimation == "hurt"){
        enemies[currentObject].hurtFrame++
        if (enemies[currentObject].hurtFrame == 4 ){
            if(enemies[currentObject].health <= 0){    
                enemies.splice(currentObject,1)
            }else{
                enemies[currentObject].hurtFrame = 0
                enemies[currentObject].currentAnimation = enemies[currentObject].lastAnimation
            }
        }
    }else if(enemies[currentObject].currentAnimation == "attack"){
        enemies[currentObject].attackFrame++
        if (enemies[currentObject].attackFrame == 5 ){
            enemies[currentObject].attackFrame = 0
            enemies[currentObject].currentAnimation = enemies[currentObject].lastAnimation
        }
    }
    currentObject++
    }
}
//runs the level (or scene whatever you want to call it)
    function RunScene(){
//clears the canvas allowing animations to look clean and not have after images 
        ctx.fillStyle = "black"
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
        currentObject = 0
        while(enemies.length > currentObject){
            enemies[currentObject].move()
            enemies[currentObject].animate()
            if((player.currentAnimation != "attacking")&&(enemies[currentObject].currentAnimation != "hurt")){
                collision = boundingBox(player.x,player.y,player.width,player.height,
                    enemies[currentObject].x,enemies[currentObject].y,
                    enemies[currentObject].width * SCALE,enemies[currentObject].height)
            
                switch(collision.side){
                case "right":
                    player.x = player.x + collision.overlap
                    if(enemies[currentObject].currentAnimation != "attack"){
                        enemies[currentObject].lastAnimation = enemies[currentObject].currentAnimation
                        }
                        enemies[currentObject].currentAnimation = "attack"
                        enemies[currentObject].facing = "right"
                        if(player.currentAnimation != "hurt"){
                        player.health = player.health - 1
                        player.lastFacing = "left"
                        }
                        player.currentAnimation = "hurt"
                    break
                case "left":
                    if(player.currentAnimation == "attacking"){
                        enemies[currentObject].x = enemies[currentObject].x + 100
                    }else{
                        player.x = player.x - collision.overlap
                        if(enemies[currentObject].currentAnimation != "attack"){
                            enemies[currentObject].lastAnimation = enemies[currentObject].currentAnimation
                            }
                            enemies[currentObject].currentAnimation = "attack"
                            enemies[currentObject].facing = "left"
                            if(player.currentAnimation != "hurt"){
                            player.health = player.health - 1
                            player.lastFacing = "right"
                        }
                        player.currentAnimation = "hurt"
                    }
                    break
                case "top":
                    if(player.currentAnimation == "attacking"){
                        enemies[currentObject].health--
                    }else{
                        player.oldY = player.y
                        player.y = player.y - collision.overlap
                        player.yVelocity = 0
                        if (player.oldY == player.y){
                            player.canJump = true
                        }
                    }
                    break
            }
            }else{
                switch(player.lastFacing){
                    case "right":
                        collision = boundingBox(player.x - 30, player.y - 32, player.animation.attack.frameWidth * SCALE,
                            player.animation.attack.frameHeight * SCALE,
                            enemies[currentObject].x, enemies[currentObject].y,
                            enemies[currentObject].width * SCALE,enemies[currentObject].height)
                    break
                    case "left":
                        collision = boundingBox(player.x - 76, player.y - 32, player.animation.attack.frameWidth * SCALE,
                            player.animation.attack.frameHeight * SCALE,
                            enemies[currentObject].x, enemies[currentObject].y,
                            enemies[currentObject].width * SCALE,enemies[currentObject].height)
                    break
                }
            if(collision.side != ""){
                if(enemies[currentObject].currentAnimation != "hurt"){
                    enemies[currentObject].currentAnimation = "hurt"
                    enemies[currentObject].facing = player.lastFacing
                    enemies[currentObject].health--
                    if(enemies[currentObject].x > player.x){
                            enemies[currentObject].facing = "right"
                    }else if (enemies[currentObject].x < player.x){
                        enemies[currentObject].facing = "left"
                    }
                }
            }
            }
            currentObject++ 
        }
        currentObject = 0
        while(currentObject<platforms.length){
        platforms[currentObject].draw()
        collision = boundingBox(player.x,player.y,player.width,player.height,
            platforms[currentObject].x, platforms[currentObject].y,
            platforms[currentObject].width, platforms[currentObject].height)
        switch(collision.side){
            case "right":
                player.x = player.x + collision.overlap
                break
            case "left":
                player.x = player.x - collision.overlap
                break
            case "top":
                player.oldY = player.y
                player.y = player.y - collision.overlap
                player.yVelocity = 0
                if (player.oldY == player.y){
                    player.canJump = true
                }
                break
            case "bottom":
                player.y = player.y + collision.overlap
                player.yVelocity = -1
                break
                
        }
        currentObject++
        }
        currentObject = 0
        secondObject = 0
        while(currentObject < enemies.length){
            while(secondObject < platforms.length){
                collision = boundingBox(enemies[currentObject].x, enemies[currentObject].y,
                    enemies[currentObject].width * SCALE, enemies[currentObject].height,
                    platforms[secondObject].x, platforms[secondObject].y,
                    platforms[secondObject].width, platforms[secondObject].height)
                console.log(currentObject,secondObject,enemies.length,platforms.length)
                switch(collision.side){
                    case "right":
                        enemies[currentObject].x = enemies[currentObject].x + collision.overlap
                        enemies[currentObject].facing = "right"
                    break
                    case "left":
                        enemies[currentObject].x = enemies[currentObject].x - collision.overlap
                        enemies[currentObject].facing = "left"
                    break
                }
                secondObject++
            }
                currentObject++
                secondObject = 0
 
        }
        console.log(level("1",39))
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
        if ((mouseClicked == 0)&&(player.currentAnimation != "attacking")){
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