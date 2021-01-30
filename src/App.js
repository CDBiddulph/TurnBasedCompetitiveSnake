import React from 'react';
import './App.css';

import {Initialize, Update} from './BoardHandler.js'

const ColorMap = Object.freeze({0:"white", 1:"green", 2:"blue", 3:"red"});

function Cell(props) {
  return (
    <div className={"board-cell"} style={{ backgroundColor: ColorMap[props.contents] }}></div>
  );
}

class Row extends React.Component {
  renderCell(cell, i) {
    return <Cell
      key={i}
      contents={cell.contents}
    />;
  }

  render() {
    return (
      <div className="board-row">
        {this.props.cells.map((cell, i) => (this.renderCell(cell, i)))}
      </div>
    );
  }
}

function Board(props) {
  return (
    <div className="game-board">
      {props.board.map((row, i) => (
        <Row
          key={i}
          cells={row}
        />
      ))}
    </div>
  );
}

function Score(props) {
  console.log(props.playerTurn);
  return (
    <div className="score">
      {props.players.map((player, i) => (
        <div key={i} className="player-score">
          <h1 className={"player-heading"}
            style={{ color: ColorMap[i+1], "box-shadow": props.playerTurn === i ? ("0px 0px 5px 5px " + ColorMap[i+1]) : null }}>
              P{i+1}
          </h1> 
          <h2> Rounds won: {player.roundsWon} </h2> 
          <h2> Fruit eaten: {player.fruitEaten} </h2> 
        </div>
      ))}
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    const defaultBoardSize = 6;
    this.state = Initialize(defaultBoardSize);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', (event) => this.handleKeyPress(event));
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', (event) => this.handleKeyPress(event));
  }

  handleKeyPress(event) {
    this.setState(Update(this.state, event.key));
  }

  restartGame() {
    this.setState(Initialize(this.state.boardSize));
  }

  render() {
    return (
      <div className="game">
        <div className="game-top">
          <Score players={this.state.players} playerTurn={this.state.playerTurn} />
          <Board board={this.state.board} />
        </div>
        <button className="restart" onClick={() => { this.restartGame(); }}>Restart Game</button>
      </div>
    );
  }
}

export default App;