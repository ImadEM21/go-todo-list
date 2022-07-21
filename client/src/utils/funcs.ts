export const capitalizeFirstLetter = ([first, ...rest]: string, locale = navigator.language) => (first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join(''));
