# [automata-gen-demo](https://automata-demo.syall.work/)

## Overview

`automata-gen-demo` is a demo for the library [`automata-gen`](https://github.com/syall/automata-gen)

## Technical Notes

The basis of the demo was bootstrapped with [`create-react-app`](https://github.com/facebook/create-react-app).

The main component `AutomataGenDemo` is written as a functional component with React hooks.

## automata-gen

The automata are wrapped in the functions `initLife`, `initFire`, and `initWire` for Game of Life, Forest Fire, and Wire World respectively.

The automata state is controlled with the `start`, `step`, `run`, and `stop` functions.

## State

There are three states stored in the component:

* `world` to store the entire automata
* `grid` to store only the grid of the `world`
* `running` to store the update status of the `world`

## UI

The styles are dynamically calculated based on the current `world`.

The grid is then displayed with `displayCell` and `displayGrid` using CSS grid.
