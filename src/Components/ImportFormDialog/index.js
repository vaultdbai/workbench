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
import { DEFAULT_STRINGS } from "utils/constants/common";
import { useState } from "react";
import { invokeLambdaFunction } from "utils/lambdaFunctions";
import { TextField } from "@mui/material";

const useStyles = makeStyles({
  input: {
    display: "none",
  },
});

const ImportFormDialog = (props) => {

  const { showDialog, handleCancelAction, handleSuccessAction } = props;

  // the uploaded file. Contains file content and file metadata including filename
  const [file, setFile] = useState(null);

  // 
  const [tableName, setTableName] = useState('');

  // make sure to remove the uploaded file and clear the table name input when we close the dialog.
  const closeDialog = () => {
    setFile(null)
    setTableName('')
    handleCancelAction()
  }

  const successfullyCloseDialog = () => {
    // simply read the file's content
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;

        if (file.name.endsWith(".sql")) {
          const result = await invokeLambdaFunction("execute-query", fileContent, "query");

          console.log(result)

        }
        else if (file.name.endsWith(".json")) {

          let payload = {};

          const query = "CREATE TABLE " + tableName + " AS SELECT * FROM read_json_auto('/mnt/commitlog/input.json')";
          const fileType = ".json";

          payload["query"] = query;
          payload["fileContent"] = fileContent;
          payload["fileType"] = fileType;

          const result = await invokeLambdaFunction("execute-query", payload, "import-file");

          console.log(result);

        } else if (file.name.endsWith(".csv")) {
          console.log("You uploaded a CSV file.");

          let payload = {};

          const query = "CREATE TABLE " + tableName + " AS SELECT * FROM read_csv_auto('/mnt/commitlog/input.csv')";
          const fileType = ".csv";
          
          payload["query"] = query;
          payload["fileContent"] = fileContent;
          payload["fileType"] = fileType;

          const result = await invokeLambdaFunction("execute-query", payload, "import-file");

          console.log(result);

        } else if (file.name.endsWith(".xml")) {
          console.log("You uploaded an XML document");
        } else {
          console.log("You uploaded a file that we don't comply with...")
        }
      };

      reader.readAsText(file);

      setFile(null);
      setTableName('');
      handleSuccessAction();
    }
  }

  /**
   * Function called when user opens a file in the import dialog
   * @param {the event that triggers when a user opens a file in the import dialog} event 
   */
  const handleFileOpen = (event) => {
    // set the file name on the ImportForm Dialog
    const file = event.target.files[0];
    setFile(file);

  }

  /**
   * Function called when the user types in the Table name TextField
   * @param {the event that triggers when a user types in the Table name TextField} event 
   */
  const handleInputChange = (event) => {
    setTableName(event.target.value);
  }

  const notShowTableNameInput = file === null || file === undefined || file.name.endsWith(".sql");
  const tableNameError = tableName.includes(" ");

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
          {(file === null || file === undefined) ? <Typography> Select File </Typography> : <Typography>{file.name}</Typography>}
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
        {(notShowTableNameInput) ? <Box /> :
          <TextField
            label="Table name"
            value={tableName}
            onChange={handleInputChange}
            error={tableNameError}
            helperText={tableNameError ? "Table name cannot have any spaces" : ""} />}
      </DialogContent>

      {/* Dialog Action Buttons */}
      <DialogActions>
        <Button onClick={closeDialog}>
          {DEFAULT_STRINGS.BUTTON_CANCEL_TEXT}
        </Button>
        {/* Disable the button if there was nothing uploaded or if the file uploaded is not .sql or there is no inputted table name */}
        <Button
          variant="contained"
          onClick={successfullyCloseDialog}
          color="secondary"
          disabled={file === null || file === undefined || (!notShowTableNameInput && tableName.length <= 0) || tableNameError}
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
