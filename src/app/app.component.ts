import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavService } from './nav.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    @ViewChild('sidebar') sidebar: ElementRef;
    sidebarVisible = false;
    navItems: MenuItem[] = [
        {label: 'Home', routerLink: '/'},
        //{label: '15: Beverage Bandits', routerLink: '2018/15/a', queryParams: { files: ['a', 'sample', 'sample1', 'sample2', 'sample3', 'sample4', 'sample5', 'sample6', 'input']}},
        {label: '0001: 3 or 5', routerLink: '0001/a'},
    ];

    constructor(private navService: NavService) { }

    ngAfterViewInit(): void {
        this.navService.appComponent = this;
        this.assignCommand(this.navItems);
    }

    assignCommand(items: MenuItem[]) {
        items.forEach(mi => {
            if (mi.items) this.assignCommand(mi.items);
            if (mi.routerLink) mi.command = _ => this.sidebarVisible = false;
        })
    }
}
