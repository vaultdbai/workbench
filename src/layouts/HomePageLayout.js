import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { DRAWER_WIDTH } from "utils/constants/common";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, rightOpen }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-20px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: `${DRAWER_WIDTH}px`,
    }),
    ...(rightOpen && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginRight: `${DRAWER_WIDTH}px`,
    }),
    ...(open && rightOpen && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `calc(100% - ${2 *DRAWER_WIDTH}px)`,
      marginRight: `${DRAWER_WIDTH}px`,
      marginLeft: `${DRAWER_WIDTH}px`
    })
  }));

// Home Page Layout
// we can have different page layouts created for different devices , routes, pages etc
const HomePageLayout = ({ children, navBar, sideBar, rightSideBar, showDrawer, showRightDrawer }) => {
  return (
    <Box height="100vh" width="100vw">
      {/*  navigation Bar goes here */}
      {rightSideBar}
      {navBar}
      {sideBar}
      <Main open={showDrawer} rightOpen={showRightDrawer}>
        <Toolbar />
        {/* Content goes here */}
        {children}
      </Main>
    </Box>
  );
};

HomePageLayout.propTypes = {
  // componets for nav and sider
  navBar: PropTypes.element.isRequired,
  sideBar: PropTypes.element.isRequired,
  rightSideBar: PropTypes.element.isRequired,
  children: PropTypes.arrayOf(PropTypes.element), // page contents
  showDrawer: PropTypes.bool.isRequired,
  showRightDrawer: PropTypes.bool.isRequired
};

export default HomePageLayout;
