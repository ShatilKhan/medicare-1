import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../medicine.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.css']
})
export class ImprintComponent implements OnInit {
     breakpoint: number | undefined;
     height!: string | number;
  constructor(private medicineService: MedicineService) { 
   
  }

  ngOnInit(): void {
    this.medicineService.syncCalendar();
    this.breakpoint = (window.innerWidth <= 1090) ? 1 : 2;    
    this.height = (window.innerWidth <= 1090) ? "400px" : "500px";
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 1090) ? 1 : 2;
    this.height = (event.target.innerWidth <= 1090) ? "400px" : "500px";
  }
}
