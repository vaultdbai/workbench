import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import EmptyState from "Components/EmptyState";
import SidebarListItem from "Components/SideBar/SidebarListItem";
import DatabaseSidebarListItem from "Components/SideBar/DatabaseSidebarListItem";
import { DEFAULT_STRINGS, DRAWER_WIDTH } from "utils/constants/common";
import Proptypes from "prop-types";
import Book from "@mui/icons-material/Book";
import { getSyntaxMockData } from "utils/mockData";

// SideBar Styles
const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    [theme.breakpoints.up("sm")]: {
      position: "absolute",
    },
    whiteSpace: "nowrap",
    height: "100%",
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short,
    }),
    width: 0,
  },
}));

// SideBar Component
// TODO: add parameter that is the change database function
const SideBar = ({ showDrawer = false, items = [] }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !showDrawer && classes.drawerPaperClose
        ),
      }}
      open={showDrawer}
    >
      <Box p={2}>
        <Typography variant="h6">Databases</Typography>
      </Box>
      <List>
        {/* Add an attribute parameter that tells if the functions is selected or not. */}
        <DatabaseSidebarListItem databaseName="Database 1"/>
        <DatabaseSidebarListItem databaseName="Database 2"/>
        <DatabaseSidebarListItem databaseName="Database I don't know maybe something really long"/>
      </List>
      <Box p={2}>
        <Typography variant="h6">Tables</Typography>
      </Box>
      {items.length === 0 ? (
        <EmptyState
          title={DEFAULT_STRINGS.NO_TABLES_EXIST}
          titleVariant="h6"
          subtitle={DEFAULT_STRINGS.IMPORT_NEW_DATA_MESSAGE}
        />
      ) : (
        <List>
          {items.map((item, index) => (
            <SidebarListItem
              key={`${item.tableName}-${index}-table-metadata`}
              listItem={item}
            />
          ))}
        </List>
      )}
      <Box py={2}>
        <SidebarListItem
          listItem={getSyntaxMockData()}
          icon={<Book />}
          subtitle={"Queries"}
        />
      </Box>
    </Drawer>
  );
};

export default SideBar;

SideBar.propTypes = {
  items: Proptypes.array,
  showDrawer: Proptypes.bool.isRequired,
};
