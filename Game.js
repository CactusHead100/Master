window.onload=() => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    var canvasWidth = 800
    var canvasHeight = 600
//player object with x,y,width,height,velocities and also similar properties for its hammer
    class Player{
        constructor(){
            this.x = 0
            this.y = 0
            this.width = 0
            this.height = 0
            this.xVelocity = 0
            this.yVelocity = 0

            this.hammer = {
                x:0,
                y:0,
                width:0,
                height:0,
            }
        }
    }
}
