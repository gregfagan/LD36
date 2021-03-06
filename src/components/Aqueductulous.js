import React, { Component } from 'react';
import Game from './Game.js'
import TitleScreen from './TitleScreen.js'
import GameOver from './GameOver.js'

import { GAMEMODE } from '../game/core.js';

import { initializeLogging } from '../util/log.js';

export default class Aqueductulous extends Component {
  constructor() {
    super();

    this.showTitle = this.updateGameMode.bind(this, GAMEMODE.Title);
    this.newGame = () => {
      window.history.replaceState({}, '', '#' + window.btoa((Math.random() * 10e2).toFixed(0)));
      this.updateGameMode(GAMEMODE.Playing);
    };
    this.rematch = this.updateGameMode.bind(this, GAMEMODE.Playing);
    this.showGameOver = result => {
      this.updateGameMode(GAMEMODE.GameOver, result);
    }

    this.state = {
      gameMode: GAMEMODE.Title,
      gameResult: undefined, /*{
        time: 0,
        won: false,
      }*/
    }

    initializeLogging();
  }

  updateGameMode(gameMode, gameResult) {
    this.setState({gameMode, gameResult});
  }

  render() {
    const { gameMode, gameResult } = this.state;
    const hasSeed = !!window.location.hash;

    switch (gameMode) {
      case GAMEMODE.Title:
        return (
          <TitleScreen
            onStartGame={hasSeed ? this.rematch : this.newGame}
          />
        )
      case GAMEMODE.Playing:
        return (
          <Game
            seed={window.location.hash}
            onGameOver={this.showGameOver} 
          />
        );
      case GAMEMODE.GameOver:
        return (
          <GameOver
            result={gameResult}
            onRematch={this.rematch}
            onNewGame={this.newGame}
          />
        );
      default:
        return null;
    }
  }
}