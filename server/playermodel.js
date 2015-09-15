var log = require('loglevel');
var BoardModel = require('./boardmodel');

function PlayerModel(socket) {
    this.socket = socket;
    this.game = null;
    this.mark = null;
    this.name = null;
    var self = this;

    socket.on('name', function(msg) {
        self.name = msg;
        if (self.game !== null) {
            self.game.updateName(self);
        }
        log.debug(msg);
    });

    socket.on('move', function(msg) {
        log.debug('got move', msg);
        var newBoard = new BoardModel(msg);
        if (self.game !== null) {
            self.game.move(self, newBoard);
        }
    });

    socket.on('reset', function() {
        log.debug('got reset');
        if (self.game !== null) {
            self.game.clearBoard();
        }
    });
}

PlayerModel.prototype.setOpponent = function(oppName) {
    log.debug('setOpponent', oppName);
    this.socket.emit('opponent', oppName);
};

PlayerModel.prototype.setBoard = function(board, next, condition) {
    log.debug('setBoard');
    this.socket.emit('board', {
        board: board.state,
        next: next,
        condition: condition
    });
};

PlayerModel.prototype.setMark = function(mark) {
    log.debug('mark', mark);
    this.mark = mark;
    this.socket.emit('mark', mark);
};

module.exports = PlayerModel;
