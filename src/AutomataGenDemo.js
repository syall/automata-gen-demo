import React, { useState } from 'react';
import { Automata } from 'automata-gen';
import './AutomataGenDemo.css';

export default function AutomataGenDemo() {

  // Automata Definition

  /** */
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
  /**/
  /*
  const emptyCell = { state: 'empty', display: ' ' };
  const treeCell = { state: 'tree', display: '🌲' };
  const burningCell = { state: 'burning', display: '🔥' };
  const probabilityBurn = 0.001;
  const probabilityTree = 0.01;
  const initRules = {
    rows: 25,
    cols: 25,
    options: {
      random: true,
      range: [
        { cell: emptyCell, weight: 3 },
        { cell: treeCell, weight: 7 },
      ]
    },
  };
  const stateRules = [
    (nbInfo, prev) => prev.state === 'burning' ? emptyCell : false,
    (nbInfo, prev) =>
      prev.state === 'tree' && nbInfo.neighbors['burning']?.count >= 1
        ? burningCell
        : false
    ,
    (nbInfo, prev) => Math.random() < probabilityBurn ? burningCell : false,
    (nbInfo, prev) => Math.random() < probabilityTree ? treeCell : false,
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
  */
  /*
  const e = { state: 'empty', display: ' ' };
  const h = { state: 'head', display: 'H' };
  const t = { state: 'tail', display: 't' };
  const c = { state: 'conductor', display: '.' };
  const initRules = {
    grid: [
      [t, h, c, c, c, c, c, c, c, c, c],
      [c, e, e, e, c, e, e, e, e, e, e],
      [e, e, e, c, c, c, e, e, e, e, e],
      [c, e, e, e, c, e, e, e, e, e, e],
      [h, t, c, c, e, c, c, c, c, c, c],
    ],
    options: { range: [{ cell: e, weight: 1 }] },
  };
  const stateRules = [
    (nbInfo, prev) => prev.state === 'empty' ? e : false,
    (nbInfo, prev) => prev.state === 'head' ? t : false,
    (nbInfo, prev) => prev.state === 'tail' ? c : false,
    (nbInfo, prev) =>
      prev.state === 'conductor' && (
      nbInfo.neighbors['head']?.count === 1 ||         nbInfo.neighbors['head']?.count === 2)
        ? h
        : false,
    (nbInfo, prev) => prev.state === 'conductor' ? c : false,
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
    g.defaultCell = e;
    return g;
  };
  */

  // State
  const [world] = useState(initGrid());
  const [grid, setGrid] = useState(world.grid);
  const [running, setRunning] = useState(world.running);

  // Style
  const dimension = world.cols;
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
    if (running)
      return;
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
  const displayGrid = () => grid.map((rows, i) =>
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
        {displayGrid()}
      </main>
    </>
  );
};
