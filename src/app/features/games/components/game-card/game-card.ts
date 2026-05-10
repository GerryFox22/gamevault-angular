import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Game } from '../../../../models/game.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  @Input({ required: true }) game!: Game;

  @Output() gameSelected = new EventEmitter<number>();

  onSelectGame(): void {
    this.gameSelected.emit(this.game.id);
  }
}
