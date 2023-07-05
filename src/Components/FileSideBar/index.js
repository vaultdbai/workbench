import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import EmptyState from "Components/EmptyState";
import SidebarListItem from "Components/SideBar/SidebarListItem";
import { DEFAULT_STRINGS, DRAWER_WIDTH } from "utils/constants/common";
import Proptypes from "prop-types";
import Book from "@mui/icons-material/Book";
import { getSyntaxMockData } from "utils/mockData";
import { useState } from "react";
import { Button, Collapse, Fab, Stack, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from '@mui/icons-material/Add';
import Configuration from "Configration";
import Scrollbar from 'react-scrollbar';

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
const FileSideBar = ({ showDrawer = true, items = [] }) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !showDrawer && classes.drawerPaperClose
        ),
      }}
      open={showDrawer}
    >
      <Button sx={{ width: "100%" }}>
        <Box p={1}>
          <Typography variant="h6">Exported Files</Typography>
          <ExpandMoreIcon />
        </Box>
      </Button>
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

export default FileSideBar;

FileSideBar.propTypes = {
  items: Proptypes.array,
  showDrawer: Proptypes.bool.isRequired,
};
