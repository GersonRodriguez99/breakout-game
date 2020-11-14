var canvas = document.getElementById('myCanvas');
// allows you to draw in the canvas
var ctx = canvas.getContext ('2d');

// there are two paramenters in setIntervals. The name of the function and the time
//before executing it


//will center the ball horizontally, half of the width of the canvas is in the middle
var x = canvas.width/2;
// just pull up the ball 30px from the buttom
var y = canvas.height - 30;

//adds two on every frame
var dx = 2;
var dy = -2;
var ballRadius = 10;

//variables to draw paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false; //start up with false because no buttom is being pressed
var leftPressed = false;

//variables for the brick
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var lives = 3;

//hold the score
var score = 0;

var bricks = []
for(c = 0; c < brickColumnCount; c++){
    bricks[c] = []; //array inside an array
    for(r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y:0, status:1} // if the status is 1 means draw 0 means it was hitted
    }
}


document.addEventListener("keydown", keyDownHandler); // event calling a method
document.addEventListener("keyup", keyUpHandler);  // event calling a method

function drawBricks(){
    for(c = 0; c < brickColumnCount; c++){
        for(r=0; r < brickRowCount; r++){
            //this code will run if the brick status is equal to 1
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+ brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+ brickOffsetTop;
                bricks [c][r].x = brickX;
                bricks [c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//when the key is pressed
function keyDownHandler(key){
    if(key.keyCode == 39){
        rightPressed = true;
    }
    else if(key.keyCode == 37){
        leftPressed = true;
    }
}
//when the key is realised set up to false as the beginning
function keyUpHandler(key){
    if(key.keyCode == 39){
        rightPressed = false;
    }
    else if(key.keyCode == 37){
        leftPressed = false;
    }
}


//math.pi*2 is what make the ball to have 360g
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0 , Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
//the rect method request four paramethers x y width and hight
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection(){
    for(c= 0; c< brickColumnCount; c++){
        for(r = 0; r< brickRowCount; r++){
            var b = bricks[c][r];
             //stores the position of the bricks
            // if the x position is greater than the x position of the brick
            // if is between the top and bottom you change the position
            if (b.status == 1){
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                    dy = -dy; // you take away the brick
                    b.status = 0; // it doesn't draw the brick again
                    score++; //score increases
                    if(score == brickColumnCount * brickRowCount){
                        alert("You WON!");
                        document.location.reload();
                    }
                }
            }
        }

    }
}

function drawScore (){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8,20); //numbers are x and y coordinates
}
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 20) // 65px from the right of the canvas and 20 as the scoree
}


function draw(){
    // x and y coordinates of the top left coorner and the x and y of buttom
    // clear rect clear the canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    collisionDetection();
    drawLives();

    // here we change the direction of the ball it voids from keeping it moving upwards

    //change direction if the center of the ball is greater than the canvas height
    // the top is 0, so it will make the ball going back
    // top 0, buttom 480px
    if ( y + dy < ballRadius ){
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius){  //if the ball touches the bottom
        // if the ball is between the left and right possition of the paddle
        if (x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }else{
            lives--;
            if(!lives){
                alert("Game Over");
                document.location.reload(); //reload
            }else{
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }

        }

    }
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
        dx = -dx;
    }

    //check which key is pressed
    // you add 7px or substract 7px
    // we substract canvas width minus paddle width to prevent it from seenking into the wall
    // avoids the key to move right or left forever
    if (rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0){
        paddleX -=7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

document.addEventListener("mousemove", mouseMoveHandler);
function mouseMoveHandler(mouse){ //parameter associated with the mouse move
        var relativeX = mouse.clientX - canvas.offsetLeft; //clientx is to set up the mouse, horizontal position
        if (relativeX > 0 && relativeX < canvas.width){ // the mouse is within the canvas
            paddleX = relativeX - paddleWidth/2; // the value of the paddle will be at whatever the mouse points at
        }
    }
draw();

