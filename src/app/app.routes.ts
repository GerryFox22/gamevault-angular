import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { GameDetail } from './features/game-detail/pages/game-detail/game-detail';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'games/:id',
    component: GameDetail
  }
];
