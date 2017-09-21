import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  renderPosition() {
      if (this.props.value != null)
        return this.props.value;
      return "("+(this.props.position%3+1)+","+(Math.floor(this.props.position/3)+1)+")";
  }
  render() {
    var squareClass = {
      className: "square",
    };
    if (this.props.winner)
      squareClass.className = "square win-square";
    return (
      <button {...squareClass} onClick={this.props.onClick}>
      {this.renderPosition()}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square 
        key={i}
        position={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} 
        winner={winner}
      />
    );
  }
  render() {
    let rowList = [];
    let squareList = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        squareList.push(this.renderSquare(i*3+j, 
          this.props.winner && this.props.winner.indexOf(i*3+j) !== -1));
      }
      rowList.push(<div key={i} className="board-row">{squareList}</div>);
      squareList = [];
    }
    return <div>{rowList}</div>;
  }
}

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      stepOrdIsReversed: false,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  reverse() {
    this.setState({
      stepOrdIsReversed: !this.state.stepOrdIsReversed,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const boldStyle = { fontWeight: 'bold', };

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      var styleAttr = {};
      if (move === this.state.stepNumber)
        styleAttr.style = boldStyle;
      return (
        <li key={move} {...styleAttr} >
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
        );
    });

    if (this.state.stepOrdIsReversed)
      moves.reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol reversed={this.state.stepOrdIsReversed}>{moves}</ol>
          <button className="reverse-button"
            onClick={() => this.reverse()} >Reverse</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}