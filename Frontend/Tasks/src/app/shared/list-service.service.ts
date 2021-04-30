import { Injectable } from '@angular/core';
import { WebRequestsService } from './web-requests.service';

@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  constructor(private webRequestService: WebRequestsService) { }

  getLists() {
    return this.webRequestService.get('lists');
  }

  getList(listId: string) {
    return this.webRequestService.get(`lists/${listId}`);
  }

  createList(title: string) {
    return this.webRequestService.post('lists', {title});
  }

  updateList(title: string, listId: string) {
    return this.webRequestService.patch(`lists/${listId}`, {title});
  }

  deleteList(listId: string) {
    return this.webRequestService.delete(`lists/${listId}`);
  }
}
