import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private queryParamsSubscription?: Subscription;

  games = signal<Game[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  searchTerm = '';

  currentPage = signal(1);
  pageSize = signal(12);
  totalCount = signal(0);

  ngOnInit(): void {
    this.setupSearch();
    this.readQueryParams();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }

  onSearchChange(): void {
    this.currentPage.set(1);
    this.searchSubject.next(this.searchTerm);
  }

  onPageSizeChange(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  goToNextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
    this.updateQueryParams();
  }

  goToPreviousPage(): void {
    if (this.currentPage() === 1) {
      return;
    }

    this.currentPage.update((page) => page - 1);
    this.updateQueryParams();
  }

  hasNextPage(): boolean {
    return this.currentPage() * this.pageSize() < this.totalCount();
  }

  private setupSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.updateQueryParams();
      });
  }

  private readQueryParams(): void {
    this.queryParamsSubscription = this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const pageSize = Number(params.get('pageSize')) || 12;
      const search = params.get('search') || '';

      this.currentPage.set(page);
      this.pageSize.set(pageSize);
      this.searchTerm = search;

      this.loadGames();
    });
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage(),
        pageSize: this.pageSize(),
        search: this.searchTerm.trim() || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private loadGames(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.games.set([]);

    const search = this.searchTerm.trim();

    const request$ = search
      ? this.gameService.searchGames(search, this.currentPage(), this.pageSize())
      : this.gameService.getPopularGames(this.currentPage(), this.pageSize());

    request$.subscribe({
      next: (response) => {
        this.games.set(response.results);
        this.totalCount.set(response.count);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Errore durante il caricamento dei giochi.');
        this.isLoading.set(false);
      },
    });
  }
}
