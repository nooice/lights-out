import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {
  static defaultProps = {
    ncols: 5,
    nrows: 5,
    chanceLightStartsOn: .25,
    testBoard: [
      [false, false, true, false, false],
      [false, true, true, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false]
      ]
  };

  constructor(props) {
    super(props);
    this.state = ({
      hasWon: false,
      board: this.createBoard()
    })
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard = () => {
    let board = [];
    let { ncols, nrows, chanceLightStartsOn} = this.props;
    for (let y=0; y<nrows; y++){
      let row = [];
      for (let x=0; x<ncols; x++){
        row.push(Math.random() < chanceLightStartsOn);
      }
      board.push(row);
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround = (coord) => {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }
    
    flipCell(y, x);
    flipCell(y-1, x);
    flipCell(y, x-1);
    flipCell(y+1, x);
    flipCell(y, x+1);

    //check if the cells are all dim
    let cellsLeft = board.reduce( (a, b) => a.concat(b) )
      .filter( item => item === true );
    //if so, set hasWon to true
    let hasWon = cellsLeft.length === 0;

    this.setState({board, hasWon});
  }

  displayBoard = () => {
    return(
      <table className="Board">
        <tbody>
          {this.state.board.map((arr, y) => {
            let row = arr.map((tf, x) => {
              return (
                <Cell key={`${y}-${x}`} id={`${y}-${x}`} isLit={tf} flipCellsAroundMe={this.flipCellsAround}/>
              )
            });
            return <tr key={`row${y}`}>{row}</tr>
          })}
        </tbody>
      </table>
    );
  }

  displayWinner = () => {
    return (
      <h1>You Win!!</h1>
    )
  }


  /** Render game board or winning message. */

  render() {
    return (
      <div>
            {!this.state.hasWon ? this.displayBoard() : this.displayWinner()}
      </div>
    );
  }
}


export default Board;
