import React, { useState } from 'react';
import { Automata } from 'automata-gen';
import './AutomataGenDemo.css';

export default function AutomataGenDemo() {

  // Automata Definition
  const emptyCell = { state: 0, display: '0' };
  const aliveCell = { state: 1, display: '1' };
  const initRules = {
    options: {
      random: true,
      range: [
        { cell: emptyCell, weight: 7 },
        { cell: aliveCell, weight: 3 },
      ]
    },
  };
  const stateRules = [
    (nbInfo, prev) => nbInfo.count < 2 || nbInfo.count > 3 ? emptyCell : false,
    (nbInfo, prev) => nbInfo.count === 3 ? aliveCell : false,
  ];
  const runningRules = {
    msPerStep: 100,
    maxIterations: 250,
  };
  const initGrid = () => {
    const g = new Automata(
      initRules,
      stateRules,
      runningRules,
    );
    g.generateGrid();
    return g;
  };

  // State
  const [world] = useState(initGrid());
  const [grid, setGrid] = useState(world.grid);
  const [running, setRunning] = useState(world.running);

  // Style
  const dimension = Math.min(world.rows, world.cols);
  const size = `calc(80vmin / ${dimension})`;
  const worldStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${dimension}, ${size})`,
    gridGap: '1px',
    backgroundColor: 'black',
    border: '1px solid black'
  };
  const cellStyle = {
    width: `${size}`,
    height: `${size}`,
    backgroundColor: 'white',
    textAlign: 'center',
    lineHeight: `${size}`,
    fontSize: `3vmin`
  };

  // Update Cell
  const updateCell = i => k => () => {
    const tempGrid = world.generateGrid(false);
    for (let row = 0; row < world.rows; row++)
      for (let col = 0; col < world.cols; col++)
        tempGrid[row][col] =
          row === i && col === k
            ? grid[row][col].state === world.defaultCell.state
              ? world.getRandomCell(world.calculateTotalWeight())
              : world.defaultCell
            : grid[row][col];
    setGrid(tempGrid);
  };

  // Display
  const displayCell = col => col ? col.display : world.defaultCell.display;
  const displayGrid = grid.map((rows, i) =>
    rows.map((col, k) => (
      <div className='cell'
        key={`r${i}c${k}`}
        style={cellStyle}
        onClick={updateCell(i)(k)}
      >
        {displayCell(col)}
      </div>
    ))
  );

  // Update Grid
  const update = start => () => {
    if (running && !start)
      return;
    world.updateGrid();
    setGrid(world.grid);
  };

  // Start Automata
  const start = () => {
    if (running)
      return;
    setRunning(true);
  };
  const step = async () => {
    await world.sleep();
    await update(true)();
  };
  const run = async () => running && await step();
  run();

  // Stop Automata
  const stop = () => {
    if (!running)
      return;
    setRunning(false);
  };

  // Empty Automata
  const emptyGrid = () => {
    if (running)
      return;
    world.grid = world.generateGrid(false);
    setGrid(world.grid);
  };

  // Fill Automata
  const fillGrid = () => {
    if (running)
      return;
    world.grid = world.generateGrid(true);
    setGrid(world.grid);
  };

  return (
    <>
      <p className='title'>automata-gen demo</p>
      <aside className='controls'>
        <button className='control' onClick={update(false)}>Step</button>
        <button className='control' onClick={start}>Start</button>
        <button className='control' onClick={stop}>Stop</button>
        <button className='control' onClick={emptyGrid}>Empty</button>
        <button className='control' onClick={fillGrid}>Random</button>
      </aside>
      <main className='world' style={worldStyle}>
        {displayGrid}
      </main>
    </>
  );
};
