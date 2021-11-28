import light from "./setting/light";
import dark from "./setting/dark";

const themes = {
    light, 
    dark
}

export default function getTheme(theme) {
    return themes[theme];
}