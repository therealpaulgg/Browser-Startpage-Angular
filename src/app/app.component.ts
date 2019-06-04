import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Startpage';
  themeSetting: string

  constructor (private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
        console.log(obj.themeSetting)
        this.themeSetting = obj.themeSetting
    })
  }

}
