import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

import { Game } from '../../../../models/game.model';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private readonly gameService = inject(GameService);

  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  games = signal<Game[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  searchTerm = '';

  ngOnInit(): void {
    this.setupSearch();
    this.loadGames();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  loadGames(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.gameService.getPopularGames().subscribe({
      next: (response) => {
        this.games.set(response.results);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Errore durante il caricamento dei giochi.');
        this.isLoading.set(false);
      },
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  private setupSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.games.set([]);
          this.isLoading.set(true);
          this.errorMessage.set('');
        }),
        switchMap((searchTerm) => {
          const search = searchTerm.trim();

          if (!search) {
            return this.gameService.getPopularGames();
          }

          return this.gameService.searchGames(search);
        }),
      )
      .subscribe({
        next: (response) => {
          this.games.set(response.results);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage.set('Errore durante la ricerca dei giochi.');
          this.isLoading.set(false);
        },
      });
  }
}
