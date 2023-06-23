import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ListSubheader from "@mui/material/ListSubheader";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { DEFAULT_STRINGS } from "utils/constants/common";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  primaryTextColor: {
    color: theme.palette.text.primary,
  },
  columnNameText: {
    paddingLeft: theme.spacing(1),
    overflowX: "hidden",
    textOverflow: "ellipsis",
  },
  tableNameText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'elllipsis'
  }
}));

//  Collapsible ListItem Component for  SideBar
const SidebarListItem = ({ listItem, subtitle, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const toggleListItem = () => {
    setIsOpen((value) => !value);
  };
  const { tableName, columns } = listItem;

  return (
    <>
      <ListItem title={tableName} button component="li" onClick={toggleListItem}>
        <ListItemIcon>
          {icon ? icon : <TableChartOutlinedIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText className={classes.tableNameText}>
          <Typography variant="body1">
            <Box
              component="span"
              fontWeight={isOpen ? "fontWeightBold" : "fontWeightRegular"}
            >
              {tableName}
            </Box>
          </Typography>
        </ListItemText>
        {isOpen ? <ExpandMoreIcon /> : <ChevronLeftIcon />}
      </ListItem>
      <Collapse component="li" in={isOpen} timeout="auto" unmountOnExit>
        <List
          component="ul"
          disablePadding
          subheader={
            <ListSubheader
              className={clsx(classes.nested, classes.primaryTextColor)}
            >
              {subtitle || DEFAULT_STRINGS.HEADING_COLUMNS}
            </ListSubheader>
          }
          className={classes.nested}
        >
          {columns.map((column, index) => (
            <ListItem dense key={`${tableName}-${column.name}-${index}-column`}>
              <ViewColumnIcon />
              <Tooltip
                title={`${column.name} ${
                  column.type ? " (" + column.type + ")" : ""
                } `}
              >
                <ListItemText className={classes.columnNameText}>
                  <Typography variant="subtitle2" component="span">
                    {column.name}
                  </Typography>
                  {column.type && (
                    <Typography variant="caption">{` (${column.type})`}</Typography>
                  )}
                </ListItemText>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SidebarListItem;

SidebarListItem.propTypes = {
  listItem: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.element,
};
