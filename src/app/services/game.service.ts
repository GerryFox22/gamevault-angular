import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GameDetail, GamesResponse } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly apiUrl = environment.rawgApiUrl;
  private readonly apiKey = environment.rawgApiKey;

  constructor(private http: HttpClient) {}

  getPopularGames(): Observable<GamesResponse> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('ordering', '-rating')
      .set('page_size', 12);

    return this.http.get<GamesResponse>(`${this.apiUrl}/games`, { params });
  }

  searchGames(search: string): Observable<GamesResponse> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('search', search)
      .set('page_size', 12);

    return this.http.get<GamesResponse>(`${this.apiUrl}/games`, { params });
  }

  getGameById(id: number): Observable<GameDetail> {
    const params = new HttpParams().set('key', this.apiKey);

    return this.http.get<GameDetail>(`${this.apiUrl}/games/${id}`, { params });
  }
}
