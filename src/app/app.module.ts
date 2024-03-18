import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { AppRoutingModule } from './app-routing.module';
import { App } from './App';
import { Auth0Wrapper } from './Auth/Auth0Wrapper';
import { Callback } from './Auth/Callback';
import { Login } from './Auth/Login';
import { LogoutBtn } from './Auth/LogoutBtn';
import { TaskItem } from './Todo/TaskItem';
import { TodoFilters } from './Todo/TodoFilters';
import { TodoInput } from './Todo/TodoInput';
import { TodoItem } from './Todo/TodoItem';
import { TodoPrivateList } from './Todo/TodoPrivateList';
import { TodoPrivateWrapper } from './Todo/TodoPrivateWrapper';
import { TodoPublicList } from './Todo/TodoPublicList';
import { TodoPublicWrapper } from './Todo/TodoPublicWrapper';
import { Header } from './Header';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Auth0Wrapper,
    Callback,
    Login,
    LogoutBtn,
    TaskItem,
    TodoFilters,
    TodoInput,
    TodoItem,
    TodoPrivateList,
    TodoPrivateWrapper,
    TodoPublicList,
    TodoPublicWrapper,
    App,
    Header,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${localStorage.getItem('token')}`
        );
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://hasura.io/learn/graphql',
            headers: headers,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [Auth0Wrapper],
})
export class AppModule {}
