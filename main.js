function loadGame(){
    var cnt = document.getElementById('gameCnt'); //Game play area
    var scoreCnt = document.querySelector('.scoreNumber');

    //Creates game container with small squares...
    function createContainer(){
        cnt.innerHTML = '';
        for(var n = 0; n < 900; n++){
            var square = document.createElement('p');
            var transformCal = Math.floor(n/30);
            square.style.transform = 'translateY(-'+(transformCal*10)+'px)';
            square.style.mozTransform = 'translateY(-'+(transformCal*10)+'px)';
            square.style.webkitTransform = 'translateY(-'+(transformCal*10)+'px)';
            square.style.msTransform = 'translateY(-'+(transformCal*10)+'px)';
            cnt.appendChild(square);
        }

    }

    var squares = document.getElementsByTagName('p');

    var gameSpeed = 100; //Speed of snake
    var gameStatus = 'over'; //Game not yet started
    var actives = [463,464,465,466]; //Squares that create initial snake
    var moveDirection = 39; //Moving derection of snake depending on the arrow key code (39 initial derection)
    var snakeFood = Math.floor(Math.random()*900); //Snake's food position
    var score = 0; //Game score

    //Changes the direction to Up
    function moveUp(){
        var nextActive = actives[actives.length - 1]-30;
        if(nextActive < 0){
            nextActive += 900;
        }
        return nextActive;
    }

    //Changes the direction to Down
    function moveDown(){
        var nextActive = actives[actives.length - 1]+30;
        if(nextActive > 899){
            nextActive -= 900;
        }
        return nextActive;
    }

    //Changes the direction to Right
    function moveRight(){
        var nextActive = actives[actives.length - 1]+1;
        if(nextActive%30 === 0){
            nextActive -= 30;
        }
        return nextActive;
    }

    //Changes the direction to Left
    function moveLeft(){
        var nextActive = actives[actives.length - 1]-1;
        if(nextActive%30 === 29 || nextActive < 0){
            nextActive += 30;
        }
        return nextActive;
    }

    //Moves the snake to the specified direction
    function moveSnake(){
        var nextActive;
        switch(moveDirection){
            case 39:
                nextActive = moveRight();
                break;
            case 37:
                nextActive = moveLeft();
                break;
            case 38:
                nextActive = moveUp();
                break;
            case 40:
                nextActive = moveDown();
        }
        //Checks for overlaping
        if(actives.indexOf(nextActive) >= 0){
            //stopGame();
            clearInterval(intv);
            stopGame();
            return;
        }
        //Checks for eating food
        else if(nextActive === snakeFood){
            snakeFood = Math.floor(Math.random()*900);
            score += 10;
            scoreCnt.textContent = score;
        }
        else {
            var shiftedSquare = actives.shift();
            squares[shiftedSquare].style.background = '#000';
        }

        actives.push(nextActive);
        for(var n = 0; n < actives.length; n++){
            squares[actives[n]].style.background = 'blue';
        }
        squares[snakeFood].style.background = 'red';
    }

    var intv;
    var timeout;
    //Adds key press handler
    document.body.addEventListener('keydown',function(e){
        e.preventDefault();
        if(e.keyCode >= 37 && e.keyCode <= 40 && Math.abs(moveDirection - e.keyCode)%2 != 0 && gameStatus === 'running'){
            moveDirection = e.keyCode;
            clearInterval(intv);
            clearTimeout(timeout);
            moveSnake();
            if(gameStatus !== 'over'){
              timeout = setTimeout(function(){
                  intv = setInterval(function(){
                      moveSnake();
                  },gameSpeed);
              },gameSpeed);
            }
        }
    })

    //Starts the game
    function startGame(){
        scoreCnt.textContent = score;
        clearInterval(intv);
        if(gameStatus === 'over'){
            cnt.innerHTML = '';
            createContainer();
            timeout = setTimeout(function(){
                intv = setInterval(function(){
                    moveSnake();
                },gameSpeed)
            },gameSpeed)
        }
        else if(gameStatus === 'paused'){
            timeout = setTimeout(function(){
                intv = setInterval(function(){
                    moveSnake();
                },gameSpeed);
            },gameSpeed);
        }
        gameStatus = 'running';
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        resumeBtn.style.display = 'none';
    }

    //Stops the game
    function stopGame(){
        if(gameStatus === 'running'){
            clearInterval(intv);
            gameStatus = 'over';
            //cnt.innerHTML = 'Game Over';
            actives = [462,463,464,465,466];
            moveDirection = 39;
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            score = 0;
        }
    }

    //Pauses the game
    function pauseGame(){
        if(gameStatus === 'running'){
            clearInterval(intv);
            gameStatus = 'paused';
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'inline-block';
        }
    }


    var startBtn = document.getElementById('startGame');
    //var stopBtn = document.getElementById('stopGame');
    var pauseBtn = document.getElementById('pauseGame');
    var resumeBtn = document.getElementById('resumeGame');


    startBtn.addEventListener('click',startGame);
    //stopBtn.addEventListener('click',stopGame);
    pauseBtn.addEventListener('click',pauseGame);
    resumeBtn.addEventListener('click',startGame);
    document.getElementById('snakeSpeed').addEventListener('change',function(){
      gameSpeed = 230 - this.value;
      pauseGame();
      startGame();
  });
}

loadGame();
