import { Component, OnInit, Inject } from '@angular/core';
import { TaskServiceService } from 'src/app/shared/task-service.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskServiceService, @Inject(MAT_DIALOG_DATA) public data: {listId: string}) { }

  /* Injected value from task-view.component.ts*/
  listId = this.data['listId']

  ngOnInit(): void {}

  addTask(newTask: string) {
    this.taskService.createTask(newTask, this.listId).subscribe(() => {
      location.reload();
    });
  }

}
