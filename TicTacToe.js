'use strict';

//  Track players
let playerController = (function () {
    let users = [];
    let tiles = {};
    let activePlayer = 0;

    return {
        addUser: function (user) {
            users.push(user);
        },

        setTileOccupation: function (myTile, occupyStatus) {
            tiles.set(myTile, occupyStatus);
        },
        // Check if key/tile has been selected before:
        verifySelection: function (selection) {
            if (tiles[selection] === "None") {
                tiles[selection] = users[activePlayer];
                return true;
            }
            return false;
        },

        fillTileMap: function (aTile) {
            tiles[aTile] = "None";
        },

        switchPlayer: function () {
            activePlayer == 0 ? activePlayer = 1 : activePlayer = 0;
        },

        checkForWinner: function () {
            console.log("Checking for a winner.")
            let tileValues = Object.values(tiles);

            if (tileValues[0] === users[activePlayer]) {
                if ((tileValues[1] === users[activePlayer] && tileValues[2] === users[activePlayer]) || (tileValues[3] === users[activePlayer] && tileValues[6] === users[activePlayer])){
                    return true;
                }
            } 
            if (tileValues[8] === users[activePlayer]) {
                if ((tileValues[7] === users[activePlayer] && tileValues[6] === users[activePlayer]) || (tileValues[5] === users[activePlayer] && tileValues[2] === users[activePlayer])){
                    return true;
                }
            } else if (tileValues[4] === users[activePlayer]) {
                for (let upper = 0, last = 8; upper < 4; upper++, last--) {
                    if (tileValues[upper] === users[activePlayer] && tileValues[last] === users[activePlayer]) {
                        return true;
                    }
                }
            }
            return false;
        },

        getCurrPlayer: function () {
            return users[activePlayer];
        },

        getTileStyle: function () {
            let cssPlayerNr = activePlayer + 1;
            return `Player${cssPlayerNr}`;
        },
        // Test function to add players for web building testing html:
        testPlayer: function () {
            users.push("Player One");
            users.push("Player Two");
        }

    }

})();


//  Handle tags & update/retrieve from DOM:
let UIController = (function () {
    let statustext = "tic Tac Toe";
    return {
        changeSingleSquare: function (tag, cssProfile) {
            let currTile = document.getElementById(tag.id);
            currTile.disabled = true;
            currTile.classList.remove("Tile");
            currTile.classList.add(cssProfile);

        },

        getTilesDOM: function () {
            return [...document.querySelectorAll("div#GameBoard div")];
        },

        //  Initial player setup, recursive to account for bad input:
        playerNames: function (player_nr, msg = "Enter your name") {
            let player_name = window.prompt(`${msg} Player${player_nr}`);

            if (player_name === null || player_name === "")
                this.playerNames(player_name, player_nr, "Please enter a valid name");

            return player_name;
        },

        updateStatusText: function (textValue) {
            document.getElementById('status').innerHTML = textValue;
        },

        getStatusText: function () {
            return statustext;
        }
    };

})();


let controller = (function (playerC, UIC) {
    // Main app controller: 

    let setupEventListeners = function () {
        console.log('Add listener');
        //  TODO : Add reset listener.
        //  Attach div id's to click event:
        let myTiles = UIC.getTilesDOM()
        myTiles.forEach(element => {
            element.addEventListener('click', handleTileSelection);
            playerC.fillTileMap(element.id);
        });
    }
    //  Loop twice for player names:
    function setupPlayers() {
        for (let i = 0; i < 2; i++) {
            playerController.addUser(UIC.playerNames(i + 1));
        }
    }
    //  Check status of tile and change if available:
    function handleTileSelection() {
        console.log('Selected a tile!');
        if (playerC.verifySelection(this.id)) {

            document.getElementById(this.id).removeEventListener('click', this.handleTileSelection);
            UIC.changeSingleSquare(this, playerC.getTileStyle());
            setText();
        }
        console.log(this.id);

    }

    function setText() {
        if (playerC.checkForWinner() == true) {
            UIC.updateStatusText(`${playerC.getCurrPlayer()} you won congratulations!`);
        } else {
            playerC.switchPlayer();
            UIC.updateStatusText(`${playerC.getCurrPlayer()}`);
        }
    }

    return {
        init: function () {
            console.log('Game started.');
            //  Comment out 'setupPlayers' for 'playerC.testPlayer'
            //setupPlayers();
            playerC.testPlayer();
            // ----------------------
            setupEventListeners();
            UIC.updateStatusText(`${playerC.getCurrPlayer()}`)
        }
    };

})(playerController, UIController);

controller.init();