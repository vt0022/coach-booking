import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';

const routes: Routes = [
  { path: '**', redirectTo: 'booking', pathMatch: 'full' },
  {
    path: 'booking',
    component: BookingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
