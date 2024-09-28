import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './employeelist.component.html',
  styleUrl: './employeelist.component.css'
})
export class EmployeelistComponent implements OnInit,OnChanges {
  @Input() triggerApiCall: boolean = false;
  employeeDetail: any

  constructor(private EmployeeService: EmployeeService, private http: HttpClient) { }

  ngOnInit(): void {
    this.EmployeeService.getData().subscribe((resp: any) => {
      console.log(resp);
      this.employeeDetail = resp;
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerApiCall'] && changes['triggerApiCall'].currentValue) {
      this.callApi();
    }
  }

  senduserId(id: string) {
    this.EmployeeService.setId(id)
  }
  // senduserId(id: string) {
  //   this.EmployeeService.setId(id)
  // }
  
  callApi(){
    this.EmployeeService.getData().subscribe((resp: any) => {
      console.log(resp);
      this.employeeDetail = resp;
    });
  }

  deleteEmployee(id: string): void {
    this.EmployeeService.deleteEmployee(id).subscribe(res=>{
      console.log('done')
    },error=>{
      console.log(error)
    });
    this.employeeDetail = this.employeeDetail.filter((employee: any) => employee.id !== id); // Update the UI
  }

  getonevent(){
    this.EmployeeService.getData().subscribe(res=>{
      this.employeeDetail = res;
    })
  }

}
