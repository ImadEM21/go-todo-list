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

export type TodoContextType = {
    todos: ITodo[];
    getTodos: (userId: string) => Promise<ITodo[]>;
    getTodo: (todoId: string) => Promise<ITodo>;
    updateTodo: (todo: ITodo) => Promise<TodoModified>;
    deleteTodo: (id: string) => void;
    createTodo: (todo: ITodo) => Promise<TodoCreated>;
    completeTodo: (todo: ITodo) => Promise<TodoModified>;
};
