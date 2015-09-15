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
        console.log(msg);
    });

    socket.on('move', function(msg) {
        console.log('got move', msg);
        var newBoard = new BoardModel(msg);
        if (self.game !== null) {
            self.game.move(self, newBoard);
        }
    });

    socket.on('reset', function() {
        console.log('got reset');
        if (self.game !== null) {
            self.game.clearBoard();
        }
    });        
}

PlayerModel.prototype.setOpponent = function(oppName) {
    console.log('setOpponent', oppName);
    this.socket.emit('opponent', oppName);
};

PlayerModel.prototype.setBoard = function(board, next, condition) {
    console.log('setBoard');
    this.socket.emit('board', {
        board: board.state,
        next: next,
        condition: condition
    });
};

PlayerModel.prototype.setMark = function(mark) {
    console.log('mark', mark);
    this.mark = mark;
    this.socket.emit('mark', mark);
};

//PlayerModel.prototype.disconnect = function() {
//    this.socket.disconnect();
//};

module.exports = PlayerModel;
