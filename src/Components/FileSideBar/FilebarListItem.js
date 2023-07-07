import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Button, Container, Stack } from "@mui/material";
import { ContentCopy, Download, Margin } from "@mui/icons-material";
import { Storage } from 'aws-amplify';

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
    textOverflow: 'ellipsis'
  }
}));

//  Collapsible ListItem Component for  SideBar
const FilebarListItem = ({ listItem, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const toggleListItem = () => {
    setIsOpen((value) => !value);
  };
  const { eTag, key, lastModified } = listItem;
  const fileFolders = key.split("/");
  const fileName = fileFolders[fileFolders.length - 1];

  let fileURI = 's3://' + window.S3_BUCKET_NAME + "/public/" + key;

  // copies the S3 URI to the clipboard
  const copyURI = () => {
    navigator.clipboard.writeText(fileURI);
    console.log(lastModified);
  }

  // Downloads the file to the user's browser
  const handleDownload = async () => {
    try {
      const url = await Storage.get(key);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      <ListItem title={fileName} button component="li" onClick={toggleListItem}>
        <ListItemIcon>
          {icon ? icon : <InsertDriveFileIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText className={classes.tableNameText}>
          <Typography variant="body1">
            <Box
              component="span"
              fontWeight={isOpen ? "fontWeightBold" : "fontWeightRegular"}
            >
              {fileName}
            </Box>
          </Typography>
        </ListItemText>
        {isOpen ? <ExpandMoreIcon /> : <ChevronLeftIcon />}
      </ListItem>
      <Collapse component="li" in={isOpen} timeout="auto" unmountOnExit>
        <Typography variant="caption" sx={{ whiteSpace: 'normal' }}>
          {"S3 Path: s3/public/" + key}
        </Typography>
        <Container sx={{ height: "10px" }} />
        <Stack spacing={1} alignContent="center" alignItems="center">
          <Button onClick={copyURI} variant="contained" sx={{ width: "150px" }}>
            <ContentCopy />
            Copy S3 URI
          </Button>
          <Button onClick={handleDownload} variant="contained" sx={{ width: "150px" }}>
            <Download />
            Download
          </Button>
        </Stack>
        <Container sx={{ height: "15px" }} />
      </Collapse>
    </>
  );
};

export default FilebarListItem;

FilebarListItem.propTypes = {
  listItem: PropTypes.object.isRequired,
  icon: PropTypes.element,
};