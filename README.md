# React Sudoku and Solver
A multi-featured Sudoku game made with React, Flask, and SQLite3.

## Features include: 
  - 100000 random puzzles
  - Custom solving algorithm using back-tracking
  - Custom puzzle creation

## Instructions
  1. Navigate to "client" folder.
  2. Run "yarn start-api" or "npm run start-api".
  3. Run "yarn start" or "npm run start".

## Description
I built this project beacuse I wanted to improve my skills with ReactJS and also wanted to learn how to create a full-stack web application.

A new Sudoku grid is generated each time the "New Puzzle" button on the toolbar is clicked. When the user closes the browsing session, the current board is saved and will be reloaded the next time the page is visited.

The user can set their own puzzle by clicked the "Set Board" button. The board will be cleared, and squares can be filled normally. To finish setting the puzzle, click the "Confirm" button on the toolbar. The inputted puzzle will then be checked for validity and, if it is valid, will be set. Otherwise, the "Confirm" button will not do anything. If the "Cancel" button is pressed while setting the puzzle, a new randomly generated puzzle will be set.

The "Solve" button on the toolbar instantly solves the puzzle using a back-tracking algorithm.
