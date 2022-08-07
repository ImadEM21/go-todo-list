import { ITodo } from '../@types/todo';

export interface Status {
    label: string;
    color: 'default' | 'error' | 'warning' | 'success' | 'primary' | 'info' | 'secondary' | undefined;
}

export const capitalizeFirstLetter = ([first, ...rest]: string, locale = navigator.language) => (first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join(''));

export const datesAreOnSameDay = (first: Date, second: Date) => first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();

export const isValidEmail = (email: string) =>
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

export const isValidName = (name: string) => {
    if (/\s{2}/.test(name)) {
        return false;
    }
    if (/[^-'a-zÀ-ÿ ]/gi.test(name)) {
        return false;
    }
    return true;
};

export const getStatusTodo = (todo: ITodo): Status => {
    let today = new Date();
    let todoDate = new Date(todo.endDate);
    if (todoDate.getTime() <= today.getTime() && !todo.completed) {
        return {
            label: 'En retard',
            color: 'error'
        };
    }
    if (datesAreOnSameDay(today, todoDate) && !todo.completed) {
        return {
            label: "À finir aujourd'hui",
            color: 'warning'
        };
    }
    if (!todo.completed) {
        return {
            label: 'Dans les temps',
            color: 'primary'
        };
    }
    return {
        label: 'Terminée',
        color: 'success'
    };
};
