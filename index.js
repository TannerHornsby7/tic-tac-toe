// Player Logic
const playerFactory = function(xoro, name) {
    let wins = 0;
    const won = ()=>wins+=1;
    const getWins =()=>wins;
    let ai = false;
    let vsai = false;
    return {xoro, name, won, getWins, ai, vsai}
}

// Initial Entry logic
const modeSelectionForm =(()=>{
    const modeform = document.getElementById('modeform')
    const ai = document.getElementById('selectpvai');
    const pvp = document.getElementById('selectpvp');
    const aiform = document.getElementById('pvaiform');
    const pvpform = document.getElementById('pvpform');

    let gametype = null;

    ai.addEventListener('click', ()=>{
        modeform.style.display = "none";
        aiform.style.display = "grid";
        gametype = "AI";
    })

    pvp.addEventListener('click', ()=>{
        modeform.style.display = "none";
        pvpform.style.display = "grid";
        gametype = "PVP"
    })

    return { gametype }
})()

// Prototype Form Logic
const form = (()=> {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }          

    function formatName(name) {
        return capitalizeFirstLetter(name);
    }

    function closeForm(form) {
        const overlay = document.getElementById('overlay');
        form.style.display = "none"
        overlay.style.display = "none" 
    }
    const playerX = playerFactory("X", "Blank");
    const playerO = playerFactory("O", "Blank");

    function setPlayerNames(nx, no){
        playerX.name = formatName(nx);
        playerO.name = formatName(no);    
    }
    return { playerX, playerO, setPlayerNames, closeForm}
})();

// PVAI Form Logic inherit basic form logic
const pvaiform = (()=> {
    let clicked = false;
    let hard = false;

    const difficulty = document.getElementById('difficulty')
    const pvaiform = document.getElementById('pvaiform');
    const overlay = document.getElementById('overlay');
    const start = document.getElementById('startpvai');
    const formhead = document.getElementById('formheadai');
    const o = document.getElementById('o');
    const x = document.getElementById('x');

    
    //adding click event listeners to set ai and player
    o.addEventListener('click', ()=>{
        form.playerX.name = "AI";
        form.playerO.name = "Player";
        formhead.textContent = "You are O's"
        form.playerX.vsai = false;
        form.playerO.vsai = true;
        form.playerO.ai = false;
        form.playerX.ai = true;
        clicked = true;
    })
    x.addEventListener('click', ()=>{
        form.playerX.name = "Player";
        form.playerO.name = "AI";
        formhead.textContent = "You are X's"
        form.playerO.vsai = false;
        form.playerX.vsai = true;
        form.playerX.ai = false;
        form.playerO.ai = true;
        clicked = true;
    })

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getAIPlayer() {
        if(form.playerX.ai) {
            return form.playerX;
        }
        else {
            return form.playerO;
        }
    }

    // adding dificulty button click listener
    difficulty.addEventListener('click', ()=>{
        if(difficulty.textContent == "EASY") {
            difficulty.textContent = "IMPOSSIBLE";
            difficulty.classList.add("hard");
            hard = true;
        } else {
            difficulty.textContent = "EASY"
            difficulty.classList.remove("hard")
            hard = false;
        }
    });
    
    function getAIMove(board) {
        if(hard) {
            // Implement Hard Mode
            console.log("HARD")
        }
        else {
            let x = getRandomInt(3)
            let y = getRandomInt(3)
            while(board[x][y] != "") {
                x = getRandomInt(3);
                y = getRandomInt(3);
            }
            board[x][y] = getAIPlayer().xoro;
        }
    }

    start.addEventListener('click', () => {

        // make sure user select their icon type
        if(!clicked) {
            return alert("Please Select Your Icon (X or O)");
        }

        // close form and erase overlay
        form.closeForm(pvaiform);
    }); 

    return { getAIMove, getAIPlayer }
})();

// PVP Form Logic inherit basic form logic
const pvpform = (()=> {

    const pvpform = document.getElementById('pvpform');
    const start = document.getElementById('startpvp');

    start.addEventListener('click', () => {
        let pxname = document.getElementById('pxname').value;
        let poname = document.getElementById('poname').value;

        // check both names are entered
        if(!pxname || !poname) {
            return alert("Please Enter Both Player Names or Choose AI!");
        }

        // close window and erase overlay
        form.closeForm(pvpform)

        // setting player names
        form.setPlayerNames(pxname, poname);
    });
})();

// Game Board object
const gameBoard = (() => {
    let whoisup = form.playerX;
    // Initialize 2D gameboard array
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    // Selecting DOM Elemets
    const tiles = document.querySelectorAll('.tile');
    const popup = document.createElement('div');
    const body = document.querySelector('.container');
    const cta = document.getElementById('cta');
    const reset = document.getElementById('reset');
    const xwins = document.getElementById('xwins');
    const owins = document.getElementById('owins')



    popup.classList.add("gameending");
    popup.style.display = "block";

    


    tiles.forEach(tile => {tile.addEventListener('click', (e) => {
        if(e.target.textContent != "") {
            return;
        }

        placeVal(whoisup.xoro, e.target.getAttribute('data-index'))
        if(whoisup.vsai) {
            if(checkWinner() != false) {
                cta.textContent = whoisup.name + " Wins, Good Game!"
                whoisup.won();
                xwins.textContent = form.playerX.name + ": " + form.playerX.getWins();
                owins.textContent = form.playerO.name + ": " + form.playerO.getWins();
                clearBoard()
            }
            else if (boardFull()) {
                cta.textContent = "It's A Tie!"
                clearBoard();
            }
            pvaiform.getAIMove(board);
            updateUI();
        }
        if(checkWinner()  == whoisup.xoro) {
            cta.textContent = whoisup.name + " Wins, Good Game!"
            whoisup.won();
            xwins.textContent = form.playerX.name + ": " + form.playerX.getWins();
            owins.textContent = form.playerO.name + ": " + form.playerO.getWins();
            clearBoard();
        } else if (checkWinner() == pvaiform.getAIPlayer().xoro) {
            cta.textContent = pvaiform.getAIPlayer().name + " Wins, Good Game!"
            pvaiform.getAIPlayer().won();
            xwins.textContent = form.playerX.name + ": " + form.playerX.getWins();
            owins.textContent = form.playerO.name + ": " + form.playerO.getWins();
            clearBoard();
        } else if (boardFull()) {
            cta.textContent = "It's A Tie!"
            clearBoard();
        } 
        
        if(!whoisup.vsai){
            whoisup = whoisup.xoro == form.playerX.xoro ? form.playerO : form.playerX;
            cta.textContent = "It is " + whoisup.name + "'s Turn"
        }
        updateUI();
    })});

    let checkWinner = () => {

        /*
        8 win conditions:
            1-6: straights
            7-8: diagonals

        */
        for (let i = 0; i < 3; i++) {
            if(board[0][i] && board[0][i] == board[1][i] && board[1][i] == board[2][i]) { // cols
                return board[0][i]
            }
            if(board[i][0] && board[i][0] == board[i][1] && board[i][1] == board[i][2]) { // rows
                return board[i][0]
            }
        }
        if(board[1][1] && board[1][1] == board[0][2] && board[0][2] == board[2][0]) {
            return board[1][1]
        }
        if(board[1][1] && board[1][1] == board[0][0] && board[0][0] == board[2][2]) {
            return board[1][1]            
        }
        else {
            return false
        }
    }

    //place value into the gameBoard 2D array
    let placeVal = (val, loc) => {
        board[parseInt(Math.floor(loc / 3))][loc % 3] = val;
    }

    let printBoard = () => {
        for (let i in board) {
            for (let j in board[i]) {
                console.log("value at row: " + i + ", and col: " + j + " is " + board[i][j])
            }
        }
    }
    let clearBoard = () => {
        for (let i in board) {
            for (let j in board[i]) {
                board[i][j] = ""
            }
        }
    }
    let boardFull = () => {
        for (let i in board) {
            for (let j in board[i]) {
                if (board[i][j] == "") {
                    return false;
                }
            }
        }
        return true;
    }

    updateUI = () => {
            for(let i = 0; i < 9; i++) {
                let val = board[parseInt(Math.floor(i / 3))][i % 3];
                tiles[i].textContent = val
        }
    }


    //on reset clear board
    reset.addEventListener('click', () => {
        clearBoard()
        updateUI()
    });


    return {placeVal, checkWinner, boardFull, printBoard, clearBoard, updateUI}
})();