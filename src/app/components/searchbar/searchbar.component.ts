import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-searchbar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.sass']
})

export class SearchbarComponent implements OnInit {
    themeSetting: string
    newTab: boolean
    
    constructor(private settingsService: SettingsService) { }

    ngOnInit() {
        this.settingsService.getSettings().subscribe(obj => {
            this.themeSetting = obj.themeSetting
            this.newTab = obj.newTab
        })
        this.test()
    }

    test() {
        console.log(this.newTab)
        setTimeout(this.test, 1000)
    }
}
