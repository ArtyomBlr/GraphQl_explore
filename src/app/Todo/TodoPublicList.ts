import { Component, Input, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

interface Todo {
  id: number;
  created_at: Date;
}

interface NewPublicTodos {
  todos: Todo[];
}

@Component({
  selector: 'TodoPublicList',
  templateUrl: './TodoPublicList.template.html',
})
export class TodoPublicList implements OnInit {
  olderTodosAvailable = true;
  newTodosCount = 1;
  todos!: Todo[];

  public limit = 10;
  public offset = 0;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.getTodos().subscribe(({ data }) => {
      this.todos = data.todos;
      console.log(this.todos);
    });
  }

  loadMore() {
    this.offset += 10;

    this.getTodos().subscribe(({ data }) => {
      this.todos = [...this.todos, ...data.todos];
      console.log(this.todos);
    });
  }

  private getTodos() {
    const GET_TODOS = gql`
      query getTodos {
        todos(limit: ${this.limit},offset: ${this.offset}) {
          id
          title
          user {
            name
          }
        }
      }
    `;

    return this.apollo.query<NewPublicTodos>({
      query: GET_TODOS,
    });
  }
}
