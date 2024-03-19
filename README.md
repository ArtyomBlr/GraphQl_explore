# REST API vs GraphQL API: A Concise Comparison

## REST API:

- **Resource-Based:** REST APIs are built around resources, each identified by a URL, with actions represented by HTTP methods.
- **Stateless Operations:** Requests must contain all necessary information; the server does not store client context between requests.
- **Fixed Data Structure:** Server responses follow a fixed structure; clients cannot specify required data precisely, leading to potential over-fetching or under-fetching.
- **Versioning:** Changes are managed through versioning, often leading to maintenance of multiple API versions.

## GraphQL API:

- **Query Language for API:** GraphQL describes the API's data comprehensively, enabling clients to request precisely what they need for efficiency.
- **Single Endpoint:** Operates over a single endpoint, with clients using queries for data retrieval and mutations for data modification.
- **Real-Time Data:** Supports real-time updates via subscriptions, allowing clients to maintain live connections for immediate data updates.
- **Type Safety:** GraphQL schemas provide a clear contract between the server and the client, ensuring type safety and minimizing runtime errors.
- **Introspective:** Self-documenting schema defines API capabilities, facilitating tooling support like auto-completion and validation.
- **Avoid Over and Under Fetching:** Clients specify exact data needs, mitigating issues of over-fetching and under-fetching.

- **GraphQL Operations:**

  - **Query:** Corresponds to HTTP GET method, used for data fetching.

    - Example:
      ```graphql
      query {
        getUser(id: "123") {
          id
          name
          email
        }
      }
      ```

  - **Mutation:** Similar to HTTP POST, PUT, DELETE, used for modifying data.

    - Example:

      ```graphql
      mutation {
        updateUser(id: "123", input: { name: "New Name", email: "new@email.com" }) {
          id
          name
          email
        }
      }
      ```

  - **Subscription:** Subscriptions in GraphQL allow clients to receive real-time updates from the server. They are typically used to subscribe to specific events or changes in the data. (is not needed for us).

  - Example:

    ```graphql
    subscription {
      newMessage {
        id
        content
        timestamp
      }
    }
    ```

  ## Apollo Client: Simplifying Data Management in GraphQL Applications

  To enhance your GraphQL experience in Angular, you can leverage the power of Apollo Client. Apollo Client is a robust GraphQL client that offers advanced features

  1 **Caching:**

  - Apollo Client provides an intelligent caching mechanism that automatically stores and retrieves data from the cache. This reduces the need for unnecessary network requests and improves application performance.
  - Realtime update without response sending, just from cache can be reached with `update() .readQuery, .writeQuery` example app/Todo/TodoItem.ts

  2 **Local State Management:**

  - Apollo Client allows you to manage local application state alongside your GraphQL data. You can define and manipulate local data using GraphQL queries and mutations, providing a unified approach to data management.

  3 **Optimistic UI Updates:**

  - With Apollo Client, you can implement optimistic UI updates, which means updating the UI immediately after a user action and then synchronizing the changes with the server. This provides a smooth and responsive user experience. Use `optimisticResponse: {}`, example app/Todo/TodoItem.ts

  4 **Error Handling:**

  - Apollo Client provides robust error handling mechanisms, allowing you to handle errors gracefully and provide meaningful feedback to users.

  5 **Pagination:**

  - Apollo Client offers built-in support for pagination, making it easy to implement features like infinite scrolling or "load more" buttons in your application.

  ### apollo-angular requests return Observable!

  - Example:

  ```
  const REMOVE_TODO = gql`
    mutation removeTodo($id: Int!) {
      delete_todos(where: { id: { _eq: $id } }) {
        affected_rows
      }
    }
  `;

  this.apollo
    .mutate({
      mutation: REMOVE_TODO,
      variables: { id: this.todo.id },
      optimisticResponse: {},
      update: (cache) => {
        const existingTodos: any = cache.readQuery({ query: GET_MY_TODOS });

        const todos = existingTodos.todos.filter(
          (t) => t.id !== this.todo.id
        );

        cache.writeQuery({
          query: GET_MY_TODOS,
          data: { todos },
        });
      },
    })
    .subscribe(
      ({ data }) => {
        console.log('got data', data);
      },
      (error) => {
        console.log('there was an error sending the query', error);
      }
    );
  ```

## [Hasura Angular Guide](https://hasura.io/learn/graphql/angular-apollo/intro-to-graphql/)

## [GraphiQL - good Postman alternative for graphQl](https://github.com/graphql/graphiql)

## [GraphQL Documentation](https://graphql.org/learn/)
