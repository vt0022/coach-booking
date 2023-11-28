import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExportLineComponent } from './export-line/export-line.component';

const routes: Routes = [
  {
    path: '',
    component: ExportLineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportlineRoutingModule {}
