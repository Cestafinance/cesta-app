import { createTheme } from "@mui/material/styles";
import { typography, breakpoint } from "../common/commonTheme";

const theme = createTheme({
    typography,
    breakpoints: breakpoint,
    palette: {
        type: 'dark',
        primary: {
            main: '#375894',
        },
        secondary: {
            main: '#1B203C',
        },
        app: {
            main: 'rgba(20, 19, 22, 1)',
            light: 'rgba(27, 32, 60, 0.2)',
            color3: '#375894'
        },
        border: {

        },

    },
});

export default theme;