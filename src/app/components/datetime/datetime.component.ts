import { Component, OnInit, OnDestroy } from '@angular/core';
import {DatetimeService} from "../../services/datetime.service"
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-datetime',
    templateUrl: './datetime.component.html',
    styleUrls: ['./datetime.component.sass']
})
export class DatetimeComponent implements OnInit, OnDestroy {
    subscription: Subscription
    dateTime: string

    constructor(private datetimeService: DatetimeService) { }

    ngOnInit() {
        // Subscribes to the subject object which continuously receives new 
        // strings from the service.
        this.datetimeService.getTime().subscribe(obj => this.dateTime = obj.time)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
