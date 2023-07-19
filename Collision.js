//
//classic bounding box collision i use a funtion as i had it writen out in like 100 lines of code
//but this way makes it neater more effiecent and easier to comprehend (for me to visulize)
//
function boundingBox(rect1X,rect1Y,rect1Width,rect1Height,rect2X,rect2Y,rect2Width,rect2Height){
    if ((rect1X + rect1Width > rect2X)
            &&(rect1Y + rect1Height > rect2Y)
            &&(rect1X < rect2X + rect2Width)
            &&(rect1Y < rect2Y + rect2Height)){
//
//learnt this line from chat.gpt 
//this calculates the overlap by getting the right/bottom side of the reactangle that is closest 
//to (0,0) (top left of the canvas) and the left/top side that is closest to (0,0) (top left corner)
//and as they are colliding the minimum right/bottom side will be greater then the left/top side
//meaning that the result of the minusing gives us the overlap
//
            var xOverlap = Math.min(rect1X + rect1Width, rect2X + rect2Width) - Math.max(rect1X, rect2X)
            var yOverlap = Math.min(rect1Y + rect1Height, rect2Y + rect2Height) - Math.max(rect1Y, rect2Y)
//
//this returns values that are used to resolve collision (the side so we know what way to move the 
//objects to resolve it and the amount of pixels to move)
//
            if (xOverlap < yOverlap){
                if(rect1X<= rect2X){
                    return {"side":"left","overlap":xOverlap}
                }else if(rect1X>rect2X){
                    return {"side":"right","overlap":xOverlap}
                }
            }else if (xOverlap > yOverlap){
                if(rect1Y<rect2Y){
                    return {"side":"top","overlap":yOverlap}
                }else if(rect1Y>rect2Y){
                    return {"side":"bottom","overlap":yOverlap}
                }
            }
    }
//
//as a result of testing the game we return a blank dictionary as otherwise we had reading errors
//where it was trying to find values in a dictionary that were non existant but with this it will 
//be able to read it so there will be no errors and instead of crashing the game it will do nothing
//
    return {"side":"","overlap":0}
}
//
//very simple collision checks if the mouse x and y are within a specific area and if so returns
//true therwise returns false
//
function mouseCollision(mouseX,mouseY,objectX,objectY,objectWidth,objectHeight){
    if((mouseX > objectX)
        &&(mouseX < objectX + objectWidth)
        &&(mouseY > objectY)
        &&(mouseY < objectY + objectHeight)){
            return true
        }else{
            return false
        }
}