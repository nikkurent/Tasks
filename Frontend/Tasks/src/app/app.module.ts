import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { FormsModule } from '@angular/forms';
import { NewListComponent } from './components/new-list/new-list.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { LoginComponent } from './components/login/login.component';
import { _HttpInterceptor } from './shared/http-interceptor';
import { EditListComponent } from './components/edit-list/edit-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewTaskComponent,
    NewListComponent,
    EditTaskComponent,
    SignInComponent,
    LoginComponent,
    EditListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: _HttpInterceptor, multi: true}],
  entryComponents: [
    MatDialogModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
