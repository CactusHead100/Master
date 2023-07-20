window.onload=() => {
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")
    
    const CANVASWIDTH = 832
    const CANVASHEIGHT = 640
    const SCALE = 2
    const GRAVITY = 1.25
//
//vairables&consts for drawing the levels
//
    const TILESIZE = 32
    var platformsDrawn = false
    var countOfPlatforms = 0
    var inLevel = false
    var currentLevel = 1
    var tileX = 0
    var tileY = 0
    var tilesDrawn = 0
    var tileSpriteLocation
    var tileSpriteLocationX
    var tileSpriteLocationY
//lets the player health carry on to the next level
    var remainingHealth
//
//viarables&consts for menus
//
    const STARTSCREEN = new Image()
    const STORYSCREEN = new Image()
    const MENUSCREEN = new Image()
    const CONTROLSCREEN = new Image()
    const RIGHTBUTTON = new Image()
    const LEFTBUTTON = new Image()
    var buttonsYposition = CANVASHEIGHT-TILESIZE*SCALE
    var rightButtonX = 640
    var leftButtonX = 128
    STARTSCREEN.src = "Levels/StartScreen.png"
    STORYSCREEN.src = "Levels/StoryLine.png"
    CONTROLSCREEN.src = "Levels/Controls_Animation.png"
    RIGHTBUTTON.src= "Sprites/Buttons&UI/Right_Button.png"
    LEFTBUTTON.src = "Sprites/Buttons&UI/Left_Button.png"
    var mouseX
    var mouseY
    var storySlide = 0
    var controlsAnimation = 0
//
//file location of the tile sheet
//
    const BACKGROUND = new Image()
    BACKGROUND.src = "Sprites/14-TileSets/Terrain (32x32).png"
//
//vairables for movement and attack
//
    var aKeyPressed = false
    var dKeyPressed = false
    var jumpKeyPressed = false
    var attackButtonPressed = false
//
//variables for player animaion
//
    var runFrame = 0
    var idleFrame = 0
    var attackFrame = 0
    var hurtFrame = 0
    var attackOnCooldown = false
    var attackCooldown = 0 
//
//variables to let me do collision with each of the specified object
//
    var boxes = []
    var platforms = []
    var enemies = []
    var currentObject = 0
    var secondObject = 0
    var collision = []

    class Player{
//
//Allows me to set the x and y position of player when I create it
//
        constructor(x,y,health){
//
//These are used for the player hitbox, and the animation is based of these 
//but also includes the hammer dimensions so that all frames draw reletive to each other
//
            this.x = x
            this.y = y
            this.width = 21 * SCALE
            this.height
//
//Used to make player jump and reset the jump
//
            this.oldY 
            this.xVelocity = 7
            this.yVelocity = 0
            this.canJump = true
            this.health = health
//
//Used to make sure player hitbox stays centered on the player body
//
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
//
//Creates image vairables that are sourced after var player is
//defined, then used to draw the images
//
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
//
//Controls the oreintation of the player and allows for switching from a once off animation to
//a repeditive one smoothly i.e. hit stops after 3 frames so once it stops ot goes back to a 
//repeditive animation "idle" for instance 
//
            this.lastFacing = "right"
            this.currentAnimation = "idle"
            this.lastAnimation = "idle"
//
//Stores widths and heights for player hitbox and how big/small to draw the animations
//as they differ in size 
//
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
//
//controls horizontal movement of the player
//
        moveRight(){
            this.x = this.x + this.xVelocity
//
//controls what oreintation to draw the animations of the player (whether it is facing left or right)
//
            this.lastFacing = "right"
            if((this.currentAnimation != "hurt")&&(this.currentAnimation != "jump")&&(this.currentAnimation != "attacking")){
                this.currentAnimation = "runRight"
            }
        }
//
//same thing here
//
        moveLeft(){
            this.x = this.x - this.xVelocity
            this.lastFacing = "left"
            if((this.currentAnimation != "hurt")&&(this.currentAnimation != "jump")&&(this.currentAnimation != "attacking")){
                this.currentAnimation = "runLeft"
            }
        }

//controls the player jumping
        jump(){
//
//chosr this after a bit of testing as it jumped high enough and felt good
//
            this.yVelocity = 18
            this.canJump = false
            if(player.currentAnimation != "hurt"){
            this.currentAnimation = "jump"
            }
        }

        fall(){
//
//OldyY is set to y position, y position is changed and if the y postition is the same 
//as it was before it allows the player to jump again
//
            this.oldY = this.y
            this.y = this.y - this.yVelocity
            this.yVelocity = this.yVelocity - GRAVITY
//
//this caps the maximum falling velocity of the player to -25 as it sets y velocity to the biggest
//number and as it needs to be a negative number to fall the fastest fall speed will be -25
//
            this.yVelocity = Math.max(-35, this.yVelocity)
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
                switch(this.currentAnimation){
                    case"hurt":
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
                    break
                    case"attacking":
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
                    break
                    case"jump":
                        this.height = 58
                        if(this.lastFacing == "right"){
                            ctx.drawImage(this.imageJumpRight, 0, 0, 37, 29, this.x - this.hammer.headWidth, this.y, 
                                74 ,this.height)
                        }else{
                            ctx.drawImage(this.imageJumpLeft, 0, 0, 37, 29, this.x - this.hammer.handleWidth, this.y, 
                                74 ,this.height)   
                        }
                    break
                    case"runRight":
                        this.height = this.animation.runRight.height * SCALE
                        ctx.drawImage(this.imageRunRight, this.animation.runRight.frameWidth * runFrame,
                            0, this.animation.runRight.frameWidth, 
                        this.animation.runRight.height, this.x - this.hammer.headWidth, this.y, 
                        this.width + this.hammer.totlaWidth, this.height)
                    break
                    case"runLeft":
                        this.height = SCALE * this.animation.runLeft.height
                        ctx.drawImage(this.imageRunLeft, this.animation.runLeft.frameWidth * runFrame,
                            0, this.animation.runLeft.frameWidth, 
                        this.animation.runLeft.height, this.x - this.hammer.handleWidth,
                        this.y, this.width + this.hammer.totlaWidth, this.height)
                    break
                    case"idle":
                        if (this.lastFacing == "left"){
                            this.height = SCALE * this.animation.idleLeft.height
                            ctx.drawImage(this.imageIdleLeft, this.animation.idleLeft.frameWidth * idleFrame,
                                0, this.animation.idleLeft.frameWidth, 
                                this.animation.idleLeft.height, this.x - this.hammer.handleWidth,
                                this.y, this.width + this.hammer.totlaWidth, this.height)
                        }else {
                            this.height = SCALE * this.animation.idleRight.height
                            ctx.drawImage(this.imageIdleRight, this.animation.idleLeft.frameWidth * idleFrame,
                                0, this.animation.idleRight.frameWidth, 
                                this.animation.idleRight.height, this.x - this.hammer.headWidth,
                                this.y, this.width + this.hammer.totlaWidth, this.height)
                        }
                    break
                }
        }
    }
//
//An enemy that walks left and right and damages player
//
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
//
//a platform class with x,y,width,height and jump through properties as well as collision
//
    class Platform{
        constructor(x,y,width,height,jumpThrough){
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.jumpThrough = jumpThrough
        }
    }

    class Door{
//
//contains all viarables for the door very similar to the enemy and player
//
        constructor(x,y){
            this.x = x
            this.y = y
            this.width = 46
            this.height = 56
            this.opening = false
            this.openingFrame = 0
//
//images which are sourced using defineDoor function 
//I source them this way so i can create and delete doors and still be able to source them
//
            this.imageIdle = new Image()
            this.imageOpening = new Image()
        }
        drawDoor(){
            if(this.opening){
                ctx.drawImage(this.imageOpening,this.width * this.openingFrame,0,this.width,this.height,this.x,this.y,this.width * SCALE, this.height * SCALE)
            }else{
                ctx.drawImage(this.imageIdle,0,0,this.width,this.height,this.x,this.y,this.width * SCALE, this.height * SCALE)
            }
        }
    }
//
//contains the vairables needed for drawing and collision for boxes
//
    class Box{
        constructor(x,y){
            this.x = x
            this.y = y
            this.width = 21
            this.height = 16
            this.imageBox = new Image()
        }
        drawBox(){
            ctx.drawImage(this.imageBox,0,0,this.width,this.height,this.x,this.y,this.width * SCALE, this.height * SCALE)
        }
    }
//
//creates a new player and underneath has a function that sources all the image files used to 
//animate the player 
//
var player = new Player()
function definePlayer(){
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
}
//
//defines the images after the enemies are created
//
    function defineEnemies(){
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
    }
//
//sources the image for the boxes i create in the level
//its in a function so i can source them for each level as i clear and push new boxes into the array
//in each level
//
    function defineBoxes(){
        currentObject = 0
        while(boxes.length > currentObject){
            boxes[currentObject].imageBox.src = "Sprites/08-Box/Box.png"
            currentObject++
        }
    }
//
//defines the sources for images used for the door
//
var door = new Door(100,100)
function defineDoor(){
    door.imageIdle.src = "Sprites/11-Door/Idle.png"
    door.imageOpening.src = "Sprites/11-Door/Opening (46x56).png"
}
/***********************************************************************
Function nane
Purpose
Input parameters
Outout

//creates a new object
//platforms =[new Platform(100, 550, 100, 260, false), new Platform(300, 500,100,26)]
//changes the fps of the players animations

***********************************************************************/
    setInterval(animate,100)
    function animate(){
//
//timers for animating the player
//I have a timer for each so its easy to debug and see which are linked
//i.e. runFrame timer controls the player running
//
        runFrame += 1
        if (runFrame == 8 ){
            runFrame = 0
        }
        idleFrame = idleFrame + 1
        if (idleFrame == 11 ){
            idleFrame = 0
        }
        if(player.currentAnimation == "attacking"){
        attackFrame += 1
        }
        if (attackFrame == 2 ){
            attackFrame = 0
            player.currentAnimation = player.lastAnimation
            attackButtonPressed = false
            attackOnCooldown = true
        }
//
//added attack cooldown as you could spam the attack buttom making you seemingly invincible
//
        if(attackOnCooldown){
            attackCooldown += 1
            if(attackCooldown > 4){
                attackOnCooldown = false
                attackCooldown = 0
            }
        }
        if(player.currentAnimation == "hurt"){
            hurtFrame += 1
            }
        if (hurtFrame == 4 ){
            hurtFrame = 0
            player.currentAnimation = player.lastAnimation
        }
//
//timer for the animation seen at the beggining of the game where you are shown the controls and
//what they do
//
        controlsAnimation = controlsAnimation + 1
        if(controlsAnimation == 10){
            controlsAnimation = 0
        }
//
//timer for door animation
//
        if(door.opening){
            door.openingFrame++ 
            if(door.openingFrame > 3){
//
//resets the scene then creates all the objects in the new level
//it does this by deleting all the objects the recreating them in the correct positions for the scene
//and as they are new objects their image sources need to be defined once again which is what i do 
//
                if(currentLevel == 1){
                    resetLevel()
                    currentLevel = 2
                    player = new Player(96,100,remainingHealth)
                    definePlayer()
                    enemies.push(new Enemy(256,542,3))
                    defineEnemies()
                    door = new Door(96,400)
                    defineDoor()
                }else if(currentLevel == 2){
                    resetLevel()
                    currentLevel = 3
                    player = new Player(300,100,remainingHealth)
                    definePlayer()
                    enemies.push(new Enemy(192,542,3))
                    enemies.push(new Enemy(602,542,3))
                    defineEnemies()
                    door = new Door(646,144)
                    defineDoor()
                }else if(currentLevel == 3){
                    resetLevel()
                    currentLevel = 4
                    player = new Player(96,300,remainingHealth)
                    definePlayer()
                    enemies.push(new Enemy(64,542,5))
                    enemies.push(new Enemy(602,542,5))
                    defineEnemies()
                    door = new Door(96,80)
                    defineDoor()
                }else if(currentLevel == 4){
                    resetLevel()
                    currentLevel = 5
                    player = new Player(96,300,remainingHealth)
                    definePlayer()
                    enemies.push(new Enemy(100,100,5))
                    defineEnemies()
                    door = new Door(96,80)
                    defineDoor()
                }
            }
        }
//
//timers for enemy animations 
//I use while statements so the timers apply for each enemy
//
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
//
//got this from w3schools.com as the delete function brought about errors as it replaced the 
//enemy in the array with unidentified but with this splice it completly removes it allowing me
//to add and remove enemies at will
//   
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
//
//resets the the level so i can create a new one without worrying about existong objects
//
    function resetLevel(){
        enemies = []
        platforms = []
        platformsDrawn = false
        door.opening = false
        door.openingFrame = 0
        remainingHealth = player.health
    }
//
//runs the levels (or scene whatever you want to call it)
//
    function runScene(){
//
//clears the canvas allowing animations to look clean and not have after images 
//
        ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT)
        ctx.fillStyle = "#3FFF51"
        ctx.fillRect(0,0,CANVASWIDTH,CANVASHEIGHT)
//
//draws the level
//
        tileY = 0
        tilesDrawn = 0
        while(tileY < CANVASHEIGHT){
            tileX = 0
            while(tileX < CANVASWIDTH){
                tileSpriteLocation = drawLevel(currentLevel - 1,tilesDrawn)
                tileSpriteLocationX = tileSpriteLocation.x
                tileSpriteLocationY = tileSpriteLocation.y
                if((tileSpriteLocation.y < 6)&&(platformsDrawn == false)){
                    platforms.push(new Platform (tileX,tileY,TILESIZE * SCALE,TILESIZE * SCALE))
                }
                ctx.drawImage(BACKGROUND, TILESIZE * tileSpriteLocationX, TILESIZE * tileSpriteLocationY,
                    TILESIZE, TILESIZE, tileX, tileY, TILESIZE * SCALE, TILESIZE * SCALE)
                tileX = tileX + TILESIZE * SCALE
                tilesDrawn++
            }
            tileY += TILESIZE * SCALE
        }
        platformsDrawn = true
//
//calls the door to be drawn
//
        door.drawDoor()
//
//trigers all key pressed related things 
//
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
//
//checks for collision between door and player 
//this uses a function allowing me to use one bit of code for most of my collision
//          
            collision = boundingBox(door.x,door.y,door.width* SCALE,door.height * SCALE,player.x,player.y,player.width,player.height)
            if(collision.side != ""){
                door.opening = true
            }
//
//checks for collision between the enemies and player
//and then resolves it using the dictionary that is returned by the boundingbox function
//I use a while statement so it checks with every enemy
//i check in 2 parts one when the player is not attacking and this resolves the collision by  
//activatong the players immunity frames and reducing the players health by 1
//
            currentObject = 0
            while(enemies.length > currentObject){
                enemies[currentObject].move()
                enemies[currentObject].animate()
                if((player.currentAnimation != "attacking")&&(enemies[currentObject].currentAnimation != "hurt")){
//
//i set collision to what the function returns which is a dictionary then use a switch statement 
//to see effeciently check shat side the collision side is then resolve it 
//
                    collision = boundingBox(player.x,player.y,player.width,player.height,
                        enemies[currentObject].x,enemies[currentObject].y,
                        enemies[currentObject].width * SCALE,enemies[currentObject].height)
                    switch(collision.side){
                        case "right":
                            player.x += collision.overlap
                            if(enemies[currentObject].currentAnimation != "attack"){
                                enemies[currentObject].lastAnimation = enemies[currentObject].currentAnimation
                            }
                            enemies[currentObject].currentAnimation = "attack"
                            enemies[currentObject].facing = "right"
//
//this checks if the players immunity frames are active and if they aren't reduces the players health
//
                            if(player.currentAnimation != "hurt"){
                                player.health -= 1
                                player.lastFacing = "left"
                            }
                            player.currentAnimation = "hurt"
                        break
                        case "left":
                                player.x = player.x - collision.overlap
                                if(enemies[currentObject].currentAnimation != "attack"){
                                    enemies[currentObject].lastAnimation = enemies[currentObject].currentAnimation
                                    }
                                    enemies[currentObject].currentAnimation = "attack"
                                    enemies[currentObject].facing = "left"
                                    if(player.currentAnimation != "hurt"){
                                    player.health -= 1
                                    player.lastFacing = "right"
                                }
                                player.currentAnimation = "hurt"
                        break
                        case "top":
                            if(player.currentAnimation == "attacking"){
                                enemies[currentObject].health--
                            }else{
                                player.y -= collision.overlap
                                player.yVelocity = 0
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
//
//checks collision with player and platform using boundingBox funcion
//uses the dictionary returned to resolve collision (as it returns what side and how much to move the player by)
//
        currentObject = 0
        while(currentObject < platforms.length){
            collision = boundingBox(player.x,player.y,player.width,player.height,
                platforms[currentObject].x, platforms[currentObject].y,
                platforms[currentObject].width, platforms[currentObject].height)
            switch(collision.side){
                case "right":
                    player.x = player.x + collision.overlap
//
//after i got some classmates to test my game a unanimous thing that they all didn't really like
//that there was no player friction on the corners of platforms I added this line to force make 
//parkouring a tiny bit harder and give the game a better feel as before you could just press jump 
//when running at a platform and always make the jump if you could now you need to be a tad more precise
//
                    player.yVelocity = player.yVelocity - 0.3
                    break
                case "left":
                    player.x = player.x - collision.overlap 
//
//same here
//
                    player.yVelocity = player.yVelocity - 0.3
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
        player.animate()
        player.fall()
        if(inLevel){
        requestAnimationFrame(runScene)
        }
    }

//moves player left and right based off key pressed and stops them aswell
addEventListener("keydown", keyPressed)

    function keyPressed(keyDown){
        var keyPressed = keyDown.key
        if(inLevel){
            if ((keyPressed == "a")||(keyPressed == "A")){
                aKeyPressed = true
            }
            if ((keyPressed == "d")||(keyPressed == "D")){
                dKeyPressed = true
            }
            if (keyPressed == " "){
                jumpKeyPressed = true
            }
        }
    }

addEventListener("keyup", keyReleased)

    function keyReleased(keyUp){
        var keyReleased = keyUp.key
        if(inLevel){
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
currentScreen = "start"
    function menus(){
        ctx.clearRect(0,0,CANVASWIDTH,CANVASHEIGHT)
        switch(currentScreen){
            case"lvls":
            break
            case"pause":
            break
            case"start":
                ctx.drawImage(STARTSCREEN,0,0,CANVASWIDTH/SCALE,CANVASHEIGHT/SCALE,0,0,CANVASWIDTH,CANVASHEIGHT)
            break
            case"story":
                ctx.drawImage(STORYSCREEN,storySlide * CANVASWIDTH/SCALE,0,CANVASWIDTH/SCALE,CANVASHEIGHT/SCALE,0,0,CANVASWIDTH,CANVASHEIGHT)
                ctx.drawImage(LEFTBUTTON,0,0,TILESIZE,TILESIZE,leftButtonX,buttonsYposition,TILESIZE*SCALE,TILESIZE*SCALE)
                ctx.drawImage(RIGHTBUTTON,0,0,TILESIZE,TILESIZE,rightButtonX,buttonsYposition,TILESIZE*SCALE,TILESIZE*SCALE)
            break
            case"instructions":
                ctx.drawImage(CONTROLSCREEN,controlsAnimation * CANVASWIDTH/SCALE,0,CANVASWIDTH/SCALE,CANVASHEIGHT/SCALE,0,0,CANVASWIDTH,CANVASHEIGHT)
                ctx.drawImage(LEFTBUTTON,0,0,TILESIZE,TILESIZE,leftButtonX,buttonsYposition,TILESIZE*SCALE,TILESIZE*SCALE)
                ctx.drawImage(RIGHTBUTTON,0,0,TILESIZE,TILESIZE,rightButtonX,buttonsYposition,TILESIZE*SCALE,TILESIZE*SCALE)
            break
        }
        if(inLevel == false){
            requestAnimationFrame(menus)
        }
    }
menus()

addEventListener("mousedown", mouseClicked)

    function mouseClicked(mouseDown){
        var mouseClicked = mouseDown.button
        if(inLevel == true){
            if ((mouseClicked == 0)&&(player.currentAnimation != "attacking")&&(attackOnCooldown == false)){
                attackButtonPressed = true
            }
        }else{
            switch(currentScreen){
                case"start":
                    currentScreen = "story" 
                break
                case"story":
                    collision = mouseCollision(mouseX,mouseY,rightButtonX,buttonsYposition,TILESIZE * SCALE,TILESIZE * SCALE)
                    if(collision){
                        if(storySlide < 3){
                            storySlide++
                        }else{
                            currentScreen = "instructions"
                            rightButtonX = 704
                            leftButtonX = 64
                            buttonsYposition = 512
                        }
                    }else{
                        collision = mouseCollision(mouseX,mouseY,leftButtonX,buttonsYposition,TILESIZE * SCALE,TILESIZE * SCALE)
                        if(collision){
                            if(storySlide > 0){
                                storySlide = storySlide - 1
                            }else{
                                currentScreen = "start"
                            }
                        }
                    }
                break
                case"instructions":
                collision = mouseCollision(mouseX,mouseY,rightButtonX,buttonsYposition,TILESIZE * SCALE,TILESIZE * SCALE)
                if(collision){
                    player = new Player(96,448,6)
                    definePlayer()
                    door = new Door(124,272)
                    defineDoor()
                    inLevel = true
                    runScene()
                }else {
                    collision = mouseCollision(mouseX,mouseY,leftButtonX,buttonsYposition,TILESIZE * SCALE,TILESIZE * SCALE)                    
                    if(collision){
                        rightButtonX = 640
                        leftButtonX = 128
                        buttonsYposition = CANVASHEIGHT-TILESIZE*SCALE
                        currentScreen = "story"
                        storySlide = 0
                    }
                }
                break
            }
        }
    }
    window.addEventListener('mousemove', mouseMoved)

    function mouseMoved(mouseEvent){
        
        mouseX = mouseEvent.offsetX
        mouseY = mouseEvent.offsetY
    }
//
//incase i ever need it
//
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