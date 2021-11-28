import { createTheme } from "@mui/material/styles";
import { typography, breakpoint } from "../common/commonTheme";

const theme = createTheme({
    typography,
    breakpoints: breakpoint,
    palette: {
        type: 'light',
        app: {
        },
    },
});

export default theme;