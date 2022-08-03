export interface ITodo {
    _id: string;
    title: string;
    description: string;
    endDate: STRING;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedDate: string;
    userId: string;
}

export type GetTodos = {
    todos: ITodo[];
    total: number;
    uncompleted: number;
    late: number;
    lastCompleted: GraphData[];
};

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

export type CreateTodo = {
    title: string;
    description: string;
    endDate: string;
    completed: boolean;
    userId: string;
};

export type GraphData = {
    date: string;
    total: number;
};

export type TodoContextType = {
    todos: ITodo[];
    total: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    uncompleted: number;
    late: number;
    lastCompleted: GraphData[];
    getTodos: (userId: string) => Promise<GetTodos>;
    getTodo: (todoId: string) => Promise<ITodo>;
    updateTodo: (todo: ITodo) => Promise<TodoModified>;
    deleteTodo: (id: string) => Promise<TodoDeleted>;
    createTodo: (todo: CreateTodo) => Promise<TodoCreated>;
    completeTodo: (id: string, payload: Complete) => Promise<TodoModified>;
};
