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

        return (
            <Square
                value={value === 0 ? "" : value.toString()}
                onClick={(e) => props.onClick(e, rowNum, i)}
                key={i.toString()}
                className={(i === selX && rowNum === selY) ? "square-selected" : "square"}
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

        return (
            <Row
                squares={gameArray[row]}
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
            gameArray: [[5,3,4,6,7,8,9,1,2],
                        [6,7,2,1,9,5,3,4,8],
                        [1,9,8,3,4,2,5,6,7],
                        [8,5,9,7,6,1,4,2,3],
                        [4,2,6,8,5,3,7,9,1],
                        [7,1,3,9,2,4,8,5,6],
                        [9,6,1,5,3,7,2,8,4],
                        [2,8,7,4,1,9,6,3,5],
                        [3,4,5,2,8,6,1,7,0]],
            selected: [null, null],
            solved: false,
        };
    }

    handleClick(e, y, x) {
        this.setState({selected: [y, x]});

        if (e.button === 2 && !this.state.solved) {
            const grid = this.state.gameArray;
            grid[y][x] = 0;
            this.setState({gameArray: grid});
        }
    }

    handleClickOutside(e) {
        if (!this.ref.current.contains(e.relatedTarget)) {
            this.setState({selected: [null, null]});
        }
    }

    handleKeyDown(e) {
        const selected = this.state.selected;
        if (selected !== [null, null] && !this.state.solved) {
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

    render() {
        const solved = this.state.solved;

        return (
            <div className="game-container">
                <Grid
                    gameArray={this.state.gameArray}
                    onClick={(e, y, x) => this.handleClick(e, y, x)}
                    selected={this.state.selected}
                    onClickOutside={(e) => this.handleClickOutside(e)}
                    ref={this.ref}
                    onKeyDown={(e) => this.handleKeyDown(e)}
                />
                <p>{solved ? "Solved" : "Not solved"}</p>
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function checkWin(board) {
    for (let i = 0; i < board.length; i++) {
        // Rows
        if ((board[i].includes(0)) || (new Set(board[i]).size !== board[i].length)) {
            return false;
        }

        // Columns
        let col = [];
        for (let j = 0; j < board.length; j++) {
            col.push(board[j][i])
        }
        if ((col.includes(0)) || (new Set(col).size !== col.length)) {
            return false;
        }

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
        if ((square.includes(0)) || (new Set(square).size !== square.length)) {
            return false;
        }
    }
    return true;
}