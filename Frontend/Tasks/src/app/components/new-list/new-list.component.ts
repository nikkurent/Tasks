import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListServiceService } from 'src/app/shared/list-service.service';


@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private listService: ListServiceService, private router: Router) { }

  ngOnInit(): void {}

  addList(newList: string) {
    this.listService.createList(newList).subscribe((value: any) => {
      this.router.navigateByUrl(`/lists/${value.body._id}`);
    });
  }
}
