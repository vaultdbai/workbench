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
import { Button, Collapse, Fab, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
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

const SideBar = ({
  showDrawer = false,
  items = [],
  catalogues = [],
  changeCatalog = () => { },
  addAndFetchCat = () => { }
}) => {
  const classes = useStyles();


  const [selectedCatalogue, setSelectedCatalogue] = useState("test"); // the selected catalogue
  const [isTablesOpen, setIsTablesOpen] = useState(true); // whether or not the Tables dropdown is expanded or not
  const [addCatalogueName, setAddCatalogueName] = useState('');

  // function that gets called when a database list item is clicked
  const handleSelectCatalogue = (event) => {
    setSelectedCatalogue(event.target.value);
    Configuration.setCatalog(event.target.value);
    changeCatalog()
    console.log("Changed catalog to " + Configuration.getCatalog());
  }

  // gets called when Tables button is clicked. Expands or collapses list of current catalogue's tables
  const toggleTableDropdown = () => {
    setIsTablesOpen((value) => !value);
  }

  // gets called whenever the Add catalogue input field has changed
  const handleInputChange = (event) => {
    setAddCatalogueName(event.target.value);
  }

  // gets called when the user enters a valid catalogue name into the input field
  // and clicks the + button
  const addCatalogue = () => {
    addAndFetchCat(addCatalogueName);
    setAddCatalogueName('');
  }

  // Don't accept catalogue name if it already exists and if it includes any punctuation
  let catalogeNameError = false;
  let catalogNameHelperText = "";
  if (catalogues.includes(addCatalogueName)) {
    catalogNameHelperText = "That catalogue already exists";
    catalogeNameError = true;
  } else if (
    addCatalogueName.includes(".") ||
    addCatalogueName.includes("<") ||
    addCatalogueName.includes(">") ||
    addCatalogueName.includes(":") ||
    addCatalogueName.includes("/") ||
    addCatalogueName.includes("\\") ||
    addCatalogueName.includes("|") ||
    addCatalogueName.includes("?") ||
    addCatalogueName.includes("*")
  ) {
    catalogNameHelperText = "Catalogue name cannot include punctuation or special characters";
    catalogeNameError = true;
  } else if (addCatalogueName.length > 50) {
    catalogNameHelperText = "Catalogue name is too long!";
    catalogeNameError = true;
  } else {
    catalogNameHelperText = "";
    catalogeNameError = false;
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
      <Scrollbar style={{ height: "100%" }}>
        {/* Large button labelled Catalogues that opens the list of catalogues */}
        <Stack direction='column' >
          <Button sx={{ width: "100%", marginBottom:"10px" }} disableRipple>
            <Box p={1}>
              <Typography variant="h6">Catalogues</Typography>
            </Box>
          </Button>
          {/* A drop-down that contains the list of catalogues */}
          {catalogues.length === 0 ? (
            <EmptyState
              title={DEFAULT_STRINGS.NO_CATALOGUE_EXIST}
              titleVariant="h6"
              subtitle={DEFAULT_STRINGS.CREATE_NEW_CATALOGUE_MESSAGE} />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="select-catalogue-label">Select Catalogue</InputLabel>
              <Select
                labelId="select-catalogue-label"
                id="select-catalogue"
                value={selectedCatalogue}
                label="Select Catalogue"
                onChange={handleSelectCatalogue}>
                {catalogues.map((catalogue, index) => (
                  <MenuItem
                    key={`${catalogue}-${index}`}
                    value={catalogue}>
                    {catalogue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {/* The text field where a user can add a new catalogue name along with a button to add it */}
          <Box display="flex" alignItems="center" marginTop={1}>
            <TextField
              label="Add catalogue"
              value={addCatalogueName}
              onChange={handleInputChange}
              error={catalogeNameError}
              helperText={catalogNameHelperText}
              sx={{
                '& .MuiFormHelperText-root': {
                  whiteSpace: 'normal' // Wrap helper text to the next line
                }
              }}
            />
            <Fab
              disabled={catalogeNameError || addCatalogueName.length <= 0}
              size="small"
              sx={{ padding: "20px" }}
              onClick={addCatalogue}>
              <AddIcon></AddIcon>
            </Fab>
          </Box>
          {/* Large button that opens the list of the current catalogue's tables */}
          <Button onClick={toggleTableDropdown} sx={{ width: "100%", marginTop: "50px" }}>
            <Box p={1}>
              <Typography variant="h6">Tables</Typography>
              <ExpandMoreIcon />
            </Box>
          </Button>

          {/* Contains the list of tables of the current catalogue */}
          <Collapse in={isTablesOpen} unmountOnExit>
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
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

export default SideBar;

SideBar.propTypes = {
  items: Proptypes.array,
  showDrawer: Proptypes.bool.isRequired,
  catalogues: Proptypes.array
};
