var log = require('loglevel');

var ROWS = 3;
var COLS = 3;
var STATES = {
    ' ': true,
    'X': true,
    'O': true
};

function BoardModel(state) {
    if (!state) {
        state = [];
        for (var row = 0; row < ROWS; row++) {
            state.push([]);
            for (var col = 0; col < COLS; col++) {
                state[row].push(' ');
            }
        }
    }
    this.state = state;
    this.condition = this.getCondition();
}

BoardModel.prototype.isValid = function() {
    if (this.state.length !== ROWS) {
        return false;
    }
    for (var row = 0; row < ROWS; row++) {
        if (this.state[row].length !== COLS) {
            return false;
        }
        for (var col = 0; col < COLS; col++) {
            if (! (this.state[row][col] in STATES)) {
                return false;
            }
        }
    }
    return true;
};

BoardModel.prototype.validMove = function(newBoard, mark) {
    var moves = this.diff(newBoard);
    // check that there's exactly one move, and
    // that the play matches the given player
    return (moves.length === 1) && (moves[0].mark === mark);
};

BoardModel.prototype.getCondition = function() {
    // I'm sure there's a cleverer way to do this, but straight-ahead
    // code seems clearest.
    for (var row = 0; row < ROWS; row++) {
        if (this.winRow(row)) {
            return {win: true, draw: false, mark: this.state[row][0]};
        }
    }
    for (var col = 0; col < COLS; col++) {
        if (this.winColumn(col)) {
            return {win: true, draw: false, mark: this.state[0][col]};
        }
    }
    if (this.winLeftDiag()) {
        return {win: true, draw: false, mark: this.state[0][0]};
    }
    if (this.winRightDiag()) {
        return {win: true, draw: false, mark: this.state[0][COLS - 1]};
    }

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            if (this.state[row][col] === ' ') {
                // if there are any blank spaces left, we can continue
                return null;
            }
        }
    }
    // if no blank spaces and no win, draw
    return {win: false, draw: true};
};

BoardModel.prototype.winColumn = function(col) {
    var init = this.state[0][col];
    if (init === ' ') {
        return false;
    }
    for (var row = 1; row < ROWS; row++) {
        if (init !== this.state[row][col]) {
            return false;
        }
    }
    return true;
};

BoardModel.prototype.winRow = function(row) {
    var init = this.state[row][0];
    if (init === ' ') {
        return false;
    }
    for (var col = 1; col < COLS; col++) {
        if (init !== this.state[row][col]) {
            return false;
        }
    }
    return true;
};

BoardModel.prototype.winLeftDiag = function() {
    var init = this.state[0][0];
    if (init === ' ') {
        return false;
    }
    if (init !== ' ') {
        for (var i = 1; i < ROWS; i++) {
            if (init !== this.state[i][i]) {
                return false;
            }
        }
    }
    return true;
};

BoardModel.prototype.winRightDiag = function() {
    var init = this.state[0][COLS - 1];
    if (init === ' ') {
        return false;
    }
    for (var i = 1; i < ROWS; i++) {
        if (init !== this.state[i][COLS - i - 1]) {
            return false;
        }
    }
    return true;
};

BoardModel.prototype.diff = function(newBoard) {
    var moves = [];
    for (var row = 0; row < ROWS; row++) {
        for (col = 0; col < COLS; col++) {
            // if this position is the same, no move here
            if (this.state[row][col] === newBoard.state[row][col]) {
                continue;
            }

            if (this.state[row][col] !== ' ') {
                // can't move where there's already something
                return [];
            }

            // if the boards are different at this position, call it a move
            moves.push({row: row,
                        col: col,
                        mark: newBoard.state[row][col]});
        }
    }
    return moves;
}

module.exports = BoardModel;
