import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = props => {
    return (
        <button 
            className={props.className} 
            onMouseDown={props.onClick} 
            onContextMenu={e => e.preventDefault()}
        >
            {props.value}
        </button>
    );
}


const Row = props => {
    const renderSquare = i => {
        const value = props.squares[i]
        const [selY, selX] = props.selected;
        const rowNum = props.rowNum;
        const playValue = props.playable[i];

        let classes = "square";
        if (i === selX && rowNum === selY) {
            classes += " selected";
        }
        if (playValue) {
            classes += " user-inputted";
        }

        return (
            <Square
                value={value === 0 ? "" : value.toString()}
                onClick={(e) => props.onClick(e, rowNum, i)}
                key={i.toString()}
                className={classes}
            />
        );
    };

    const indexes1 = [0, 1, 2];
    const indexes2 = [3, 4, 5];
    const indexes3 = [6, 7, 8];

    return (
        <div className={props.rowClassName}>
            <div className="row-piece">
                {indexes1.map((number) => 
                    renderSquare(number)
                )}
            </div>
            <div className="row-piece">
                {indexes2.map((number) => 
                    renderSquare(number)
                )}
            </div>
            <div className="row-piece">
                {indexes3.map((number) => 
                    renderSquare(number)
                )}
            </div>
        </div>
    );
}


const Grid = React.forwardRef((props, ref) => {
    const renderRow = row => {
        const gameArray = props.gameArray;
        const playable = props.playable;

        return (
            <Row
                squares={gameArray[row]}
                playable={playable[row]}
                onClick={(e, y, x) => props.onClick(e, y, x)}
                rowNum={row}
                rowClassName={(row === 2 || row === 5) ? "grid-row-3" : "grid-row"}
                selected={props.selected}
            />
        );
    };

    return (
        <div 
            className="game-grid" 
            onBlur={(e) => props.onClickOutside(e)} 
            ref={ref}
            onKeyDown={(e) => props.onKeyDown(e)}
        >
            {renderRow(0)}
            {renderRow(1)}
            {renderRow(2)}
            {renderRow(3)}
            {renderRow(4)}
            {renderRow(5)}
            {renderRow(6)}
            {renderRow(7)}
            {renderRow(8)}
        </div>
    );
});


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            gameArray: Array(9).fill(Array(9).fill(0)),
            playable: Array(9).fill(Array(9).fill(0)),
            selected: [null, null],
            solved: false,
            editing: false,
        };
    }

    componentDidMount() {
        this.fetchPuzzle();
    }

    handleClick(e, y, x) {
        if (this.state.playable[y][x]) {
            this.setState({selected: [y, x]});

            if (e.button === 2 && !this.state.solved) {
                const grid = this.state.gameArray;
                grid[y][x] = 0;
                this.setState({gameArray: grid});
            }
        }
    }

    handleClickOutside(e) {
        if (!this.ref.current.contains(e.relatedTarget)) {
            this.setState({selected: [null, null]});
        }
    }

    handleKeyDown(e) {
        const selected = this.state.selected;
        if (selected[0] !== null && !this.state.solved) {
            const allowed = ['0','1','2','3','4','5','6','7','8','9','Backspace']
            const key = e.key;
            if (allowed.includes(key)) {
                const [y, x] = selected;
                const grid = this.state.gameArray;
                grid[y][x] = (key === 'Backspace') || key === '0' ? 0 : parseInt(key);
                this.setState({gameArray: grid});
                if (checkWin(grid)) {
                    this.setState({solved: true});
                }
            }
        }
    }

    fetchPuzzle() {
        fetch('/server/puzzle').then(res => res.json()).then(data => {
            this.setState({gameArray: data['puzzle']});
            const grid = data['puzzle'];
            const playMap = grid.map(row => {
                return row.map(elem => {
                    if (elem === 0) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
            });
            this.setState({
                playable: playMap,
                solved: false,
            });
        });
    }

    solveBoard() {
        const solvedBoard = solve(this.state.gameArray, this.state.playable);
        this.setState({
            gameArray: solvedBoard,
            solved: true,
        });
    }

    editBoard() {
        this.setState({
            gameArray: Array(9).fill().map(() => Array(9).fill(0)),
            playable: Array(9).fill().map(() => Array(9).fill(1)),
            solved: false,
            editing: true,
        })
    }

    confirmEdit() {
        const grid = this.state.gameArray;
        let counter = 0;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if (grid[i][j] != 0) counter++;
            }
        }
        if (counter < 17) return;
        if (!checkValid(grid)) return;
        const playMap = grid.map(row => {
            return row.map(elem => {
                if (elem === 0) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        });
        this.setState({
            playable: playMap,
            editing: false,
        });
    }

    cancelEdit() {
        this.setState({editing: false});
        this.fetchPuzzle();
    }

    render() {
        const solved = this.state.solved;

        return (
            <div className="game-container">
                <Grid
                    gameArray={this.state.gameArray}
                    playable={this.state.playable}
                    onClick={(e, y, x) => this.handleClick(e, y, x)}
                    selected={this.state.selected}
                    onClickOutside={(e) => this.handleClickOutside(e)}
                    ref={this.ref}
                    onKeyDown={(e) => this.handleKeyDown(e)}
                />
                <div className="toolbar">
                    <div className="top-row">
                        <div className="toolbar-elem">
                            <button onClick={() => this.fetchPuzzle()} disabled={this.state.editing}>New Puzzle</button>
                        </div>
                        <div className="toolbar-elem">
                            <button onClick={() => this.solveBoard()} disabled={this.state.editing}>Solve</button>
                        </div>
                        <div className="toolbar-elem">
                            <span>Status: {solved ? "Solved" : "Unsolved"}</span>
                        </div>
                    </div>
                    <div className="bottom-row">
                        <div className="toolbar-elem">
                            <button onClick={() => this.editBoard()}>Set Board</button>
                        </div>
                        <div className="toolbar-elem">
                            <button onClick={() => this.confirmEdit()} disabled={!this.state.editing}>Confirm</button>
                        </div>
                        <div className="toolbar-elem">
                            <button onClick={() => this.cancelEdit()} disabled={!this.state.editing}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function checkValid(board) {
    for (let i = 0; i < board.length; i++) {
        let nums = 0;
        // Rows
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] !== 0) nums++;
        }
        let rowSet = new Set(board[i]);
        rowSet.delete(0);
        if (rowSet.size !== nums) return false;

        nums = 0;

        // Columns
        let col = [];
        for (let j = 0; j < board.length; j++) {
            col.push(board[j][i])
            if (board[j][i] !== 0) nums++;
        }
        let colSet = new Set(col);
        colSet.delete(0);
        if (colSet.size !== nums) return false;

        nums = 0;

        // Squares
        let square = [];
        const startX = (i * 3) % 9;
        const startY = Math.floor(i / 3) * 3
        square.push(board[startY][startX])
        square.push(board[startY][startX+1])
        square.push(board[startY][startX+2])
        square.push(board[startY+1][startX])
        square.push(board[startY+1][startX+1])
        square.push(board[startY+1][startX+2])
        square.push(board[startY+2][startX])
        square.push(board[startY+2][startX+1])
        square.push(board[startY+2][startX+2])

        for (let j = 0; j < square.length; j++) {
            if (square[j] !== 0) nums++;
        }
        let squareSet = new Set(square);
        squareSet.delete(0);
        if (squareSet.size !== nums) return false;
    }
    return true;
}

function checkWin(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].includes(0)) return false;
    }
    return checkValid(board);
}

function solve(board, playable) {
    let gameBoard = board;

    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
            if (playable[i][j]) gameBoard[i][j] = 0;
        }
    }

    let i = 0, squareValid;
    while (i < gameBoard.length) {  // rows
        let j = 0;
        while (j < gameBoard.length) {  // cols
            if (playable[i][j]) {
                while (gameBoard[i][j] < 9) {
                    gameBoard[i][j]++;
                    if (!checkValid(gameBoard)) {
                        squareValid = false;
                        continue;
                    } 
                    else {
                        squareValid = true;
                        break;
                    }
                }
                if (!squareValid) {
                    gameBoard[i][j] = 0;
                    if (j === 0) {
                        i--;
                        j = gameBoard.length-2;
                    }
                    else j -= 2;

                    while (!playable[i][j+1]) {
                        if (j+1 === 0) {
                            i--;
                            j = gameBoard.length-2;
                        }
                        else j -= 1;
                    }
                }
            }
            j++;
        }
        i++;
    }
    return gameBoard;
}