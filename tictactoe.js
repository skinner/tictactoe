var React = require('react');

var BoardView = React.createClass({
    handleClick: function(rowNum, colNum) {
        this.props.boardClicked(rowNum, colNum);
    },
    render: function() {
        return (<table className="board">
                {this.props.board.map(function(row, rowNum) {
                    return (
                            <tr key={rowNum}>
                            {row.map(function(value, colNum) {
                                return (
                                        <td onClick={this.handleClick.bind(this, rowNum, colNum)} key={rowNum + "." + colNum}>{value}</td>
                                );
                            }, this)}
                        </tr>
                    );
                }, this)}
                </table>
               );
    }
});

var StateView = React.createClass({
    render: function() {
        return(
                <p>
                {(this.props.condition !== null ?
                  (this.props.condition.win ?
                   'WIN for ' + this.props.condition.mark :
                   (this.props.condition.draw ? 'DRAW' : '')
                  ) :
                  (this.props.next === null ?
                   '' :
                   (this.props.next === this.props.mark ?
                    'Your turn:' :
                    'Their turn.')
                  )
                 )}
            </p>
        )        
    }
});

var GameView = React.createClass({
    componentDidMount: function () {
	var self = this;
	this.socket = io();
        this.socket.on('connect', function() {
            self.socket.emit('name', self.state.name);
        });
	this.socket.on('opponent', function (opponent) {
	    self.setState({opponent: opponent});
	});
	this.socket.on('mark', function (mark) {
	    self.setState({mark: mark});
	});
        this.socket.on('board', function (turnState) {
            self.setState({board: turnState.board,
                           next: turnState.next,
                           condition: turnState.condition});
        });
    },
    getInitialState: function() {
        return {
            board: [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']],
            mark: null,
            name: null,
            opponent: null,
            next: null,
            condition: null
        };
    },
    boardClicked: function(rowNum, colNum) {
        var newBoard = this.state.board.concat();
        newBoard[rowNum] = newBoard[rowNum].concat();
        newBoard[rowNum][colNum] = this.state.mark;
        this.socket.emit('move', newBoard);
    },
    reset: function() {
        this.socket.emit('reset');
    },
    nameChanged: function(evt) {
        var newName = evt.target.value;
        this.setState({name: newName});
        this.socket.emit('name', newName);
    },
    render: function() {
        return (<div>
                <p>Your name: <input type="text" value={this.state.name} onChange={this.nameChanged} /></p>
                <p>You are playing against: {this.state.opponent}</p>
                <p>You are: {this.state.mark}</p>
                <StateView next={this.state.next}
                           condition={this.state.condition}
                           mark={this.state.mark} />
                <BoardView board={this.state.board}
                           boardClicked={this.boardClicked} />
                {this.state.condition !== null ?
                 <input type="button" value="Reset" onClick={this.reset} /> :
                 ''
                }
                </div>
               );
    }
});


function render(container) {
    React.render(<GameView />, container);
}

module.exports = {
    BoardView: BoardView,
    GameView: GameView,
    render: render
};
