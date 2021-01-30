import React from 'react';
import './App.css';

import {Initialize, Update} from './BoardHandler.js'

function Cell(props) {
  return (
    <button className={"board-cell"} onClick={props.onClick} style={{ backgroundColor: props.color }}></button>
  );
}

class Row extends React.Component {
  renderCell(cell, i) {
    return <Cell
      key={i}
      color={cell.color}
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
      <div>
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
    const defaultBoardSize = 8;
    this.state = Initialize(defaultBoardSize);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', (event) => this.handleKeyPress(event));
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', (event) => this.handleKeyPress(event));
  }

  handleKeyPress(event) {
    this.setState(Update(this.state, event.key, true));
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board board={this.state.board} />
        </div>
      </div>
    );
  }
}

export default App;