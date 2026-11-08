import { expect, type Locator, type Page } from '@playwright/test';

export class TodoPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('https://todomvc.com/examples/react/dist/');
    }

    async getCompletedTodoItems(): Promise<string[]> {
        if (await this.getTodoItemCount() === 0) {
            return [];
        }
        await this.selectTab('Completed');
        return this.getTodoItems();
    }

    async addTodoItem(item: string) {
        await this.page.locator('.new-todo').fill(item);
        await this.page.locator('.new-todo').press('Enter');
    }

    async getTodoItems(): Promise<string[]> {
        const todoLabels = await this.page.getByTestId('todo-item').allTextContents();
        console.log('Todo items:', todoLabels);

        return todoLabels;
    }

    async selectTab(tabName: string) {
        const tabLocator = this.page.getByRole('link', { name: tabName });
        await tabLocator.click();
    }

    async getTodoItemCount(): Promise<number> {
        const countText = await this.page.locator('.todo-count').textContent();
        return countText ? parseInt(countText) : 0;
    }

    async markTodoItemCompleted(item: string) {
        const todoItem = await this.getItem(item);
        await todoItem
            .getByTestId('todo-item-toggle')
            .check();

    }
    async isItemCompleted(item: string): Promise<boolean> {
        return await this.page
        .getByTestId('todo-item')
        .filter({ hasText: item })
        .last()
        .getByTestId('todo-item-toggle')
        .isChecked();
    }

    async getActiveTodoItems(): Promise<string[]> {
        if (await this.getTodoItemCount() === 0) {
            return [];
        }
        await this.selectTab('Active');
        return this.getTodoItems();
    }

    async deleteTodoItem(item: string) {
        const todoItem = await this.getItem(item);
        await todoItem
            .hover();
        await this.page
            .getByTestId('todo-item')
            .filter({ hasText: item })
            .last()
            .locator('.destroy')
            .click();
          

    }

    async getItem(name: string): Promise<Locator> {
        return this.page
            .getByTestId('todo-item')
            .filter({ hasText: name })
            .last();
    }

    async editTodoItem(oldItem: string, newItem: string) {
        this.page
        .getByTestId('todo-item')
        .filter({ hasText: oldItem })
        .last()
        .getByTestId('todo-item-label')
        .dblclick();
        this.page.getByTestId('todo-item').getByTestId('text-input').fill(newItem);
     
      await this.page.getByTestId('todo-item').getByTestId('text-input').press('Enter');

    }
}