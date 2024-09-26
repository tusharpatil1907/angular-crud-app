
import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms'
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-employeeform',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './employeeform.component.html',
  styleUrl: './employeeform.component.css'
})
export class EmployeeformComponent implements OnInit {
  employeeForm!: FormGroup
  
  constructor(private fb: FormBuilder, private emp: EmployeeService ){
    this.employeeForm = this.fb.group({
      id: [''],
      name: [''],
      email: [''],
      city: [''],
      state: [''],
      zip: [''],
    })
  }
  submit(){
    const employee = this.employeeForm
    console.log (this.employeeForm.value)
    this.emp.setData(employee)
    this.employeeForm.reset(); 
  }

  // @Input() employeeToEdit: any; // Receive the employee data for editing
  // if (this.employeeToEdit) {
  //   // this.employeeForm.patchValue(this.employeeToEdit); // Populate the form for editing
  // }
  ngOnInit(): void {
   
  }
  ngOnChanges(){
    // if (this.emp.user) {
    //   console.log(this.emp.user);
    // } else {
    //   console.log('User data is not available.');
    // } // Check if user data is available
  }


}




export interface User {
  id:string,
  name: string,
  Email: string,
  city: string,
  state: string,
  zip: string,
}