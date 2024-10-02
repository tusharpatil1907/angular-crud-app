import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../employeeform/employeeform.component';
import { SearchPipe } from '../../search.pipe';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [JsonPipe, FormsModule,SearchPipe, CommonModule,RouterModule],
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'], 
})
export class EmployeelistComponent implements OnInit, OnChanges {
  @Input() triggerApiCall: boolean = false;
  @Output() dataFetched = new EventEmitter<void>();
  employeeDetail: any[] = []; 
  keySelection!: string;
  keys!: string[];
  valueSelection!: string
  specificValues?: string[]

  filteredData!: User[]
  
 //search input search bar 
  inpval: any;


  //search input options 
  searchTerm: string = '';
 
  
  

  constructor(private EmployeeService: EmployeeService, private http: HttpClient,private router: Router) { }

  ngOnInit(): void {

    this.fetchEmployeeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerApiCall'] && changes['triggerApiCall'].currentValue) {
      // this.callApi();
      this.fetchEmployeeData();
      this.resetTrigger();
    }

  }

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

      return this.EmployeeService.getData().subscribe((resp: any) => {
        console.log(resp);
        this.employeeDetail = resp;
      });

    // this.fetchEmployeeData();
    // this.resetTrigger();
  }
 

  resetTrigger() {
    this.dataFetched.emit();
    this.triggerApiCall = false;
  }

    senduserId(id: string) {
      this.EmployeeService.setId(id);
    }

  deleteEmployee(id: string): void {
    if(confirm("are you sure")){

      this.EmployeeService.deleteEmployee(id).subscribe(
        () => {console.log('Employee deleted');
          this.employeeDetail = this.employeeDetail.filter((employee: any) => employee.id !== id);
          this.fetchEmployeeData()
        },(error) => {
          console.error('Error deleting employee:', error);
        }
      );
    }
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


  getFilteredData(): any | undefined {
    if (!this.keySelection) {
      console.log('No key selected');
      return;
    }

    const values = this.employeeDetail
      .map(item => item[this.keySelection])
      .filter(value => value !== undefined);


    return new Set(values);
  }

  onSelectionChange(event: Event) {
    const e = event.target as HTMLInputElement;
    this.keySelection = e.value;
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
    this.applyChange();
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
        debugger;
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


  generateQuery(id:string) {
    let data 
    // this.EmployeeService.getUser(id).subscribe((res)=>{
      // data = res
      // console.log(data)
      this.router.navigate(['/'],{queryParams: {id: id}})
    // })

  }
}