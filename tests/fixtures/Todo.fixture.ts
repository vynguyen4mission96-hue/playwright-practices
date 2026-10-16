import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

type TodoPages = {
  todoPage: TodoPage;
};

export const test = base.extend<TodoPages>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  }
});

 export { expect } from '@playwright/test';