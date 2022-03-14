import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dexie } from 'dexie';
import { v4 } from 'uuid';
import { Todo } from './todo';
import {EventInput, CalendarOptions } from '@fullcalendar/angular';
import * as moment from 'moment';



export const INITIAL_EVENTS: EventInput[] = [];


@Injectable({
  providedIn: 'root'
})
export class TodoService extends Dexie {
  todos!: Dexie.Table<Todo, string>;


  constructor(private httpClient: HttpClient) {
    super('TodoDB');

    this.version(1).stores({
      todos: 'id'
    });
  }

  getAll() {
    return this.todos.toArray();
  }

  getAllCalendar() {
   
    return this.todos;
  }

  getToDo(todo :Todo) {
    console.log(this.todos.get(todo.id));
    return this.todos.get(todo.id);
  }

 

  add(
    medicine: string,
    description: string, 
    consumption: Date,
    consumption_monday: boolean,
    consumption_tuesday: boolean,
    consumption_wednesday: boolean,
    consumption_thirsday: boolean,
    consumption_friday: boolean,
    consumption_satturday: boolean,
    consumption_sunday: boolean ,
    consumption_morning : boolean,
    consumption_midday : boolean,
    consumption_evening : boolean

    
    ) {
    return this.todos.add({ 
      medicine: medicine, 
      id: v4(), 
      done: false, 
      description: description,
      consumption: consumption,
      consumption_monday: consumption_monday,
      consumption_tuesday: consumption_tuesday,  
      consumption_wednesday: consumption_wednesday,
      consumption_thirsday: consumption_thirsday,
      consumption_friday: consumption_friday,
      consumption_satturday: consumption_satturday,
      consumption_sunday: consumption_sunday,

      consumption_morning: consumption_morning,
      consumption_midday: consumption_midday,
      consumption_evening:consumption_evening});
  }



  async sync() {
    const allTodos = await this.getAll();
    const syncedTodos = await this.httpClient.post<Todo[]>('http://localhost:3030/sync', allTodos).toPromise();
    this.todos.bulkPut(syncedTodos!);
  }
  deleteToDo(todo :Todo) {
    this.todos.put(todo);
    return this.todos.delete(todo.id); 
    
  }

  async syncCalendar()  {
    let todos =  this.getAll();
  
    if(INITIAL_EVENTS.length != (await todos).length){
      for(let todo of await todos){
        var DateFormated = (moment(todo.consumption)).format('YYYY-MM-DD')
        INITIAL_EVENTS.push(
          
          { id: todo.id,
            title: todo.medicine,
            start: DateFormated,
            end: DateFormated},)
          };
        }
        else{
          return
        }
  
  
      }
  
//   deleteToDoNewContent(todo :Todo,  textDescription: String) {
//     this.addNewAfterContentChange(todo, textDescription);
//     return this.todos.delete(todo.id); 
    

// }
addNewAfterContentChange(todo :Todo,  description: String ) {
  //  return this.todos.put(todo.description);
}
async PutMethodDescription(todo: Todo, NewDescription:string, description:string){
  description = NewDescription;
  console.log(description + "neue beschreibuung");
   return this.todos.update( todo ,{ description } );
}
async PutMethodNewMedicineName(todo: Todo, NewMedicineName:string, medicine:string){
  medicine = NewMedicineName;
  console.log(medicine + "neue Medizinname");
   return this.todos.update( todo ,{ medicine } );
}
// .PutMethodCheckEvening(todo, check_consumption_evening, todo.consumption_evening);
async PutMethodCheckTime(todo: Todo, check_consumption_evening:boolean,check_consumption_midday:boolean, check_consumption_morning:boolean){
  todo.consumption_evening = check_consumption_evening;
  todo.consumption_midday = check_consumption_midday;
  todo.consumption_morning = check_consumption_morning;
  this.todos.put(todo);
}

//hier kann man über die namen der methoden nachdenken.. this is not the way
async PutMethodCheckDays(todo: Todo, check_consumption_monday:boolean,check_consumption_tuesday:boolean, check_consumption_wednesday:boolean, check_consumption_thirsday:boolean,check_consumption_friday:boolean, check_consumption_satturday:boolean, check_consumption_sunday:boolean){
  todo.consumption_monday = check_consumption_monday;
  todo.consumption_tuesday = check_consumption_tuesday;
  todo.consumption_wednesday = check_consumption_wednesday;
  todo.consumption_thirsday = check_consumption_tuesday;
  todo.consumption_friday = check_consumption_friday;
  todo.consumption_satturday = check_consumption_satturday;
  todo.consumption_thirsday = check_consumption_sunday;  
  
  this.todos.put(todo);
}

async PutMethodNewConsumptionDate(todo: Todo, new_consumption_day:Date, consumption:Date | null){
  consumption = new_consumption_day;
  console.log(consumption + "neuer Tag zum Einnehmen");
   return this.todos.update( todo ,{ consumption } );
}

// PutMethodNewConsumptionDate(todo, new_consumption_day, todo.consumption);
}
