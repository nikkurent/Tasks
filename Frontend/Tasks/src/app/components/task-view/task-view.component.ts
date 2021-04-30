import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { AuthServicesService } from 'src/app/shared/auth-services.service';
import { ListServiceService } from 'src/app/shared/list-service.service';
import { TaskServiceService } from 'src/app/shared/task-service.service';
import { EditListComponent } from '../edit-list/edit-list.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { NewListComponent } from '../new-list/new-list.component';
import { NewTaskComponent } from '../new-task/new-task.component';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})

export class TaskViewComponent implements OnInit {

  lists: List[] = [];
  tasks?: Task[];
  listTitle!: string;
  selectedListId!: string;

  constructor(private taskService: TaskServiceService, private listService: ListServiceService, private authRequestService: AuthServicesService, private routes: ActivatedRoute, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

    /**
    *  Subscribing to routes parameters and retriving list title and tasks.
    * 
    */
    this.routes.params.subscribe((params: Params) => {
      if (params.listId) {
        this.selectedListId = params['listId'];
        this.listService.getList(this.selectedListId).subscribe((list: any) => {
          this.listTitle = list[0].title;
        })
        this.taskService.getTasks(this.selectedListId).subscribe((tasks:any) => {
          this.tasks = tasks;
        })
        
      } else {
       this.tasks = undefined;
      }
    })

    /**
    *  OnInit geting users lists.
    */
    this.listService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    })

  } //ngOnInit



  // LIST functions 

  /**
  *   Opening new-list.component.ts with Angular materials - dialog component
  */
  addListClick() {
    const dialogRef = this.dialog.open(NewListComponent, {
      width: '650px',
      disableClose: false
    });
  }

  /**
  *   Opening edit-list.component.ts with Angular materials - dialog component
  */
  editList() {
    const dialogRef = this.dialog.open(EditListComponent, {
      width: '650px',
      data: {listId: this.selectedListId, listTitle: this.listTitle},
      disableClose: false
    });
  }

  /**
  *   Delete list
  */
  deleteList() {
    this.listService.deleteList(this.selectedListId).subscribe();
    this.router.navigate(['/'])
  }



  // TASK functions 

  /**
  *   Opening new-task.component.ts with Angular materials - dialog component
  */
  addTaskClick() {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '650px',
      data: {listId: this.selectedListId},
      disableClose: false
    });
  }

  /**
  *   Opening edit-task.component.ts with Angular materials - dialog component
  */
  editTask(task: any) {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '650px',
      data: {listId: this.selectedListId, task: task},
      disableClose: false
    });
  }

  /**
  *   Delete task
  */
  deleteTask(taskId: string) {
    this.taskService.deleteTask(this.selectedListId, taskId).subscribe();
    location.replace(`/lists/${this.selectedListId}`)
  }


  /**
  *   Toggle completed task
  */
  toggleCompleted(task:any) {
    this.taskService.completed(task, this.selectedListId, task._id).subscribe(() => {
      console.log('updated');
      task.completed = !task.completed
    })
  }

  /**
  *   Disables add task button when list item not selected
  */
  buttonDisabled() {
    if (this.selectedListId !== undefined) {
      return false
    } else return true;
  }

  /**
  *   Logout user
  */
  logout() {
    this.authRequestService.logout();
  }
}
