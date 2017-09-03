




    


var GameOfLife = function(){
    this.seed = 20
    this.dimensions = 50
    this.playfield;
    this.advLives = [];
    this.ticksInterval;
    this.ticks = 500;


    this.init = function(){
        this.settings = document.querySelector("div.settings");
        this.advancedSetBtn = document.querySelector("div.settings div.advanced-st");
        this.settingsAdv = document.querySelector("div.settings-adv");
        this.controls = document.querySelector("div.controls");
        this.welcomeScr = document.querySelector("div.welcome");
        this.stopBtn = document.getElementById("stop");
        this.reloadBtn = document.getElementById("reload");
        this.loadBtn = document.getElementById("load");
        this.loadAdvancedBtn = document.getElementById("load-adv");
        this.ninjasEl = document.getElementById("ninjas");
        this.fourCloverEl = document.getElementById("four-clover");
        this.bodyEl = document.querySelector("body");
        this.titleName = document.getElementById("title-name");
        this.territory = document.getElementById("territory");
        this.territoryAdv = document.getElementById("territory-adv");

        this.stopBtn.addEventListener('click', this.stop, false);
        this.reloadBtn.addEventListener('click', this.reload, false);
        this.advancedSetBtn.addEventListener('click', this.showAdvanced, false);
        this.loadAdvancedBtn.addEventListener('click', this.startAdvanced, false);
        this.ninjasEl.addEventListener("click", this.ninjaMode, false);
        this.fourCloverEl.addEventListener("click", this.originalTheme, false);
        this.loadBtn.addEventListener('click', this.start, false);

        this.ninjas = ["kenny", "cartman", "butters", "clyde"];
        this.lifeCount = 0;
        
    }

    this.showAdvanced  = function(){
        this.settings.classList.add("hidden");
        this.settingsAdv.classList.remove("hidden");

        var dimensionsEl = document.getElementById("dimensions-adv");
        dimensionsEl.addEventListener('change', this.createMiniBoard, false)

        var ticksEl = document.getElementById("ticks-adv");

        this.createMiniBoard();
    }.bind(this);

    this.createMiniBoard = function(e){
        
        this.dimensions = e ? e.target.value : this.dimensions;

        if(this.dimensions > 100){
            alert("Sorry, you can't do that.. \nmax resolution for board is set to 100*100");
            e.target.value = "";
            this.dimensions = 50;
            return;
        }

        var board = document.getElementById("mini-board");
        board.innerHTML = "";
        
        var cellHeight = (window.innerHeight * 0.4) / this.dimensions,
            cellWidth = (window.innerWidth * 0.4) / this.dimensions, 
            row;

            
        for (i = 0; i < this.dimensions; i++){
            row = this.createMiniRow(i, cellHeight, cellWidth);
            board.appendChild(row);
        }
        
    }.bind(this);

    this.createMiniRow = function(i, height, width){
        var row = document.createElement('div'), cell;

        for (j = 0; j < this.dimensions; j++){
            cell = document.createElement('span');
            cell.style.width = width + "px";
            cell.style.height =  height + "px";
            cell.style.cssFloat = "left";
            cell.style.border = "1px solid #1C2225";
            cell.style.background = "white";
            row.appendChild(cell);
            cell.xValue = j;
            cell.yValue = i;
            cell.addEventListener('mouseenter', this.comeToLife, false);
        }

        return row;
    }.bind(this);

    this.comeToLife = function(e){
        e.target.classList.add("lives");
        this.advLives.push([e.target.yValue, e.target.xValue]);
    }.bind(this);

    this.startAdvanced = function(e){
        this.playfield = null;
        var dimensionsEl = document.getElementById("dimensions-adv");
        this.dimensions = parseInt(dimensionsEl.value) || this.dimensions;

        var ticksEl = document.getElementById("ticks-adv");
        this.ticks = parseInt(ticksEl) || this.ticks;

        this.playfield = this.createPlayfield(this.dimensions, this.dimensions);
        this.createBoard();

        this.settingsAdv.classList.add('hidden');
        this.controls.classList.remove('hidden');
        this.welcomeScr.classList.add("dimmed");

        this.ticksInterval = setInterval(function(){
            this.updateGame();
        }.bind(this), this.ticks); 
    }.bind(this);

    this.stop = function(){
        clearInterval(this.ticksInterval);
    }.bind(this);

    this.reload = function(){
        location.reload(true);
    }

    this.start = function(){
        this.playfield = null;
        var dimensionsEl = document.getElementById("dimensions");
        this.dimensions = parseInt(dimensionsEl.value) ||this.dimensions;

        if(this.dimensions > 100){
            alert("Sorry, you can't do that.. \nmax resolution for board is set to 100*100");
            dimensionsEl.value = "";
            this.dimensions = 50;
            return;
        }

        var seedEl = document.getElementById("seed");
        this.seed = parseInt(seedEl.value) || this.seed;

        var ticksEl = document.getElementById("ticks");
        this.ticks = parseInt(ticksEl.value) || this.ticks;

        this.playfield = this.createPlayfield(this.dimensions, this.dimensions);
        this.seedLife(this.seed, this.dimensions);

        this.createBoard(this.dimensions);


        this.settings.classList.add('hidden');
        this.controls.classList.remove('hidden');
        this.welcomeScr.classList.add("dimmed");

        this.ticksInterval = setInterval(function(){
            this.updateGame();
        }.bind(this), this.ticks);  
    }.bind(this);

    

    this.createPlayfield = function(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.createPlayfield.apply(this, args);
        }

        return arr;
    }.bind(this);
    
    this.createBoard = function(){
        var cellHeight = window.innerHeight / this.dimensions,
            cellWidth = window.innerWidth / this.dimensions, 
            board = document.getElementById('board'),
            row;
        
        for (i = 0; i < this.dimensions; i++){
        row = this.createRow(i, cellHeight, cellWidth);
        
        board.appendChild(row);
        }
    }.bind(this);

    this.createRow = function(i, height, width){
        var j, advLength = this.advLives.length;

        var row = document.createElement('div'), cell;

        for (j = 0; j < this.dimensions; j++){
            cell = document.createElement('span');
            cell.style.width = width + "px";
            cell.style.height =  height + "px";
            cell.style.borderRadius = "20%";
            cell.style.visibility = "hidden";
            cell.style.cssFloat = "left";
            this.playfield[i][j] = {
                alive: false,                 
                body: cell
            };
            
            for(t = 0; t < advLength; t++){
                if(this.advLives[t][0] === i && this.advLives[t][1] === j){
                    cell.classList.add("lives");
                    var max = this.ninjas.length -1;
                    cell.classList.add(this.ninjas[this.random(0, max)]);
                    
                    this.playfield[i][j].alive = true;
                    this.lifeCount ++;
                    
                    break;
                }
            }

            row.appendChild(cell);
        }

        return row;
    }.bind(this);

    this.seedLife = function(){
        var randY, randX, i;
        //if seed > number of cells then set seed to number of cells
        this.seed = Math.min(this.seed, this.dimensions * this.dimensions);
        
        for(i = 0; i < this.seed; i++){
            //get random coordinates
            randY = this.random(0, this.dimensions);
            randX = this.random(0, this.dimensions);

            this.advLives.push([randY, randX]);
        }
    }.bind(this);

    this.updateGame = function(){
        var t, arrLength = this.playfield.length, aliveNeighbours, 
        updateQueue = {
            lives: []
        };
            
        for(t = 0; t < arrLength; t++){
            for(var cell in this.playfield[t]){
                (function(y, x){
                    aliveNeighbours = 0;
                    if(this.playfield[y].hasOwnProperty(x)){
                        x = parseInt(x);

                        //Start checking neighbours for life
                        aliveNeighbours = this.countAliveNeighbours(x, y);
                        
                        //apply rules of the game.
                        this.applyRules(aliveNeighbours, x, y, updateQueue);


                    }
                }.bind(this))(t, cell)
            }
        }


        this.update(updateQueue);
        
        if(this.lifeCount === 0){
            this.gameOver();
        }
    }.bind(this);

    this.countAliveNeighbours = function(x, y){
        var aliveNeighbours = 0;
        //For first, last, top and bottom xs we only check existing neighbours (i.e playfield[-1][-1] doesn't exist.)

        //top neighbours
        if(y > 0){
            if(x > 0 && this.playfield[y -1][x -1].alive){
                aliveNeighbours ++;
            }
            if(this.playfield[y -1][x].alive){
                aliveNeighbours ++;
            }
            if(x < this.dimensions -1 && this.playfield[y -1][x +1]){
                aliveNeighbours ++;
            }
        }

        //left & right neighbours
        if(x > 0 && this.playfield[y][x -1].alive){
            aliveNeighbours ++;
        }
        if(x < this.dimensions -1 && this.playfield[y][x +1].alive){
            aliveNeighbours ++
        }

        //bottom neighbours
        if(y < this.dimensions -1){
            if(x > 0 && this.playfield[y +1][x -1].alive){
                aliveNeighbours ++;
            }
            if(this.playfield[y + 1][x].alive){
                aliveNeighbours ++;
            }
            if(x < this.dimensions - 1 && this.playfield[y +1][x +1].alive){
                aliveNeighbours ++;
            }
        }

        return aliveNeighbours;
    }

    this.applyRules = function(aliveNeighbours, cell, t, updateQueue){

        //1.     Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if(this.playfield[t][cell].alive && aliveNeighbours < 2){
            updateQueue.lives.push({
                update: this.reaper(true, cell, t),
            });
        } 
        //2.     Any live cell with two or three live neighbours lives on to the next generation. 
        else if(this.playfield[t][cell].alive && aliveNeighbours === 2 || this.playfield[t][cell].alive && aliveNeighbours === 3){
            updateQueue.lives.push({
                update: this.reaper(false, cell, t),
            });
        }
        //3.     Any live cell with more than three live neighbours dies, as if by overcrowding. 
        else if(this.playfield[t][cell].alive && aliveNeighbours > 3){
            updateQueue.lives.push({
                update: this.reaper(true, cell, t),
            });
        }

        //4.     Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. 
        else if(!this.playfield[t][cell].alive && aliveNeighbours === 3){
            updateQueue.lives.push({
                update: this.reaper(false, cell, t),
            });
        }

    }.bind(this)

    this.reaper = function(shouldDie, x, y){
        return function(){
            if(shouldDie){
                this.playfield[y][x].body.className = "";
                this.lifeCount --;
            }else{
                this.playfield[y][x].body.classList.add('lives')
                var max = this.ninjas.length -1;
                this.playfield[y][x].body.classList.add(this.ninjas[this.random(0, max)]);
                this.lifeCount ++;
                
            }

            this.playfield[y][x].alive = !shouldDie;
        }.bind(this);
    }

    this.update = function(updateQueue){
        for(var life in updateQueue.lives){
            if(updateQueue.lives.hasOwnProperty(life)){
                updateQueue.lives[life].update();
            }
        }
    }.bind(this);

    this.random = function(min,max) {
        return Math.floor(Math.random()*(max-min)+min);
    }

    this.originalTheme = function(e){
        var clicked = e.target;
        this.bodyEl.classList.remove("ninja");
        this.territoryAdv.innerHTML = "Universe";
        this.territory.innerHTML = "Universe";
        this.titleName.innerHTML = "Life";
        clicked.classList.add('hidden');
        this.ninjasEl.classList.remove('hidden');
        this.fourCloverEl.classList.add("hidden");
    }.bind(this);

    this.ninjaMode = function(e){
        var clicked = e.target;
        this.bodyEl.classList.add("ninja");
        this.territoryAdv.innerHTML = "Dojoverse";
        this.territory.innerHTML = "Dojoverse";
        this.titleName.innerHTML = "Ninjas";
        clicked.classList.add('hidden');
        this.fourCloverEl.classList.remove("hidden");
    }.bind(this);

    this.gameOver = function(){
        var gameOverEl = document.getElementById("game-over");
        gameOverEl.addEventListener("click", this.reload, false);
        gameOverEl.classList.remove('hidden');
    }.bind(this);
}



new GameOfLife().init();











