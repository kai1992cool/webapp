import {Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<User>;
  users: any[] = [];
  filterControl: FormControl = new FormControl('');

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.dataSource = new MatTableDataSource<User>();
  }

  @ViewChild(MatSort) sort!: MatSort;

  @Input() filter!: User;

  ngOnInit() {
    // this.userService.getUsers().subscribe((data: User[]) => {
    //   this.users = data;
    //   this.dataSource.data = this.users;
    //   this.dataSource.sort = this.sort;
    // });

    this.users = [
      {
        id: 1,
name: 'one',
      },
      {
        id: 2,
name: 'two',
      },
      {
        id: 3,
name: 'three',
      },
      {
        id: 4,
name: 'four',
      }
    ];
    this.dataSource.data = this.users;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.name.toLowerCase().includes(filter) || data.id.toString() === filter;
    };

    // Get the initial filter value from the query parameters
    this.route.queryParams.subscribe(params => {
      const filterValue = params['find'] || '';
      this.filterControl.setValue(filterValue);
      this.applyFilter(filterValue);
    });

    // Subscribe to changes in the filter control
    this.filterControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.applyFilter(value);
    });
  }

  getInputValue(event: Event): string {
    const target = event.target as HTMLInputElement;
    return target ? target.value : '';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    // Update the URL with the new filter value
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { find: filterValue },
      queryParamsHandling: 'merge'
    });
  }

  

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }

  navigateToUserDetail(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
}
