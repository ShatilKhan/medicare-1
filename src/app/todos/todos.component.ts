import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Medicine } from "../medicine";
import { TodoService } from "../todo.service";
import {
  FormGroup,
  FormControl,
} from "@angular/forms";
import * as moment from "moment";
import { Twilio } from 'twilio';

@Component({
  selector: "app-todos",
  templateUrl: "./todos.component.html",
  styleUrls: ["./todos.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TodosComponent implements OnInit {
  hidden = true;
  breakpoint: number | undefined;
  height!: string | number;
  todos: Medicine[] = [];
  selected = "1";
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  phoneNumber!: string;

  // Twilio configuration
  private accountSid = 'AC883d01cff9800d599a402911cd9028ca';
  private authToken = '2677559789eff72507d798f72b2dd9e8';
  private twilioPhoneNumber = '+13613092096';

  // Create a Twilio client
  private client: Twilio;

  constructor(private todoService: TodoService) {
    this.client = new Twilio(this.accountSid, this.authToken);
  }

  ngOnInit(): void {
    this.loadTodos();
    var clicked = false;
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2;
    this.height = window.innerWidth <= 600 ? "200px" : "500px";
    this.scheduleNotifications();
  }

  scheduleNotifications() {
    setInterval(() => {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

      if (currentTime === '09:00:00') {
        this.sendNotification('Good morning!');
      } else if (currentTime === '13:00:00') {
        this.sendNotification('Time for your midday medication!');
      } else if (currentTime === '17:00:00') {
        this.sendNotification('Evening medication reminder!');
      } else if (currentTime === '21:00:00') {
        this.sendNotification('Take your night medication!');
      }
    }, 1000);
  }

  sendNotification(message: string) {
    if (this.phoneNumber) {
      this.client.messages
        .create({
          body: message,
          from: this.twilioPhoneNumber,
          to: this.phoneNumber
        })
        .then((message: any) => console.log('SMS notification sent:', message.sid))
        .catch((error: any) => console.error('Failed to send SMS notification:', error));
    }
  }



  //Datepicker----------------------------------------------------------------------------------------------------------------------------------------

  //erzeugt mehrere Events, da ein Mediakament mehrere Tage eingenommen werden muss -------------------------------------------------------
  async splitTimeslot(
    medicine: string,
    description: string,
    consumption_monday: boolean,
    consumption_tuesday: boolean,
    consumption_wednesday: boolean,
    consumption_thursday: boolean,
    consumption_friday: boolean,
    consumption_satturday: boolean,
    consumption_sunday: boolean,
    consumption_morning: boolean,
    consumption_midday: boolean,
    consumption_evening: boolean
  ) {
    //overlay wird ausgeblendet -------------------------------------------------------------------------------------------------------------------
    this.deleteVisibilty();

    const startDate = this.range.get("start")?.value;
    var endDate = this.range.get("end")?.value;

    for (
      var day = new Date(startDate);
      day <= endDate;
      day.setDate(day.getDate() + 1)
    ) {
      var consumption = day;
      if (consumption_monday === true && day.getDay() === 1) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_tuesday === true && day.getDay() === 2) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_wednesday === true && day.getDay() === 3) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_thursday === true && day.getDay() === 4) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_friday === true && day.getDay() === 5) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_satturday === true && day.getDay() === 6) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_sunday === true && day.getDay() === 0) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
    }
    //weitere Todos werden geladen -------------------------------------------------------------------------------------------------------------------
    await this.loadTodos();
    this.remove();
  }

  //Hinzufügen von Einträgen ---------------------------------------------------------------------------------------------------------------------
  async add(
    medicine: string,
    description: string,
    consumption_monday: boolean,
    consumption_tuesday: boolean,
    consumption_wednesday: boolean,
    consumption_thursday: boolean,
    consumption_friday: boolean,
    consumption_satturday: boolean,
    consumption_sunday: boolean,
    consumption: Date,
    consumption_morning: boolean,
    consumption_midday: boolean,
    consumption_evening: boolean
  ) {
    var id = await this.todoService.add(
      medicine,
      description,
      consumption,
      consumption_monday,
      consumption_tuesday,
      consumption_wednesday,
      consumption_thursday,
      consumption_friday,
      consumption_satturday,
      consumption_sunday,
      consumption_morning,
      consumption_midday,
      consumption_evening
    );
    await this.loadTodos();
    //Behebt Bug, dass Elemente mehrfache in den Kalender geladen werden -----------------------------------------------------------------------------
   window.location.reload();
  }

  async sync() {
    await this.todoService.sync();
    await this.loadTodos();
  }

  async delete(todo: Medicine) {
    await this.todoService.deleteToDo(todo);
    await this.loadTodos();
  }
  async loadTheOne(todo: Medicine) {
    await this.todoService.getToDo(todo);
  }

  async loadTodos() {
    this.todos = await this.todoService.getAll();
    this.sortByDueDate();
    // Elemente werden in den Kalender geladen
    this.todoService.syncCalendar();
    //Check ob, ein Platzhaltertext angezeigt wird, weil keine Medikamente eingetragen sind
    this.togglePlaceholder();
  }

  async sortByDueDate() {
    this.todos.sort((a: Medicine, b: Medicine) => {
      return a.consumption!.getTime() - b.consumption!.getTime();
    });
  }

  async addVisibilty(): Promise<void> {
    document.getElementById("add")!.style.display = "block";
  }

  async deleteVisibilty(): Promise<void> {
    document.getElementById("add")!.style.display = "none";
  }

  remove(): void {
    document.getElementsByClassName("visible")[0].classList.remove("visible");
    document.getElementById("AddButton")?.classList.remove("notVisible");
    document.getElementById("AddButton")?.classList.add("visible");
    document.getElementById("add")?.classList.add("notVisible");
  }
  checkOverdue(todo: Medicine) {
    var today = new Date();

    if (todo.consumption < today) {
      var element = document.getElementById(todo.id);
      element?.classList.add("overdue");

      this.showBadge();
    }
  }

  showBadge() {
    this.hidden = false;
  }
  resetBadge() {
    this.hidden = true;
  }

  async togglePlaceholder() {
    var todos = this.todoService.getAll();
    if ((await todos).length === 0) {
      document.getElementById("placeholder")!.style.display = "block";
      if (window.innerWidth > 500) {
        document.getElementById("placeholderBottom")!.style.display = "block";
      }
    } else {
      document.getElementById("placeholder")!.style.display = "none";
      document.getElementById("placeholderBottom")!.style.display = "none";
    }
  }

  onResize(event: any) {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
    this.height = event.target.innerWidth <= 600 ? "200px" : "500px";
    if (window.innerWidth <= 500) {
      document.getElementById("placeholderBottom")!.style.display = "none";
    } else {
      document.getElementById("placeholderBottom")!.style.display = "block";
    }
  }
  formatDate(date: Date) {
    var DateFormated = moment(date).format("DD-MM-YYYY");
    return DateFormated;
  }
}
