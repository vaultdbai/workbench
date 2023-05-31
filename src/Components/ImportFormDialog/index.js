import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "Components/CustomDialog";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { DEFAULT_STRINGS, noop } from "utils/constants/common";
import { useCallback, useState } from "react";

const useStyles = makeStyles({
  input: {
    display: "none",
  },
});

const ImportFormDialog = (props) => {

  const { showDialog, handleCancelAction, handleSuccessAction } = props;

  const [file, setFile] = useState("");

  // make sure to remove the file name if we close the window.
  const closeDialog = useCallback(() => {
    setFile(null)
    handleCancelAction()
  }, [setFile])

  const successfullyCloseDialog = useCallback(() => {
    setFile(null)
    handleSuccessAction()
  }, [setFile])

  /**
   * Function called when user opens a file in the import dialog
   * @param {the event that triggers when a user opens a file in the import dialog} event 
   */
  const handleFileOpen = (event) => {
    // set the file name on the ImportForm Dialog
    const file = event.target.files[0];
    setFile(file);

    // simply read the file's content
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        // Do something with the file content
        console.log(fileContent)
      };

      reader.readAsText(file);
    }
  }

  const classes = useStyles();
  return (
    <Dialog
      open={showDialog}
      onClose={closeDialog}
      aria-labelledby="import-data-form-dialog-title"
    >
      {/* Title Section */}
      <DialogTitle
        id="import-data-form-dialog-title"
        onClose={closeDialog}
      >
        {DEFAULT_STRINGS.IMPORT_DATA_DIALOG_TITLE}
      </DialogTitle>

      {/* Dialog Content Area */}
      <DialogContent dividers>
        <Typography>{DEFAULT_STRINGS.IMPORT_DATA_HELP_TEXT}</Typography>
        <Box
          display="flex"
          my={3}
          justifyContent="space-between"
          alignItems="center"
        >
          {file === null ? <Typography> Select File </Typography> : <Typography>{file.name}</Typography>}
          <label htmlFor="file-upload">
            <input
              accept=".csv, .sql, .json, .xml"
              className={classes.input}
              id="file-upload"
              type="file"
              onChange={handleFileOpen}
            />
            <Button variant="outlined" color="secondary" component={"span"}>
              {DEFAULT_STRINGS.BUTTON_OPEN_TEXT}
            </Button>
          </label>
        </Box>
      </DialogContent>

      {/* Dialog Action Buttons */}
      <DialogActions>
        <Button onClick={closeDialog}>
          {DEFAULT_STRINGS.BUTTON_CANCEL_TEXT}
        </Button>
        <Button
          variant="contained"
          onClick={successfullyCloseDialog}
          color="secondary"
        >
          {DEFAULT_STRINGS.BUTTON_UPLOAD_TEXT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportFormDialog;

ImportFormDialog.propTypes = {
  showDialog: PropTypes.bool,
  handleCancelAction: PropTypes.func.isRequired,
  handleSuccessAction: PropTypes.func.isRequired,
};
