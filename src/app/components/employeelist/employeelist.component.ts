import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { User } from '../employeeform/employeeform.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './employeelist.component.html',
  styleUrl: './employeelist.component.css'
})
export class EmployeelistComponent implements OnInit {

  employeeDetail: any
  @Output() employeeSelected = new EventEmitter<any>();
  constructor(private emp: EmployeeService, private http: HttpClient) { }

ngOnInit(): void {
      
    this.getDetail()

}

senduserId(id:number){
  this.emp.getuser(id)

}

getDetail(){
  this.emp.getDetail()
  this.employeeDetail = this.emp.empdata;
}
  // getDetail() {

  //     this.http.get(this.emp.api).subscribe(
  //       res => {
  //         this.employeeDetail = res;
          
  //       },  
  //       error => {
  //         console.error('Error fetching employee data', error);
  //       }
  //     );
    
  
  // }

  deleteEmployee(id: number): void {
    this.emp.deleteEmployee(id);
    this.employeeDetail = this.employeeDetail.filter((employee: any) => employee.id !== id); // Update the UI
  }




  editEmployee(employee: any): void {
    this.employeeSelected.emit(employee); // Emit selected employee to parent
  }
}
