import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EmployeelistComponent } from './components/employeelist/employeelist.component';
import { EmployeeformComponent } from './components/employeeform/employeeform.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, EmployeelistComponent, EmployeeformComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employee-app';
id!:string|number
  triggerApiCall: boolean = false;  

  handleChild1Event() {
    console.log('Event received from Child 1');
    this.triggerApiCall = !this.triggerApiCall;  
  }

  

  callId(id:string|number){
    this.id = id
  }
}
