import * as React from "react";
import { makeStyles, styled } from "@mui/styles";
import { useEffect } from "react";
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
import { Menu as MenuIcon } from "@mui/icons-material";
import { useLocation, NavLink } from "react-router-dom";
import { MenuList } from "../../Constants/mains";

import CestaLogo from "../../assets/commons/Cesta.png";
import Twitter from "../../assets/platform/twitter.png";
import Discord from "../../assets/platform/discord.png";
import Gitbook from "../../assets/platform/gitbook.png";
import Github from "../../assets/platform/github.png";
import Medium from "../../assets/platform/medium.png";
import Hacken from "../../assets/auditor/hacken.svg";
import useGAEventsTracker from "../../Analytics/useGAEventsTracker";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  logo: {
    width: "70%",
    height: "auto",
    margin: "1.5rem 0.1rem 1.5rem 0.1rem",
  },
  menuIcon: {
    width: "1.5rem",
    height: "1.5rem",
    margin: "0 0.5rem",
  },
  platformLogo: {
    height: "20px",
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
  auditedBy: {
    "&.MuiTypography-root": {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "14px",
      color: "#FFFFFF",
      marginBottom: "8px"
    },
  }
}));

const StyledName = styled(Typography)(({ theme }) => ({
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

const StyledList = styled(List)(({ theme }) => ({
  "&.MuiList-root": {},
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  "& .MuiListItemIcon-root": {
    minWidth: "40px",
    textDecoration: "none !important",
  },
}));

function SideBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menuLogs, SetMenuLogos] = React.useState({});
  const classes = useStyles();
  const GAEventsTracker = useGAEventsTracker("External Link");

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
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    GAEventsTracker(url, "Clicked");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    getMenuLogos();
  }, []);

  const Platforms = [
    { icon: Twitter, link: "https://twitter.com/CestaFinance" },
    { icon: Discord, link: "https://discord.gg/k39QEv2Xw5" },
    { icon: Gitbook, link: "https://cesta.gitbook.io/intro/" },
    { icon: Github, link: "https://github.com/Cestafinance" },
    { icon: Medium, link: "https://cestafinance.medium.com/" },
  ];

  const drawer = (
    <div style={{ display: "flex", flexDirection: "column", justifyContent:"space-between", height: "100%"}}>
      <div>
        <img src={CestaLogo} alt="" className={classes.logo} />
        <StyledList>
          {MenuList.map((menu, index) => (
            <NavLink
              to={menu.path}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <StyledListItem
                button
                key={index}
                className={
                  location.pathname === menu.path ? classes.activeMenu : ""
                }
              >
                <ListItemIcon>
                  {menuLogs[menu.name] && (
                    <img
                      src={menuLogs[menu.name]}
                      alt={menu.name}
                      className={classes.menuIcon}
                    />
                  )}
                </ListItemIcon>
                <StyledName>{menu.label}</StyledName>
              </StyledListItem>
            </NavLink>
          ))}
        </StyledList>
      </div>
      <div style={{margin:"32px 0px"}}>
        <Box  sx={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            margin: "16px"
          }}>
            <Typography variant={"h4"} className={classes.auditedBy}>Audited By</Typography>
            <img src={Hacken} style={{height: "12px"}} alt="" />
        </Box>
        <Box
          sx={{
            // position: "fixed",
            bottom: "0%",
            height: "8%",
            display: "flex",
            flexDirection: "row",
            justifyItems: "center",
            marginLeft: "16px"
          }}
        >
          {Platforms.map(p => {
            return <>
              <Box
                onClick={() => openInNewTab(p.link)}
                sx={{
                  padding: "5%",
                  cursor: "pointer",
                }}
              >
                <img src={p.icon} className={classes.platformLogo} alt="" />
              </Box>
            </>
          })}
        </Box>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "#110d16",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, mt: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 1 },
          display: { xs: "none", md: "block" },
        }}
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
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#110d16",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
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
