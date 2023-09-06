import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponet } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crud';
  displayedColumns: string[] = ['firstName','lastName','email','dob','gender','education','company','experience','package','id','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _dialog: MatDialog, private _empService:EmployeeService) {}

  ngOnInit(): void{
    this.getEmployeeList();
  }

  openAddEdit(){
    const dialogRef = this._dialog.open(EmpAddEditComponet);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val) {
          this.getEmployeeList();
        }
      }
    })
  }
  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next:(res) =>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      },
      error: (err) =>{
        console.log(err)
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteEmployee(id:number){
    this._empService.deleteEmployee(id).subscribe({
      next:(res) =>{
        alert('employee deleted');
        this.getEmployeeList();
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  openEditFrom(data: any) {
    this._dialog.open(EmpAddEditComponet,{
      data,
    });
  }
}
