import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick}>
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
                key={i.toString()}
            />
        );
    }

    render() {
        const indexes = [...Array(9).keys()];

        return (
            <div className="grid-row">
                {indexes.map((number) => 
                    this.renderSquare(number)
                )}
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
                rowNum={row}
            />
        );
    }

    render() {
        return (
            <div>
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
            gameArray: [[0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5],
                        [7,0,1,3,0,4,6,3,5],
                        [0,0,1,3,0,4,6,3,5]],
        };
    }

    handleClick(y, x) {
        const grid = this.state.gameArray;
        grid[y][x] = 1;
        
        this.setState({gameArray: grid});
    }

    render() {
        return (
            <div className="game-grid">
                <Grid
                    gameArray={this.state.gameArray}
                    onClick={(y, x) => this.handleClick(y, x)}
                />    
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


