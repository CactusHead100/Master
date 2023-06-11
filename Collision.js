function rectangleCollision(r1x,r1y,r1w,r1h,r2x,r2y,r2w,r2h){
if ((r1x + r1w > r2x)
            &&(r1y + r1h > r2y)
            &&(r1x < r2x + r2w)
            &&(r1y < r2y + r2h)
            ) {
                var xOverlap = Math.min(r1x + r1w, r2x + r2w) - Math.max(r1x, r2x)
                var yOverlap = Math.min(r1y + r1h, r2y + r2h) - Math.max(r1y, r2y)
                console.log(xOverlap,yOverlap)
                if (xOverlap < yOverlap){
                    return ["x",yOverlap]
                }else if (xOverlap > yOverlap){
                    return ["y",yOverlap]
                }
        }else{
            return false
        }
    }   