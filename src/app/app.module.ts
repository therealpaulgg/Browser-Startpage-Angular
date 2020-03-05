import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'
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
import { RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

// Credit to this post for this solution
// https://www.softwarearchitekt.at/post/2016/12/02/sticky-routes-in-angular-2-3-with-routereusestrategy.aspx

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {

  handlers: {[key: string]: DetachedRouteHandle} = {}

  shouldDetach(route: import("@angular/router").ActivatedRouteSnapshot): boolean {
    return true
  }
  store(route: import("@angular/router").ActivatedRouteSnapshot, handle: import("@angular/router").DetachedRouteHandle): void {
    this.handlers[route.routeConfig.path] = handle
  }
  shouldAttach(route: import("@angular/router").ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path]
  }
  retrieve(route: import("@angular/router").ActivatedRouteSnapshot): import("@angular/router").DetachedRouteHandle {
    if (!route.routeConfig) return null
    return this.handlers[route.routeConfig.path]
  }
  shouldReuseRoute(future: import("@angular/router").ActivatedRouteSnapshot, curr: import("@angular/router").ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig
  }
}

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
    HttpClientJsonpModule
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

