import React, { useState } from 'react';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './base';

export const CustomThemeContext = React.createContext(
    {
        currentTheme: 'dark',
        setTheme: null,
    },
)

const CustomThemeProvider = (props) => {
    const { children } = props; 
    const currentTheme = localStorage.getItem("appTheme") || 'dark';
    console.log(`current theme`, currentTheme);
    const [themeName, _setThemeName] = useState(currentTheme);
    const theme = getTheme(themeName);

    const setThemeName = (name) => {
        localStorage.setItem('appTheme', name);
        _setThemeName(name);
    }
    const contextValue = {
        currentTheme: themeName,
        setTheme: setThemeName
    }

    return (
        <CustomThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CustomThemeContext.Provider>
    )
 } 

 export default CustomThemeProvider;
