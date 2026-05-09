import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Game } from '../../../../models/game.model';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly cdr = inject(ChangeDetectorRef);

  games: Game[] = [];
  searchTerm = '';
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
      },
    });
  }

  searchGames(): void {
    const search = this.searchTerm.trim();

    if (!search) {
      this.loadGames();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.gameService.searchGames(search).subscribe({
      next: (response) => {
        this.games = response.results;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Errore durante la ricerca dei giochi.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
  onSearchChange(): void {
    const search = this.searchTerm.trim();

    this.games = [];
    this.errorMessage = '';

    if (!search) {
      this.loadGames();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    this.gameService.searchGames(search).subscribe({
      next: (response) => {
        this.games = response.results;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Errore durante la ricerca dei giochi.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
