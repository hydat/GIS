import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapComponent} from '../app/map/map.component'
import {GisMapComponent} from '../app/gis-map/gis-map.component'


const routes: Routes = [
  {
    path: 'map', 
    component: MapComponent
   },
   { 
     path: '', 
     redirectTo: 'map', 
     pathMatch: 'full'
   },
   { 
    path: 'map2', 
    component: GisMapComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
