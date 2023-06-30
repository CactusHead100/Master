function boundingBox(rect1X,rect1Y,rect1Width,rect1Height,rect2X,rect2Y,rect2Width,rect2Height){
    if ((rect1X + rect1Width > rect2X)
            &&(rect1Y + rect1Height > rect2Y)
            &&(rect1X < rect2X + rect2Width)
            &&(rect1Y < rect2Y + rect2Height)
            ) {
                var xOverlap = Math.min(rect1X + rect1Width, rect2X + rect2Width) - Math.max(rect1X, rect2X)
                var yOverlap = Math.min(rect1Y + rect1Height, rect2Y + rect2Height) - Math.max(rect1Y, rect2Y)
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
    return {"side":"","overlap":0}
    }