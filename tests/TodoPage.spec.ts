import { test, expect } from './fixtures/todo.fixture';

test('verify successfully add a todo item', async ({ todoPage }) => {
    await todoPage.open();

    const numberBeforeAdding = await todoPage.getTodoItemCount();
    const listCompleted = await todoPage.getCompletedTodoItems();

    await todoPage.addTodoItem('Buy milk');

    const numberAfterAdding = await todoPage.getTodoItemCount();
    expect(numberAfterAdding).toBe(numberBeforeAdding + 1);

    await todoPage.selectTab('All');
    let todoItems = await todoPage.getTodoItems();
    expect(todoItems[todoItems.length - 1]).toContain('Buy milk');
    
    await todoPage.selectTab('Active');
    todoItems = await todoPage.getTodoItems();
    expect(todoItems[todoItems.length - 1]).toContain('Buy milk');

    await todoPage.selectTab('Completed');
    todoItems = await todoPage.getTodoItems();
    expect(todoItems).toEqual(listCompleted);
});
/**
 * Verifies that a todo item can be marked as completed
 * Open the TodoMVC application
 * Add a new todo item
 * Mark the todo item as completed
 * Verify that the todo item is marked as completed
 * Verify Item left count is decreased by 1
 * Verify that the completed todo item appears in the "All" tab
 * Verify that the completed todo item does not appear in the "Active" tab
 * Verify that the completed todo item appears in the "Completed" tab
 */
test('verify marked completed todo item', async ({ todoPage }) => {
    await todoPage.open();
    await todoPage.addTodoItem('Buy milk');

    const numberBeforeMarking = await todoPage.getTodoItemCount();
    const listCompleted = await todoPage.getCompletedTodoItems();
    const listActive = await todoPage.getActiveTodoItems();

    await todoPage.selectTab('All');
    await todoPage.markTodoItemCompleted("Buy milk"); 
    const numberAfterMarking = await todoPage.getTodoItemCount();
    expect(numberAfterMarking).toBe(numberBeforeMarking - 1);

    let todoItems = await todoPage.getTodoItems();
    expect(await todoPage.isItemCompleted("Buy milk")).toBe(true);

    await todoPage.selectTab('Active');
    todoItems = await todoPage.getTodoItems();
    expect(listActive).toEqual([...todoItems, 'Buy milk']);

    await todoPage.selectTab('Completed');
    todoItems = await todoPage.getTodoItems();
    expect(todoItems).toEqual([...listCompleted, 'Buy milk']);


});
/**
 * Verify item active delete successfully
 * Open the TodoMVC application
 * Add a new todo item
 * Delete the todo item
 * Verify list count decreased by 1
 * Verify count left decreased by 1
 * 
 */
test('verify delete a todo item', async ({ todoPage }) => {
    await todoPage.open();
    await todoPage.addTodoItem('Buy milk');

    const numberBeforeDeleting = await todoPage.getTodoItemCount();
    const listActive = await todoPage.getActiveTodoItems();
    await todoPage.selectTab('Active');
    await todoPage.deleteTodoItem('Buy milk');

    const numberAfterDeleting = await todoPage.getTodoItemCount();
    expect(numberAfterDeleting).toBe(numberBeforeDeleting - 1);

    const todoItems = await todoPage.getTodoItems();
    expect(listActive).toEqual([...todoItems, 'Buy milk']);
    
});

/**
 * Rename task name "Buy milk" to "Buy bread"
 * Verrify that item count remains the same
 * Verify Buy bread is displayed in All and Active tabs
 * Verify Tab completed does not changed
 */
test('verify edit a todo item', async ({ todoPage }) => {
    await todoPage.open();
    await todoPage.addTodoItem('Buy milk');

    const numberBeforeEditing = await todoPage.getTodoItemCount();
    const listCompleted = await todoPage.getCompletedTodoItems();
    await todoPage.selectTab('All');
    await todoPage.editTodoItem('Buy milk', 'Buy bread');

    const numberAfterEditing = await todoPage.getTodoItemCount();
    expect(numberAfterEditing).toBe(numberBeforeEditing);

    let todoItems = await todoPage.getTodoItems();
    expect(todoItems[todoItems.length - 1]).toContain('Buy bread');
    
    await todoPage.selectTab('Active');
    todoItems = await todoPage.getTodoItems();
    expect(todoItems[todoItems.length - 1]).toContain('Buy bread');

    await todoPage.selectTab('Completed');
     todoItems = await todoPage.getTodoItems();
    expect(todoItems).toEqual(listCompleted);

});