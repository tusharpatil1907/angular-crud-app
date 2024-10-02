
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employeeform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule,RouterModule],
  templateUrl: './employeeform.component.html',
  styleUrl: './employeeform.component.css'
})
export class EmployeeformComponent implements OnInit {
reset() {
this.router.navigate([''])
  this.employeeForm.reset()
}
  employeeForm!: FormGroup
  userid!: string
  usertoedit!: void
  user!: User;
  randomId:number|string = this.generateId() 
  // randomId:number|string = this.generateId() 
  constructor(private http: HttpClient, private fb: FormBuilder, private emp: EmployeeService, private router : Router, private route: ActivatedRoute) {

    
  }

  generateForm() {
    
    this.employeeForm = this.fb.group({
      // id: [this.randomId, Validators.required],
      id: [this.randomId, Validators.required],
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
    // this.emp.registerCallback(() => {
    //   const data = this.emp.getId();
    //   this.userid = data;
    //   this.getuser(this.userid);
    //   // this.getQuery()
      
    // });
    this.getQuery()

    this.employeeForm.get('email')?.valueChanges.subscribe(email => {
      this.substring = this.substr(email);

       this.employeeForm.patchValue({
            id: this.randomId + this.substring
        }, { emitEvent: false });
    });

  
  }

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
  
  get email() : FormControl {
    return this.employeeForm.get('email') as FormControl;
  }
  get id() : FormControl {
    // debugger
    return this.employeeForm.get('id') as FormControl;
  }
  
  
  @Output() sendToParent = new EventEmitter();
  
  submit() {

    this.markAllAsTouched(this.employeeForm);
    if (this.employeeForm.valid) {
      // this.employeeForm.patchValue({id: this.randomId+ this.substring.substring(0,3)})
      // this.employeeForm.patchValue({id: this.id.value})
      
      // const employee = this.employeeForm
      // console.log('ID before submit:', this.employeeForm.get('id')?.value); 
      if (this.user == undefined) {
        debugger
        this.http.post(this.emp.api,{id: this.employeeForm.get('id')?.value, ...this.employeeForm.value}).subscribe(res=>res , err=>{
          console.log(err)
        })
        // this.emp.setData(this.employeeForm)
        debugger;
      }
      else {
        this.updateUser(this.userid);
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

  getQuery(){
    // debugger;
    this.route.queryParamMap.subscribe((output):void =>{
      
        let id:string|null =output.get('id')
        if(id){
          this.userid = id
          this.getuser(id)
        }
      //   let name:string|null =output.get('name')
      //   let email:string|null= output.get('email')
      //   let city:string|null= output.get('city') 
      //   let state:string|null = output.get('state') 
      //   let zip:string|null= output.get('zip')
      //   //  querydata ={
      //   //    id: output.get('id'), 
      //   //    name: output.get('name'), 
      //   //    email: output.get('email'), 
      //   //    city: output.get('city'), 
      //   //    state: output.get('state'), 
      //   //    zip: output.get('zip'), 
      //   //   } 
          // this.userid = querydata;
      //   }       
        // this.employeeForm.patchValue({ id: output.get('id'), 
        //      name: output.get('name'), 
        //      email: output.get('email'), 
        //      city: output.get('city'), 
        //      state: output.get('state'), 
        //      zip: output.get('zip'), });
        this.disableForm()
     
    //  console.log('data from query',querydata)
  });
  }


  getuser(id: string) {
       
    this.emp.getUser(id).subscribe(
      res => {
        this.user = res;
        console.log(res)
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
  

  generateNumber(email:string):string {
    // debugger
    // const data ="tp@gmail.com" 
  //   let inputdata = data.split('@')[0]
  //   const letters = inputdata
    const username = email.split('@')[0];
    console.log(username)
    
    const minletters = Math.min(3, username.length);
    // 2
    // const selectedLetters:string[] = [];
    
   
    const numDigits = 6 - minletters;

    const digits:string[] = [];
    for (let i = 0; i < numDigits; i++) {
        const randomDigit:string = String(Math.floor(Math.random() * 10)); 
        digits.push(randomDigit);
    }

    // const res = selectedLetters.concat(digits);
    let res = digits.join("")+ username
    
    console.log(res)
    return res;
    // debugger
  }
  

  
  
}

export interface User {
  id: string ,
  name: string,
  email: string,
  city?: string,
  state: string,
  zip: string,
}