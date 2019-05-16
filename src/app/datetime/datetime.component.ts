import { Component, OnInit } from '@angular/core';
import {DatetimeService} from "../datetime.service"

@Component({
    selector: 'app-datetime',
    templateUrl: './datetime.component.html',
    styleUrls: ['./datetime.component.sass']
})
export class DatetimeComponent implements OnInit {

    dateTime: string

    constructor(private datetimeService: DatetimeService) { }

    ngOnInit() {
        // Subscribes to the subject object which continuously receives new 
        // strings from the service.
        this.datetimeService.getTime().subscribe(obj => this.dateTime = obj.time)
    }
}
