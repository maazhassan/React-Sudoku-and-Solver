import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = (props) => {

}


class Grid extends React.Component {
    render() {
        return
    }
}

class Game extends React.Component {
    render() {
        return
    }
}


const Counter = (props) => {
    const [count, setCount] = useState(0)

    return (
        <div>
            <p>Hello, {props.name}</p>
            <p>Counter is {count}</p>
            <button onClick={() => setCount(count + 1)}>
              Increment
            </button>
        </div>
    );
}


ReactDOM.render(
    <Counter name="Maaz" />,
    document.getElementById('root')
);


