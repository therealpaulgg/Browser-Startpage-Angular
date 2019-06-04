import { Component, OnInit } from '@angular/core';
import { Links } from "../../links"
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass']
})
export class LinksComponent implements OnInit {
  links = new Links()
  themeSetting: string
  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => this.themeSetting = obj.themeSetting)
  }

}
