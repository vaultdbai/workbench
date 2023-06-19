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
import { useState } from "react";
import { Button, Collapse } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Configuration from "Configration";

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

const SideBar = ({ showDrawer = false, items = [], changeCatalog = () => {} }) => {
  const classes = useStyles();


  const [selectedItem, setSelectedItem] = useState(null); // the selected catalogue
  const [isOpen, setIsOpen] = useState(false); // whether or not the Catalogues dropdown is expanded or not
  const [isTablesOpen, setIsTablesOpen] = useState(true); // whether or not the Tables dropdown is expanded or not

  // function that gets called when a database list item is clicked
  const handleItemClick = (item) => {
    setSelectedItem(item);
    Configuration.setCatalog(item);
    Configuration.setSchema(item);
    changeCatalog()
    console.log("Changed catalog to " + Configuration.getCatalog());
  }

  const toggleCatalogueDropdown = () => {
    setIsOpen((value) => !value);
  }

  const toggleTableDropdown = () => {
    setIsTablesOpen((value) => !value);
  }

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
      <Button onClick={toggleCatalogueDropdown}>
        <Box p={1}>
          <Typography variant="h6">Catalogues</Typography>
          <ExpandMoreIcon />
        </Box>
      </Button>
      <Collapse in={isOpen}>
        <List>
          <DatabaseSidebarListItem
            selected={selectedItem === "item1"}
            item="item1"
            onItemClick={handleItemClick}
            databaseName="Database 1" />
          <DatabaseSidebarListItem
            databaseName="Database 2"
            selected={selectedItem === "item2"}
            item="item2"
            onItemClick={handleItemClick} />
          <DatabaseSidebarListItem
            databaseName="Database I don't know maybe something really long"
            selected={selectedItem === "item3"}
            item="item3"
            onItemClick={handleItemClick} />
        </List>
      </Collapse>
      <Button onClick={toggleTableDropdown}>
        <Box p={1}>
          <Typography variant="h6">Tables</Typography>
          <ExpandMoreIcon/>
        </Box>
      </Button>
      <Collapse in={isTablesOpen}>
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
      </Collapse>
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
