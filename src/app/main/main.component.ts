import { Component } from '@angular/core';
import { EmployeeformComponent } from '../components/employeeform/employeeform.component';
import { EmployeelistComponent } from '../components/employeelist/employeelist.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [EmployeeformComponent, EmployeelistComponent,RouterOutlet, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  title = 'employee-app';
id!:string|number
  triggerApiCall: boolean = false;  

  handleChild1Event() {
    console.log('Event received from Child 1');
    this.triggerApiCall = true;  
    // this.onDataFetched()
  }

  onDataFetched() {
    setTimeout(() => {
      
      this.triggerApiCall = false;
    }, 10);
   }
  
  

  callId(id:string|number){
    this.id = id
  }
}
