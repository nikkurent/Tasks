import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { WebRequestsService } from './web-requests.service';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private webRequestService: WebRequestsService) { }

  getTasks(listId: string) {
    return this.webRequestService.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string) {
    return this.webRequestService.post(`lists/${listId}/tasks`, {title});
  }

  updateTask(title: string, listId: string, taskId: string){
    return this.webRequestService.patch(`lists/${listId}/tasks/${taskId}`, {title});
  }

  deleteTask(listId: string, taskId: string) {
    return this.webRequestService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  completed(task: Task, listId: string, taskId: string){
    return this.webRequestService.patch(`lists/${listId}/tasks/${taskId}`, {completed: !task.completed});
  }
}
