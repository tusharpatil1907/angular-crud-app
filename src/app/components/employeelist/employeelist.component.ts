import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../employeeform/employeeform.component';
import { SearchPipe } from '../../search.pipe';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [JsonPipe, FormsModule,SearchPipe, CommonModule],
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'], // Fixed typo here
})
export class EmployeelistComponent implements OnInit, OnChanges {
  @Input() triggerApiCall: boolean = false;
  @Output() dataFetched = new EventEmitter<void>();
  employeeDetail: any[] = []; // Initialize as an empty array
  keySelection!: string;
  keys!: string[];
  valueSelection!: string
  specificValues?: string[]

  filteredData!: any

  searchval!:any
inpval: any;
  
  // searchTerm: string = '';

  constructor(private EmployeeService: EmployeeService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchEmployeeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerApiCall'] && changes['triggerApiCall'].currentValue) {
      this.callApi();
    }
  }

  // fetchEmployeeData() {
  //   this.EmployeeService.getData().subscribe(
  //     (resp: any) => {
  //       console.log(resp);
  //       this.employeeDetail = resp;
  //       this.getKeys(this.employeeDetail);
  //     },
  //     (error) => {
  //       console.error('Error fetching employee data:', error);
  //     }
  //   );
  // }

  fetchEmployeeData() {
    this.EmployeeService.getData().subscribe(
      (resp: any) => {
        console.log(resp);
        this.employeeDetail = resp;
        this.filteredData = resp;
        this.getKeys(this.employeeDetail);
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
  uniqueKeys!: string[]
  getKeys(data: any[]) {
    if (data && data.length > 0) {
      this.keys = [...new Set(data.flatMap(Object.keys))];
      console.log(this.keys);
    } else {
      console.log('No data available to extract keys.');
    }
  }


  getFilteredData(): string[] | undefined {
    if (!this.keySelection) {
      console.log('No key selected');
      return;
    }

    const values = this.employeeDetail
      .map(item => item[this.keySelection])
      .filter(value => value !== undefined);


    return Array.from(new Set(values));
  }

  onSelectionChange(event: any) {
    this.keySelection = event.target.value;
    console.log(`Selected key: ${this.keySelection}`);
    this.specificValues = this.getFilteredData();
  }

  onValueSelectonChange(event: any) {
    if(event.target.value == "All"){
      // this.valueSelection = this.employeeDetail
      this.filteredData = this.employeeDetail;
    }
    this.valueSelection = event.target.value;
    console.log('selected val = ', this.valueSelection)
  }


  
  
  applyChange() {
    if (this.keySelection === undefined) {
      console.log('not selected');
      return;
    }
    
    this.EmployeeService.getData().subscribe((resp: any) => {
      let result: any;
      
      if (this.keySelection === 'All') {
        result = this.employeeDetail;
      } else {
        const filterKey = this.keySelection;
        result = resp.filter((data: any) => data[filterKey] === this.valueSelection);
      }
      
      console.log(result);
      this.filteredData = result;
    });
  }
  resetFilters() {
    this.keySelection = '';
    this.valueSelection= "";
    this.specificValues = [];
    this.filteredData = this.employeeDetail;
    console.log('Filters reset');
  }

//search
onSearchChange(searchvalue: any): void {
  if(searchvalue){
    this.searchval = searchvalue;  
    this.filterEmployees();
  }
  else{
    this.searchval = this.employeeDetail
  }
}

filterEmployees(): void {

    this.filteredData = this.employeeDetail.filter(employee =>
      Object.values(employee).some(value =>
        String(value).toLowerCase().includes(this.searchval)
      )
    );
  
    // this.filteredData = this.employeeDetail; 

}

}
