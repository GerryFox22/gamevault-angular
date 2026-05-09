import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { Game } from '../../../../models/game.model';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly cdr = inject(ChangeDetectorRef);

  games: Game[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.gameService.getPopularGames().subscribe({
      next: (response) => {
        this.games = response.results;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Errore durante il caricamento dei giochi.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }
}