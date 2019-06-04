import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass']
})
export class LinksComponent implements OnInit {
  links: any
  themeSetting: string
  newTab: boolean
  constructor(private settingsService: SettingsService, private http: HttpClient) { }

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
        this.themeSetting = obj.themeSetting
        this.newTab = obj.newTab
    })
    this.http.get("assets/config/links.json").subscribe(obj => this.links = obj)
  }

}
