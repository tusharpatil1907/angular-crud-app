import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../employeeform/employeeform.component';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'], // Fixed typo here
})
export class EmployeelistComponent implements OnInit, OnChanges {
  @Input() triggerApiCall: boolean = false;
  @Output() dataFetched = new EventEmitter<void>();
  employeeDetail: any[] = []; // Initialize as an empty array
  keySelection!: string;
  keys!: string[];
  valueSelection!: string[]
  specificValues?:string[]

  filteredData!: any
  constructor(private EmployeeService: EmployeeService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEmployeeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerApiCall'] && changes['triggerApiCall'].currentValue) {
      this.callApi();
    }
  }

  fetchEmployeeData() {
    this.EmployeeService.getData().subscribe(
      (resp: any) => {
        console.log(resp);
        this.employeeDetail = resp;
        this.getKeys(this.employeeDetail); // Pass the fetched employee data to getKeys
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  callApi() {
    this.fetchEmployeeData();
    this.resetTrigger();
  }

  resetTrigger() {
    this.dataFetched.emit();
    this.triggerApiCall = false;
  }

  senduserId(id: string) {
    this.EmployeeService.setId(id);
  }

  deleteEmployee(id: string): void {
    this.EmployeeService.deleteEmployee(id).subscribe(
      () => {
        console.log('Employee deleted');
        this.employeeDetail = this.employeeDetail.filter((employee: any) => employee.id !== id); // Update the UI
      },
      (error) => {
        console.error('Error deleting employee:', error);
      }
    );
  }

  getKeys(data: any[]) {
    if (data && data.length > 0) {
      this.keys = [...new Set(data.flatMap(Object.keys))];
      console.log(this.keys);
    } else {
      console.log('No data available to extract keys.');
    }
  }

  getFilteredData():string[]|undefined{
    if (!this.keySelection) {
      console.log('No key selected');
      return;
    }
    const values = this.employeeDetail.map(
        item => item[this.keySelection]
      ).filter(
        value => value !== undefined
      );


    console.log(this.keySelection, values);


    return values;
  }

  onSelectionChange(event:any ) {
    this.keySelection = event.target.value;
    console.log(`Selected key: ${this.keySelection}`);
    this.specificValues = this.getFilteredData();
    
  }
  onValueSelectonChange(event:any){
    this.valueSelection = event.target.value;
    console.log('selected val = ', this.valueSelection)
  }


  applyChange() {
    if (this.keySelection === undefined) {
        console.log('not selected');
    } else {
        this.EmployeeService.getData().subscribe((resp: any) => {
            let result: any;

            if (this.keySelection === 'id') {
                result = resp.filter((data: any) => {
                    return data.id === this.valueSelection; 
                });
                
              }
            if (this.keySelection === 'name') {
                result = resp.filter((data: any) => {
                    return data.name === this.valueSelection; 
                });
                
              }
            if (this.keySelection === 'email') {
                result = resp.filter((data: any) => {
                    return data.email === this.valueSelection; 
                });
                
              }
            if (this.keySelection === 'city') {
                result = resp.filter((data: any) => {
                    return data.city === this.valueSelection; 
                });
                
              }
            if (this.keySelection === 'zip') {
                result = resp.filter((data: any) => {
                    return data.zip === this.valueSelection; 
                });
                
              }
            if (this.keySelection === 'state') {
                result = resp.filter((data: any) => {
                    return data.state === this.valueSelection; 
                });
                
              }
              console.log(result); 
              this.filteredData = result
        });
        // console.log('filter applied-', this.keySelection, "  ", this.valueSelection);
    }
}

}
