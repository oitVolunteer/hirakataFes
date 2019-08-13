$(document).ready(function(){
    var canvas = $("#gameCanvas");
    var context = canvas.get(0).getContext("2d");
    // canvas size
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();

    // setting of game
    var playGame;

    var asteroids;
    var numAsteroids;

    var player;

    var score;
    var addScore = 50;
    var timeout;

    var arrowUp = 38;
    var arrowRight = 39;
    var arrowDown = 40;

    var ui = $("#gameUI");
    var uiIntro = $("#gameIntro");
    var uiStats = $("#gameStats");
    var uiComplete = $("#gameComplete");
    var uiPlay = $("#gamePlay");
    var uiReset = $(".gameReset");
    var uiScore = $(".gameScore");

    var Asteroid = function(x, y, radius, vX){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vX = vX;
    };

    var Player = function(x, y){
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.halfWidth = this.width/2;
        this.halfHeight = this.height/2;

        this.vX = 0;
        this.vY = 0;

        // move player
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    };

    function startGame(){
        // reset score
        uiScore.html("0");
        uiStats.show();

        // init game
        playGame = false;

        asteroids = new Array();
        numAsteroids = 10;

        score = 0;

        player = new Player(150, canvasHeight/2);

        for(var i=0; i<numAsteroids; i++){
            var radius = 5 + (Math.random()*10);
            var x = canvasWidth + radius + Math.floor(Math.random()*canvasWidth);
            var y = Math.floor(Math.random()*canvasHeight);
            var vX = -5 - (Math.random()*5);

            asteroids.push(new Asteroid(x, y, radius, vX));
        };

        // input pertern
        $(window).keydown(function(e){
            var keyCode = e.keyCode;

            if(!playGame){
                playGame = true;
                animate();
                timer();
            };

            if(keyCode == arrowRight){
                player.moveRight = true;
            }else if(keyCode == arrowUp){
                player.moveUp = true;
            }else if(keyCode == arrowDown){
                player.moveDown = true;
            };
        });
        $(window).keyup(function(e){
            var keyCode = e.keyCode;

            if(keyCode == arrowRight){
                player.moveRight = false;
            }else if(keyCode == arrowUp){
                player.moveUp = false;
            }else if(keyCode == arrowDown){
                player.moveDown = false;
            };
        });

        // start animation
        animate();
    };

    function init(){
        uiStats.hide();
        uiComplete.hide();

        uiPlay.click(function(e){
            e.preventDefault();
            uiIntro.hide();
            startGame();
        });

        uiReset.click(function(e){
            e.preventDefault();
            uiComplete.hide();
            clearTimeout(timeout);
            startGame();

            // input pertern
            $(window).unbind("keyup");
            $(window).unbind("keydown");
        });
    };

    function timer(){
        if(playGame){
            timeout = setTimeout(function(){
                uiScore.html(++score);
                timer();
            }, 1000);
        };
    };

    function animate(){
        // clear
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        //var tmpAsteroid = new Asteroid;

        // asteroid
        var asteroidsLength = asteroids.length;
        for(var i=0; i<asteroidsLength; i++){
            var tmpAsteroid = asteroids[i];

            tmpAsteroid.x += tmpAsteroid.vX;

            // move asteroid
            if(tmpAsteroid.x + tmpAsteroid.radius < 0){
                tmpAsteroid.radius = 5 + (Math.random()*10);
                tmpAsteroid.x = canvasWidth + tmpAsteroid.radius;
                tmpAsteroid.y = Math.floor(Math.random()*canvasHeight);
                tmpAsteroid.vX = -5 - (Math.random()*5);
            };

            var dX = player.x - tmpAsteroid.x;
            var dY = player.y - tmpAsteroid.y;
            var distance = Math.sqrt((dX*dX)+(dY*dY));

            if(distance < player.halfWidth+tmpAsteroid.radius){
                playGame = false;
                clearTimeout(timeout);
                uiStats.hide();
                uiComplete.show();

                $(window).unbind("keyup");
                $(window).unbind("keydown");
            };

            context.fillStyle = "rgb(255, 255, 255)";
            context.beginPath();
            context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        };

        // move player
        player.vX = 0;
        player.vY = 0;

        if(player.moveRight){
            player.vX = 3;
        }else{
            player.vX = -3;
        };

        if(player.moveUp){
            player.vY = -3;
        };

        if(player.moveDown){
            player.vY = 3;
        };

        player.x += player.vX;
        player.y += player.vY;

        context.fillStyle = "rgb(255, 0, 0)";
        context.beginPath();
        context.moveTo(player.x + player.halfWidth, player.y);
        context.lineTo(player.x - player.halfWidth, player.y - player.halfHeight);
        context.lineTo(player.x - player.halfWidth, player.y + player.halfHeight);
        context.closePath();
        context.fill();

        // check boundary
        if(player.x - player.halfWidth < 20){
            player.x = 20 + player.halfWidth;
        }else if(player.x + player.halfWidth > canvasWidth - 20){
            player.x = canvasWidth - 20 - player.halfWigth;
        };

        if(player.y - player.halfHeight < 20){
            player.y = 20 + player.halfHeight;
        }else if(player.y + player.halfHeight > canvasHeight - 20){
            player.y = canvasHeight - 20 - player.halfHeight;
        };

        if(playGame){
            // restart game 33ms later
            setTimeout(animate, 33);
        };
    };

    init();
});
