import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-searchbar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.sass']
})
export class SearchbarComponent implements OnInit {
    themeSetting: string

    constructor(private settingsService: SettingsService) { }

    ngOnInit() {
        this.settingsService.getSettings().subscribe(obj => this.themeSetting = obj.themeSetting)  
    }

}
