import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

export const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(
      where: { is_public: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      title
      created_at
      is_completed
    }
  }
`;

interface Todo {
  id: number;
  title: string;
  created_at: Date;
  is_completed: boolean;
}
interface GetMyTodosResponse {
  todos: Todo[];
}

@Component({
  selector: 'TodoPrivateList',
  templateUrl: './TodoPrivateList.template.html',
})
export class TodoPrivateList implements OnInit {
  filter = 'all';
  clearInProgress = false;
  todos: Todo[] = [];
  filteredTodos: any;

  loading = true;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<GetMyTodosResponse>({
        query: GET_MY_TODOS,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        console.log(data, loading);
        this.loading = loading;
        this.todos = data.todos;
        this.filteredTodos = this.todos;
      });
  }

  filterResults($event) {
    this.filter = $event.filter;
    this.filteredTodos = this.todos;
    if (this.filter === 'active') {
      this.filteredTodos = this.todos.filter(
        (todo) => todo.is_completed !== true
      );
    } else if (this.filter === 'completed') {
      this.filteredTodos = this.todos.filter(
        (todo) => todo.is_completed === true
      );
    }
  }

  clearCompleted() {
    const CLEAR_COMPLETED = gql`
      mutation clearCompleted {
        delete_todos(
          where: { is_completed: { _eq: true }, is_public: { _eq: false } }
        ) {
          affected_rows
        }
      }
    `;
    this.apollo
      .mutate({
        mutation: CLEAR_COMPLETED,
        optimisticResponse: {},
        update: (cache, { data }) => {
          const existingTodos: any = cache.readQuery({ query: GET_MY_TODOS });
          const newTodos = existingTodos.todos.filter((t) => !t.is_completed);
          cache.writeQuery({ query: GET_MY_TODOS, data: { todos: newTodos } });
        },
      })
      .subscribe(
        ({ data }) => {
          console.log('got data ', data);
        },
        (error) => {
          console.log('there was an error sending the query', error);
        }
      );
  }
}
