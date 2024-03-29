import { Component, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { GET_MY_TODOS } from './TodoPrivateList';

interface Todo {
  id: number;
  title: string;
  created_at: Date;
  is_completed: boolean;
}

interface InsertTodoResult {
  insert_todos: {
    affected_rows: number;
    returning: Todo[];
  };
}

const ADD_TODO = gql`
  mutation createTodoItem($todo: String!, $isPublic: Boolean!) {
    insert_todos(objects: { title: $todo, is_public: $isPublic }) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;

@Component({
  selector: 'TodoInput',
  templateUrl: './TodoInput.template.html',
})
export class TodoInput {
  @Input() isPublic: any = false;
  todoInput: any = '';
  loading = true;

  constructor(private apollo: Apollo) {}

  addTodo(e) {
    e.preventDefault();

    this.apollo
      .mutate<InsertTodoResult>({
        mutation: ADD_TODO,
        variables: {
          todo: this.todoInput,
          isPublic: this.isPublic,
        },
        update: (cache, { data }) => {
          if (this.isPublic) return null;

          const existingTodos: any = cache.readQuery({
            query: GET_MY_TODOS,
          });

          const newTodo = data.insert_todos.returning[0];
          cache.writeQuery({
            query: GET_MY_TODOS,
            data: { todos: [newTodo, ...existingTodos.todos] },
          });
        },
      })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.loading = false;
          this.todoInput = '';
        },
        error: (error) => {
          console.log('there was an error sending the query', error);
        },
      });
  }
}
