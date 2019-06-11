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
import { MapComponent } from './components/map/map.component'

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
    StorageServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
