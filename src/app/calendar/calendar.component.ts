import { Component, OnInit } from '@angular/core';
import {CalendarOptions } from '@fullcalendar/angular';
import { TodoService, INITIAL_EVENTS } from '../todo.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
   
  constructor(private todoService: TodoService) {
  }
  
  ngOnInit(): void {
    this.todoService.syncCalendar();
    
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    initialEvents: INITIAL_EVENTS,   
  };
  
 
}



