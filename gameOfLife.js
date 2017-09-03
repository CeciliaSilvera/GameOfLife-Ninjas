


var seed = 20,
    dimensions = 50,
    playfield,
    lives = [],
    advLives = [],
    ticksInterval,
    ticks = 500,
    settings = document.querySelector("div.settings"),
    advancedSetBtn = document.querySelector("div.settings div.advanced-st")
    settingsAdv = document.querySelector("div.settings-adv"),
    controls = document.querySelector("div.controls"),
    welcomeScr = document.querySelector("div.welcome"),
    stopBtn = document.getElementById("stop"),
    reloadBtn = document.getElementById("reload"),
    loadBtn = document.getElementById("load"),
    loadAdvancedBtn = document.getElementById("load-adv"),
    isAdvancedMode = false;
    
loadBtn.addEventListener('click', start, false);
stopBtn.addEventListener('click', stop, false);
reloadBtn.addEventListener('click', reload, false);
advancedSetBtn.addEventListener('click', showAdvanced, false);
loadAdvancedBtn.addEventListener('click', startAdvanced, false)



function showAdvanced(){
    settings.classList.add("hidden");
    settingsAdv.classList.remove("hidden")

    var dimensionsEl = document.getElementById("dimensions-adv");
    dimensionsEl.addEventListener('change', createMiniBoard, false)

    var ticksEl = document.getElementById("ticks-adv");

    createMiniBoard();
}

function createMiniBoard(seedBoard){
    advLives = [];
    var board = document.getElementById("mini-board");
    board.innerHTML = "";
    
    dimensions = this.value || dimensions
    var cellHeight = (window.innerHeight * 0.3) / dimensions,
        cellWidth = (window.innerWidth * 0.3) / dimensions, 
        row;

        
    for (i = 0; i < dimensions; i++){
       row = createMiniRow(i, cellHeight, cellWidth);
       
       board.appendChild(row);
    }
}


function createMiniRow(i, height, width){
    var row = document.createElement('div'), cell;

    for (j = 0; j < dimensions; j++){
        cell = document.createElement('span');
        cell.style.width = width + "px";
        cell.style.height =  height + "px";
        cell.style.cssFloat = "left";
        cell.style.border = "1px solid #333";
        cell.style.background = "white";
        row.appendChild(cell);
        cell.xValue = j;
        cell.yValue = i;
        cell.addEventListener('mouseenter', comeToLife, false);
    }

    return row;
}

function comeToLife(){
    this.classList.add("lives");
    advLives.push([this.xValue, this.yValue]);
}

function startAdvanced(){
    playfield = null;
    var dimensionsEl = document.getElementById("dimensions-adv");
    dimensions = parseInt(dimensionsEl.value) || dimensions;

    var ticksEl = document.getElementById("ticks-adv");
    ticks = parseInt(ticksEl) || ticks;

    playfield = createPlayfield(dimensions, dimensions);
    createBoard(dimensions);
    seedAdvancedLife();
    

    settingsAdv.classList.add('hidden');
    controls.classList.remove('hidden');
    welcomeScr.classList.add("dimmed");

    ticksInterval = setInterval(function(){
        updateGame();
    }, ticks); 
}

function seedAdvancedLife(){
    var i, livesLength = advLives.length, xValue, yValue;
    for(i = 0; i < livesLength; i++){
        xValue = advLives[i][0];
        yValue = advLives[i][1];
        playfield[yValue][xValue].alive = true;
    }
}
function stop(){
    clearInterval(ticksInterval);
}

function reload(){
    location.reload(true);
}


function start(){
    playfield = null;
    var dimensionsEl = document.getElementById("dimensions");
    dimensions = parseInt(dimensionsEl.value) ||dimensions;

    var seedEl = document.getElementById("seed");
    seed = parseInt(seedEl.value) || seed;

    var ticksEl = document.getElementById("ticks");
    ticks = parseInt(ticksEl) || ticks;

    playfield = createPlayfield(dimensions, dimensions);

    createBoard(dimensions);

    seedLife(seed, dimensions);

    settings.classList.add('hidden');
    controls.classList.remove('hidden');
    welcomeScr.classList.add("dimmed");

    ticksInterval = setInterval(function(){
        updateGame();
    }, ticks);  
}

function createPlayfield(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createPlayfield.apply(this, args);
    }

    return arr;
};

function createBoard(dimensions){
    var cellHeight = window.innerHeight / dimensions,
        cellWidth = window.innerWidth / dimensions, 
        board = document.getElementById('board'),
        row;

    for (i = 0; i < dimensions; i++){
       row = createRow(i, cellHeight, cellWidth);
       
       board.appendChild(row);
    }
}

function createRow(i, height, width){
    var row = document.createElement('div'), cell;

    for (j = 0; j < dimensions; j++){
        cell = document.createElement('span');
        cell.style.width = width + "px";
        cell.style.height =  height + "px";
        cell.style.borderRadius = "20%";
        cell.style.visibility = "hidden";
        cell.style.cssFloat = "left";
        row.appendChild(cell);
        playfield[i][j] = {
            alive: false,
            body: cell
        };
    }

    return row;
}


function seedLife(seed, dimensions){
    var randY, randX, s;
    //if seed > number of cells then set seed to number of cells
    seed = Math.min(seed, dimensions * dimensions);
    
    for(s = 0; s < seed; s++){
        randY = random(0, dimensions);
        randX = random(0, dimensions);

        if(playfield[randY][randX].alive){
            s--;
            continue;
        }else{
            playfield[randY][randX].alive = true;
        }
    }
}


function updateGame(){
    var t, arrLength = playfield.length, aliveNeighbours, 
    updateQueue = {
        lives: []
    };
        
    for(t = 0; t < arrLength; t++){
        for(var cell in playfield[t]){
            (function(t, cell){
                aliveNeighbours = 0;
                var xValue, yValue;
                if(playfield[t].hasOwnProperty(cell)){
                    cell = parseInt(cell);
                    //Start checking neighbours for life
                    //For first, last, top and bottom cells we only check existing neighbours (i.e playfield[-1][-1] doesn't exist.)

                    //top neighbours
                    if(t > 0){
                        xValue = cell -1;
                        yValue = t -1;
                        if(cell > 0 && playfield[yValue][xValue].alive){
                        aliveNeighbours ++;
                        }
                        xValue = cell;
                        if(playfield[yValue][xValue].alive){
                            aliveNeighbours ++;
                        }
                        xValue = cell + 1;
                        if(cell < dimensions -1 && playfield[yValue][xValue]){
                            aliveNeighbours ++;
                        }
                    }

                    //left & right neighbours
                    xValue = cell -1
                    if(cell > 0 && playfield[t][xValue].alive){
                        aliveNeighbours ++;
                    }
                    xValue = cell + 1;
                    if(cell < dimensions -1 && playfield[t][xValue].alive){
                        aliveNeighbours ++
                    }

                    //bottom neighbours
                    if(t < dimensions -1){
                        yValue = t + 1;
                        xValue = cell -1;
                        if(cell > 0 && playfield[yValue][xValue].alive){
                            aliveNeighbours ++;
                        }
                        if(playfield[yValue][cell].alive){
                            aliveNeighbours ++;
                        }
                        xValue = cell + 1;
                        if(cell < dimensions - 1 && playfield[yValue][xValue].alive){
                            aliveNeighbours ++;
                        }
                    }

                    //1.     Any live cell with fewer than two live neighbours dies, as if caused by under-population.
                    if(playfield[t][cell].alive && aliveNeighbours < 2){
                        updateQueue.lives.push({
                            x: cell,
                            y: t,
                            die: function(){
                                if(playfield[t][cell].body.classList.contains('lives')){
                                    playfield[t][cell].body.classList.remove('lives');
                                }
                            },
                            shouldDie: true
                        });
                    } 
                    //2.     Any live cell with two or three live neighbours lives on to the next generation. 
                    if(playfield[t][cell].alive && aliveNeighbours === 2 || playfield[t][cell].alive && aliveNeighbours === 3){
                        updateQueue.lives.push({
                            x: cell,
                            y: t,
                            live: function(){
                                if(!playfield[t][cell].body.classList.contains('lives')){
                                    playfield[t][cell].body.classList.add('lives')
                                }
                            },
                            shouldDie: false
                        });
                    }
                    //3.     Any live cell with more than three live neighbours dies, as if by overcrowding. 
                    if(playfield[t][cell].alive && aliveNeighbours > 3){
                        updateQueue.lives.push({
                            x: cell,
                            y: t,
                            die: function(){
                                if(playfield[t][cell].body.classList.contains('lives')){
                                    playfield[t][cell].body.classList.remove('lives');
                                }
                            },
                            shouldDie: true
                        });
                    }

                    //4.     Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. 
                    if(!playfield[t][cell].alive && aliveNeighbours === 3){
                        updateQueue.lives.push({
                            x: cell,
                            y: t,
                            live: function(){
                                if(!playfield[t][cell].body.classList.contains('lives')){
                                    playfield[t][cell].body.classList.add('lives')
                                }
                            },
                            shouldDie: false
                        });
                    }
                }
            })(t, cell)
        }
    }


    update(updateQueue);

}

function update(updateQueue){
    for(var life in updateQueue.lives){
        if(updateQueue.lives.hasOwnProperty(life)){
            if(!updateQueue.lives[life].shouldDie){
                updateQueue.lives[life].live();
                playfield[updateQueue.lives[life].y][updateQueue.lives[life].x].alive = true;
            }else{
                updateQueue.lives[life].die();
                playfield[updateQueue.lives[life].y][updateQueue.lives[life].x].alive = false;
            }
        }
    }
}


function random(min,max) {
    return Math.floor(Math.random()*(max-min)+min);
}