export function CapitalizeFirstLetter (str)  {
    return str === undefined || 
        str === "" ||
        str === null
        ? "" 
        : str.charAt(0).toUpperCase() + str.slice(1);
}