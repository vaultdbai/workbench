import { ListItem, ListItemIcon, ListItemText, Typography, Box } from "@mui/material";
import { Storage } from "@mui/icons-material";
import makeStyles from "@mui/styles/makeStyles";
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
}));

const DatabaseSidebarListItem = ({databaseName}) => {

  return (
    <ListItem button component="li" >
      <ListItemIcon>
        <Storage />
      </ListItemIcon>
      <ListItemText>
        <Typography variant="body1">
          <Box
            component="span"
            fontWeight="fontWeightRegular"
          >
            {databaseName}
          </Box>
        </Typography>
      </ListItemText>
    </ListItem>
  )
}

export default DatabaseSidebarListItem;

DatabaseSidebarListItem.propTypes = {
  databaseName: PropTypes.string
}