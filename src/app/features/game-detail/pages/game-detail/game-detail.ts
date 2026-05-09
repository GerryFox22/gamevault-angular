import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { GameDetail as GameDetailModel } from '../../../../models/game.model';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css'
})
export class GameDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly gameService = inject(GameService);
  private readonly cdr = inject(ChangeDetectorRef);

  game: GameDetailModel | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid game id.';
      return;
    }

    this.loadGame(id);
  }

  private loadGame(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.gameService.getGameById(id).subscribe({
      next: (response) => {
        this.game = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Error while loading game detail.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
