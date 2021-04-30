import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListServiceService } from 'src/app/shared/list-service.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  constructor(private listService: ListServiceService, @Inject(MAT_DIALOG_DATA) public data: {listId: string, listTitle:string}) { }

  /* Injected values from task-view.component.ts*/
  listTitle = this.data['listTitle'];
  listId = this.data['listId'];

  ngOnInit(): void {
  }

  editList(newList:string) {
    this.listService.updateList(newList, this.listId).subscribe(() => {
      location.reload();
    });
  }

}
