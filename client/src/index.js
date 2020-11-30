import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = props => {
    return (
        <button className={props.className} onMouseUp={props.onClick} onContextMenu={props.onContextMenu}>
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
                onClick={() => props.onClick(rowNum, i)}
                onContextMenu={(e) => props.onContextMenu(e, rowNum, i)}
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
                onClick={(y, x) => props.onClick(y, x)}
                onContextMenu={(e, y, x) => props.onContextMenu(e, y, x)}
                rowNum={row}
                rowClassName={(row === 2 || row === 5) ? "grid-row-3" : "grid-row"}
                selected={props.selected}
            />
        );
    };

    return (
        <div className="game-grid" onBlur={(e) => props.onClickOutside(e)} ref={ref}>
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
            gameArray: [[3,0,1,3,0,0,0,0,0],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,8,0,0,3,5],
                        [0,0,1,3,0,4,0,3,5],
                        [2,0,1,3,0,4,6,0,5],
                        [0,0,1,3,0,4,9,3,5],
                        [0,0,1,3,0,4,6,2,5],
                        [7,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5]],
            selected: [null, null],
        };
    }

    handleClick(y, x) {
        this.setState({selected: [y, x]});
    }

    handleRightClick(e, y, x) {
        e.preventDefault();

        const grid = this.state.gameArray;
        grid[y][x] = 0;

        this.setState({
            gameArray: grid,
            selected: [y,x],
        });
    }

    handleClickOutside(e) {
        if (!this.ref.current.contains(e.relatedTarget)) {
            this.setState({selected: [null, null]});
        }
    }

    render() {
        return (
            <div className="game-container">
                <Grid
                    gameArray={this.state.gameArray}
                    onClick={(y, x) => this.handleClick(y, x)}
                    onContextMenu={(e, y, x) => this.handleRightClick(e, y, x)}
                    selected={this.state.selected}
                    onClickOutside={(e) => this.handleClickOutside(e)}
                    ref={this.ref}
                />    
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


