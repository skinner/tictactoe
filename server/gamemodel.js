var log = require('loglevel');
var BoardModel = require('./boardmodel');

var MARKS = ['X', 'O'];

function GameModel() {
    this.players = [];
    this.board = new BoardModel();
    this.nextMover = 0;
}

GameModel.prototype.addPlayer = function(player) {
    log.debug('addPlayer');
    player.game = this;
    if (this.players.length === 0) {
        player.setMark(MARKS[0]);
    } else {
        player.setMark(MARKS[(MARKS.indexOf(this.players[0].mark) + 1) % 2]);
        this.players[0].setOpponent(player.name);
        player.setOpponent(this.players[0].name);
    }
    this.players.unshift(player);
    if (this.players.length > 2) {
        this.players.length = 2;
    }
    this.clearBoard();
};

GameModel.prototype.updateName = function(player) {
    log.debug('updateName');
    for (var i = 0; i < this.players.length; i++) {
        if (player === this.players[i]) {
            continue;
        }
        this.players[i].setOpponent(player.name);
    }
};

GameModel.prototype.clearBoard = function() {
    log.debug('clearBoard');
    this.board = new BoardModel();

    for (var i = 0; i < this.players.length; i++) {
        this.players[i].setBoard(this.board, MARKS[this.nextMover], null);
    }
};

GameModel.prototype.move = function(player, newBoard) {
    log.debug('move');
    if (this.board.condition !== null) {
        // if the board is already in an end condition, ignore further moves
        return;
    }
    if (newBoard.isValid() && (player.mark === MARKS[this.nextMover])) {
        if (this.board.validMove(newBoard, player.mark)) {
            this.nextMover = (this.nextMover + 1) % 2;
            this.board = newBoard;
            log.debug('condition', this.board.condition);
            for (var i = 0; i < this.players.length; i++) {
                this.players[i].setBoard(this.board,
                                         MARKS[this.nextMover],
                                         this.board.condition);
            }
        }
    }
};

module.exports = GameModel;
