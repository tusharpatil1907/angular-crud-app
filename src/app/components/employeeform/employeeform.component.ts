
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-employeeform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employeeform.component.html',
  styleUrl: './employeeform.component.css'
})
export class EmployeeformComponent implements OnInit {
  employeeForm!: FormGroup
  userid!: string
  usertoedit!: void
  user!: User;
  randomId = this.generateId()

  constructor(private http: HttpClient, private fb: FormBuilder, private emp: EmployeeService) {

    this.generateForm()
  }

  generateForm() {
    this.employeeForm = this.fb.group({
      id: [{ value: this.randomId, disabled: true }, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]], // Indian PIN code validation
    });

  }
  ngOnInit(): void {


    this.disableForm()
    this.emp.registerCallback(() => {
      const data = this.emp.getId();
      this.userid = data;
      this.getuser(this.userid);

    });

  }


  @Output() sendToParent = new EventEmitter();

  // onClick() {
  //   this.sendToParent.emit();
  //   console.log('emitted')
  // }
  submit() {
    // const id = this.generateId();
    this.markAllAsTouched(this.employeeForm);
    if (this.employeeForm.valid) {
      const employee = this.employeeForm
      console.log(this.employeeForm.value)
      if (!this.user) {
        this.emp.setData(employee) //add new data 
      }
      else {
        this.updateUser(this.user.id);
      }
      this.sendToParent.emit();
      // this.onClick()       
      this.employeeForm.reset();
      this.generateForm()
    }
  }



  disableForm() {
    this.employeeForm.get('id')?.disable(); // Disable the 'id' field
  }


  getuser(id: string) {
    this.emp.getUser(id).subscribe(
      res => {
        this.user = res;
        //patchvalue automatically push thevalue of object into form 
        this.employeeForm.patchValue(this.user); // This will set all fields correctly
        this.disableForm()
      },
      error => {
        console.error('Error fetching employee data', error);
      }

    );
  }


  updateUser(id: string) {
    const api: string = `http://localhost:3000/Employees/${id}`;
    const updatedUser = {
      name: this.employeeForm.value.name,
      email: this.employeeForm.value.email,
      city: this.employeeForm.value.city,
      state: this.employeeForm.value.state,
      zip: this.employeeForm.value.zip,
    };

    this.http.put<User>(api, updatedUser).subscribe(
      res => {
        console.log("updated", res);

      },
      error => {
        console.error('Error updating employee data', error);
      }
    );
    this.emp.getData().subscribe(resp => {
      console.log('Updated list after updating:', resp);
      this.employeeForm.reset(); // Reset the form after successful submission
    }, error => {
      console.error('Error fetching updated list:', error);
    });

  }
  private markAllAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control: any = formGroup.get(controlName);
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
      control.markAsTouched();
    });
  }
  generateId() {
    let id: number;
    id = Math.floor(Math.random() * 1000)
    id.toString()
    return id
  }
}

export interface User {
  id: string,
  name: string,
  email: string,
  city?: string,
  state: string,
  zip: string,
}