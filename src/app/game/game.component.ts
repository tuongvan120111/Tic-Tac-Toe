import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TIC_TAC_TOE } from '../constant';

interface Field { numberButton: number, isDisable: boolean, player: string };

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  score: string = TIC_TAC_TOE.RESULT.SCORE;;
  player1: string = TIC_TAC_TOE.RESULT.PLAYER_1;
  player2: string = TIC_TAC_TOE.RESULT.PLAYER_2;
  startButton: string = TIC_TAC_TOE.GAME_FIELD.START_BUTTON;
  resetButton: string = TIC_TAC_TOE.GAME_FIELD.RESET_BUTTON;
  score1: number = 0;
  score2: number = 0;
  buttonList: Field[] = [];
  stepPlayer1: number = null;
  stepPlayer2: number = null;
  isStarted = true;
  playerWon: string;
  isEndStep = false;
  isMessageShow = false;
  currentTurn = TIC_TAC_TOE.RESULT.PLAYER_1;

  WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 9; i++) {
      this.buttonList.push({ numberButton: i, isDisable: true, player: i.toString() });
    }
  }

  onSelected(selected: number) {
    const buttonClicked = this.buttonList.find((button: Field) => button.numberButton === selected);
    const isPlayer1 = this.currentTurn === this.player1;
    if (!buttonClicked.player) {
      if (isPlayer1) {
        this.stepPlayer1 += 1;
        buttonClicked.player = 'x';
      } else {
        this.stepPlayer2 += 1;
        buttonClicked.player = 'o';
      }

      const currentStep = this.stepPlayer1 + this.stepPlayer2;
      if (currentStep >= 5) {
        if (this.isPlayerWon()) {
          this.playerWon = this.currentTurn;
          this.isMessageShow = true;
          this.isStarted = true;
          this.buttonList.forEach((button: Field) => {
            button.isDisable = true;
          });
          isPlayer1 ? this.score1 += 1 : this.score2 += 1;
          this.currentTurn = isPlayer1 ? this.player2 : this.player1;
          return;
        }

        if (currentStep === 9) {
          this.isEndStep = true;
        }
      }

      this.currentTurn = isPlayer1 ? this.player2 : this.player1;
    }
  }

  onStart() {
    this.isStarted = false;
    this.onReset();
  }

  onReset() {
    if (this.buttonList.length > 0) {
      this.stepPlayer1 = 0;
      this.stepPlayer2 = 0;
      this.isEndStep = false;
      this.isMessageShow = false;
      this.buttonList.forEach((button: Field) => {
        button.isDisable = false;
        button.player = '';
      });
    }
  }

  private isPlayerWon(): boolean {
    let isPlayerWon = false;
    this.WINNING_COMBINATIONS.forEach((win) => {
      const checkPlayerWon = this.buttonList[win[0]].player !== '' &&
        this.buttonList[win[0]].player === this.buttonList[win[1]].player &&
        this.buttonList[win[0]].player === this.buttonList[win[2]].player;
      if (checkPlayerWon) {
        isPlayerWon = true;
      }
    });
    return isPlayerWon;
  }
}
