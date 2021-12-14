import * as React from "react";
import {makeStyles, styled} from "@mui/styles";
import {useEffect} from "react";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    Menu as MenuIcon,
} from "@mui/icons-material";
import {useLocation, NavLink} from "react-router-dom";
import {MenuList} from "../../Constants/mains";

import CestaLogo from "../../assets/commons/Cesta.png";
import Twitter from "../../assets/platform/twitter.png";
import Discord from "../../assets/platform/discord.png";
import Medium from "../../assets/platform/medium.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    logo: {
        width: "70%",
        height: "auto",
        margin: "1rem 0.1rem 2rem 0.1rem",
    },
    menuIcon: {
        width: "1.5rem",
        height: "1.5rem",
        margin: "0 0.5rem",
    },
    platformLogo: {
      height: '20px'
    },
    menuName: {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "14px",
        color: "#FFFFFF",
    },
    activeMenu: {
        background: "#375894 !important",
    },
}));

const StyledName = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "0.9rem",
        lineHeight: "2rem",
        color: "#FFFFFF",
        marginLeft: "0.8rem",
    },
}));

const StyledList = styled(List)(({theme}) => ({
    "&.MuiList-root": {},
}));

const StyledListItem = styled(ListItem)(({theme}) => ({
    "& .MuiListItemIcon-root": {
        minWidth: "40px",
        textDecoration: "none !important",
    },
}));

function SideBar(props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [menuLogs, SetMenuLogos] = React.useState({});
    const classes = useStyles();

    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const getMenuLogos = async () => {
        let logos = {};
        for (let i = 0; i < MenuList.length; i++) {
            const imageName = MenuList[i].name;
            let image = await import(`../../assets/sideMenu/${imageName}.png`);
            logos[MenuList[i].name] = image.default;
        }
        SetMenuLogos(logos);
    };

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    useEffect(() => {
        getMenuLogos();
    }, []);

    const drawer = (
        <div>
            {/* <Toolbar /> */}
            <Divider/>
            <img src={CestaLogo} alt="" className={classes.logo}/>
            <StyledList>
                {MenuList.map((menu, index) => (
                    <NavLink to={menu.path} key={index} style={{textDecoration: "none"}}>
                        <StyledListItem
                            button
                            key={index}
                            className={
                                location.pathname === menu.path ? classes.activeMenu : ""
                            }
                        >
                            <ListItemIcon>
                                {menuLogs[menu.name] && <img
                                    src={menuLogs[menu.name]}
                                    alt={menu.name}
                                    className={classes.menuIcon}
                                />}
                            </ListItemIcon>
                            <StyledName>{menu.label}</StyledName>
                        </StyledListItem>
                    </NavLink>
                ))}
                <Box sx={{height: '10%', marginTop: '25vw', display: 'flex', direction: 'column'}}>
                    <Box onClick={()=> openInNewTab("https://twitter.com/CestaFinance")} sx={{
                        marginLeft: '20%',
                        padding: '5%',
                        cursor: 'pointer'

                    }}>
                        <img src={Twitter} className={classes.platformLogo} alt=""/>
                    </Box>
                    <Box onClick={()=> openInNewTab("https://discord.gg/N2TdnC3tZX")} sx={{
                        padding: '5%',
                        cursor: 'pointer'
                    }}>
                        <img src={Discord} className={classes.platformLogo} alt=""/>
                    </Box>
                    <Box onClick={()=> openInNewTab("https://hello-32.gitbook.io/cesta-finance/")}  sx={{
                        padding: '5%',
                        cursor: 'pointer'

                    }}>
                        <img src={Medium} className={classes.platformLogo} alt=""/>
                    </Box>
                </Box>
            </StyledList>
        </div>
    );

    const container =
        undefined;

    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                    background: "transparent",
                    boxShadow: "none",
                    zIndex: 9,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: "none"}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: "block", sm: "none"},
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: "none", sm: "block"},
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            background: "#110d16",
                            // boxShadow: "0px 0px 30px #15023b",
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

export default SideBar;
