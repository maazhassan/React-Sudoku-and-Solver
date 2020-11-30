import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick} onContextMenu={props.onContextMenu}>
            {props.value}
        </button>
    );
}


class Row extends React.Component {
    renderSquare(i) {
        const value = this.props.squares[i]

        return (
            <Square
                value={value === 0 ? "" : value.toString()}
                onClick={() => this.props.onClick(this.props.rowNum, i)}
                onContextMenu={(e) => this.props.onContextMenu(e, this.props.rowNum, i)}
                key={i.toString()}
            />
        );
    }

    render() {
        const indexes1 = [0, 1, 2];
        const indexes2 = [3, 4, 5];
        const indexes3 = [6, 7, 8];

        return (
            <div className={this.props.rowClassName}>
                <div className="row-piece">
                    {indexes1.map((number) => 
                        this.renderSquare(number)
                    )}
                </div>
                <div className="row-piece">
                    {indexes2.map((number) => 
                        this.renderSquare(number)
                    )}
                </div>
                <div className="row-piece">
                    {indexes3.map((number) => 
                        this.renderSquare(number)
                    )}
                </div>
            </div>
        );
    }
}


class Grid extends React.Component {
    renderRow(row) {
        const gameArray = this.props.gameArray;

        return (
            <Row
                squares={gameArray[row]}
                onClick={(y, x) => this.props.onClick(y, x)}
                onContextMenu={(e, y, x) => this.props.onContextMenu(e, y, x)}
                rowNum={row}
                rowClassName={(row == 2 || row == 5) ? "grid-row-3" : "grid-row"}
            />
        );
    }

    render() {
        return (
            <div className="game-grid">
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
                {this.renderRow(3)}
                {this.renderRow(4)}
                {this.renderRow(5)}
                {this.renderRow(6)}
                {this.renderRow(7)}
                {this.renderRow(8)}
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameArray: [[0,0,1,3,0,0,0,0,0],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,8,0,0,3,5],
                        [0,0,1,3,0,4,0,3,5],
                        [2,0,1,3,0,4,6,0,5],
                        [0,0,1,3,0,4,9,3,5],
                        [0,0,1,3,0,4,6,2,5],
                        [7,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5]],
        };
    }

    handleClick(y, x) {
        const grid = this.state.gameArray;
        grid[y][x] = 5;
        
        this.setState({gameArray: grid});
    }

    handleRightClick(e, y, x) {
        e.preventDefault();

        const grid = this.state.gameArray;
        grid[y][x] = 0;

        this.setState({gameArray: grid});
    }

    render() {
        return (
            <div className="game-container">
                <Grid
                    gameArray={this.state.gameArray}
                    onClick={(y, x) => this.handleClick(y, x)}
                    onContextMenu={(e, y, x) => this.handleRightClick(e, y, x)}
                />    
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


