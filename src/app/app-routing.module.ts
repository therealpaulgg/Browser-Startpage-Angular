import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinksComponent } from './components/links/links.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: "links", component: LinksComponent},
  { path: "map", component: MapComponent},
  { path: "**", redirectTo: "links"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "enabled"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
