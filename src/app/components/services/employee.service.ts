import { Injectable } from '@angular/core';
import { User } from '../employeeform/employeeform.component';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  api: string = "http://localhost:3000/Employees"
  empdata:any;
  formval!: object
  constructor(private http: HttpClient ) {
    
  }

  getDetail() {

    this.http.get(this.api).subscribe(
      res => {
        this.empdata = res;
        console.log("called")
      },  
      error => {
        console.error('Error fetching employee data', error);
      }
    );

}

  user!:object
  getuser(id:number) {

    this.http.get(`${this.api}/${id}`).subscribe(
      res => {
        debugger
        this.user = res;
        console.log("called")
      },  
      error => {
        console.error('Error fetching employee data', error);
      }
    );

}

  setData(form: FormGroup) {
    const employeeForm = form.value;
    this.http.post(this.api, employeeForm).subscribe(res => {
      console.log(res)


    })
  }

  deleteEmployee(id: number): void {
    this.http.delete(`${this.api}/${id}`).subscribe(
      () => {
        console.log(`Employee with ID ${id} deleted`);
       
      },
      error => {
        console.error('Error deleting employee', error); 
      }
    );

  }


  // update(id: number):void{
  //    id = this.put.get("id")?.value;
  //       //this method will check for record present in the api and if it is not present then it will add new one
  //       if(id){
  //         this.http.put(`http://localhost:3000/posts/${id}`,this..value).subscribe(res=>{
  //           console.log('updated',res)
  //           this.put.reset()
  //         },err=>err.message)
  //       }else{console.log('provide id')}
  // }


  //update try

  // updateEmployee(id: string, form: any) {
  //   this.http.put(`${this.api}/${id}`, form).subscribe(res => {
  //     console.log('Employee updated:', res);
  //   });
  // }

  // getEmployeeById(id: string, callback: (employee: User) => void) {
  //   this.http.get<User>(`${this.api}/${id}`).subscribe(
  //     res => callback(res),
  //     error => console.error('Error fetching employee data', error)
  //   );
  // }

  

  



}
