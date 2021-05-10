import { Calendar } from '@fullcalendar/core';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  constructor() {
    const name = Calendar.name;
   }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [ timeGridPlugin, interactionPlugin ],
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
      { title: 'event 1', date: '2021-05-01' },
      { title: 'event 2', date: '2021-05-02' }
    ],
    height: 600,
    editable: true,

  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }


}
