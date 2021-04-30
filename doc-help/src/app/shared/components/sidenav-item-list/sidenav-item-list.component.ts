import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-item-list',
  templateUrl: './sidenav-item-list.component.html',
  styleUrls: ['./sidenav-item-list.component.scss']
})
export class SidenavItemListComponent implements OnInit {

  @Input() useLabels:boolean;
  @Input() openAction:boolean;
  @Output() toggleEvent = new EventEmitter();

  constructor() { }

  itemList = [];
  toggleButton = {};
  ngOnInit(): void {
    this.itemList = [
      { icon: 'event_note', label: 'Calendar' , navigateTo: '/events'},
      { icon: 'account_circle', label: 'Account', navigateTo: '/account-settings' },
      { icon: 'people', label: 'Patients', navigateTo: '/patients'}  
    ]
    this.toggleButton = { icon: this.openAction ? 'navigate_next' : 'navigate_before', label:  this.openAction ? 'Extend' : 'Collapse' };
  }

  onToggleClick(): void {
    this.toggleEvent.emit();
  }

}
