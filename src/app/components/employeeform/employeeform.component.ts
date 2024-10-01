
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-employeeform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './employeeform.component.html',
  styleUrl: './employeeform.component.css'
})
export class EmployeeformComponent implements OnInit {
  employeeForm!: FormGroup
  userid!: string
  usertoedit!: void
  user!: User;
  randomId:number|string = this.generateId()
  constructor(private http: HttpClient, private fb: FormBuilder, private emp: EmployeeService) {

    
  }

  generateForm() {
    
    this.employeeForm = this.fb.group({
      id: [this.randomId+this.substring, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]], // Indian PIN code validation
    });
    
  }
  substring!:string
  ngOnInit(): void {
    this.generateForm()   
    // this.disableForm()
    this.emp.registerCallback(() => {
      const data = this.emp.getId();
      this.userid = data;
      this.getuser(this.userid);
      
    });

    this.employeeForm.get('email')?.valueChanges.subscribe(email => {
      this.substring = this.substr(email);

       this.employeeForm.patchValue({
            id: this.randomId + this.substring.substring(0, 3)
        }, { emitEvent: false });
    });
    
    
  }
  useremail = ""

  generateId():string|number {

    let id: number| string;
    id = Math.floor(Math.random() * 1000).toString()

    return id
  }

  substr(email:string){
    if(email){
      console.log('called')
      return email.substring(0,3)
    }else {
      return '';
    }
  }
  
  
  
  
  @Output() sendToParent = new EventEmitter();
  
  submit() {

    this.markAllAsTouched(this.employeeForm);
    if (this.employeeForm.valid) {

      this.employeeForm.patchValue({id: this.randomId+ this.substring.substring(0,3)})

      // const employee = this.employeeForm
      console.log(this.employeeForm.value)
      if (!this.user) {

        this.emp.setData(this.employeeForm) 
      }
      else {
        this.updateUser(this.user.id);
      }
      this.sendToParent.emit();      
      this.employeeForm.reset();
      // this.generateForm()
      this.randomId = this.generateId()
    }

  }



  disableForm() {
    this.employeeForm.get('id')?.disable(); 
  }


  getuser(id: string) {
    this.emp.getUser(id).subscribe(
      res => {
        this.user = res;
       
        this.employeeForm.patchValue(this.user);
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
      this.employeeForm.reset(); 
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


states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Jammu and Kashmir',
    'Ladakh'
  ];
  
 
}

export interface User {
  id: string,
  name: string,
  email: string,
  city?: string,
  state: string,
  zip: string,
}