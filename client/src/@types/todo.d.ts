export interface ITodo {
    _id: string;
    title: string;
    description: string;
    endDate: Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type TodoContextType = {
    todos: ITodo[];
    updateTodo: (todo: ITodo) => void;
    deleteTodo: (id: string) => void;
    createTodo: (todo: ITodo) => void;
    completeTodo: (id: string) => void;
};
