import { Component, OnInit, Inject } from '@angular/core';
import { TaskServiceService } from 'src/app/shared/task-service.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  constructor(private taskService: TaskServiceService, @Inject(MAT_DIALOG_DATA) public data: {listId: string, task: Task}) { }

  /* Injected value from task-view.component.ts*/
  listId = this.data['listId'];
  taskId = this.data['task']._id;
  task = this.data['task'].title;
  

  ngOnInit(): void {  
  }

  editTask(newTask: string) { 
    this.taskService.updateTask(newTask, this.listId, this.taskId).subscribe(() => {
      location.reload();
    });
  }
}
