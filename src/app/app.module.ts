import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './components/weather/weather.component';
import { DatetimeComponent } from './components/datetime/datetime.component';
import { LinksComponent } from './components/links/links.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { FormsModule } from '@angular/forms';
import { StorageServiceModule } from 'angular-webstorage-service';
import { MapComponent } from './components/map/map.component';
import { MapModule, MapAPILoader, BingMapAPILoaderConfig, BingMapAPILoader, WindowRef, DocumentRef } from "angular-maps";

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    DatetimeComponent,
    LinksComponent,
    SearchbarComponent,
    SidebarComponent,
    MapComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StorageServiceModule,
    MapModule.forRootBing()
  ],
  providers: [
    {
      provide: MapAPILoader, deps: [], useFactory: BingMapServiceProviderFactory
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function BingMapServiceProviderFactory(){
  let bc: BingMapAPILoaderConfig = new BingMapAPILoaderConfig();
  bc.apiKey ="AmPeldhwmA9rt7hVuJZAb5eSnJmiU-YJxxw8QDoyhyVZBghurkl6NOHHcfrPT0y0";
    // replace with your bing map key
    // the usage of this key outside this plunker is illegal.
  bc.branch = "experimental";
    // to use the experimental bing brach. There are some bug fixes for
    // clustering in that branch you will need if you want to use
    // clustering.
  return new BingMapAPILoader(bc, new WindowRef(), new DocumentRef());
}
