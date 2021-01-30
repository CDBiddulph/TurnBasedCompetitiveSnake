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

class Board extends React.Component {
  render() {
    return (
      <div className="game-board">
        {this.props.board.map((row, i) => (
          <Row
            key={i}
            cells={row}
          />
        ))}
      </div>
    );
  }
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

  render() {
    return (
      <div className="game">
        <div className="score">
          {this.state.players.map((player, i) => (
            <div className="player-score">
              <h1 style={{ color: ColorMap[i+1] }}> P{i+1} </h1> 
              <h2> Rounds won: {player.roundsWon} </h2> 
              <h2> Fruit eaten: {player.fruitEaten} </h2> 
            </div>
          ))}
        </div>
        <Board board={this.state.board} />
      </div>
    );
  }
}

export default App;