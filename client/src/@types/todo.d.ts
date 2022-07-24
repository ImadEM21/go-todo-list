export interface ITodo {
    _id: string;
    title: string;
    description: string;
    endDate: Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export type TodoCreated = {
    _id: string;
};

export type TodoModified = {
    nModified: number;
};

export type TodoDeleted = {
    nDeleted: number;
};

export type Complete = {
    completed: boolean;
};

export type TodoContextType = {
    todos: ITodo[];
    getTodos: (userId: string) => Promise<ITodo[]>;
    getTodo: (todoId: string) => Promise<ITodo>;
    updateTodo: (todo: ITodo, userId: string) => Promise<TodoModified>;
    deleteTodo: (id: string, userId: string) => Promise<TodoDeleted>;
    createTodo: (todo: ITodo, userId: stirng) => Promise<TodoCreated>;
    completeTodo: (id: string, payload: Complete, userId: string) => Promise<TodoModified>;
};
