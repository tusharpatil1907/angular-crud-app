import { Injectable } from '@angular/core';
import { User } from '../employeeform/employeeform.component';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  api: string = "http://localhost:3000/Employees/"
  empdata!:FormGroup;
  formval!: object
  constructor(private http: HttpClient ) {}

  getData(){
    return this.http.get(this.api);
  }
  getUser(id:string){
    console.log(this.api)
    return this.http.get<User>(this.api+id)
  }

  id!: string;
  private callback: () => void = () => {}; 
  getId(){
    return this.id;
  }
  
  setId(id:string){
    this.id = id;
    console.log(this.id)
    this.callback(); 
  }

  // registerCallback(callback: () => void) {
  //   this.callback = callback; 

  // }

  setData(form: FormGroup) {
    const employeeForm = form.value;
    if(employeeForm){
      return this.http.post(this.api, employeeForm)
    }
    else{
      return
    }
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this.api}${id}`)

  } 

  
  
}
