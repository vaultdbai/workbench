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

const useStyles = makeStyles({
  input: {
    display: "none",
  },
});

const ImportFormDialog = (props) => {

  const { showDialog, handleCancelAction, handleSuccessAction } = props;

  const [file, setFile] = useState(null);

  // make sure to remove the file name if we close the window.
  const closeDialog = () => {
    setFile(null)
    handleCancelAction()
  }

  const successfullyCloseDialog = () => {
    // simply read the file's content
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;

        if (file.name.endsWith(".sql")) {
          const result = await invokeLambdaFunction("execute-query", fileContent);

          console.log(result)

        }
        else if (file.name.endsWith(".json")) {
          console.log("You uploaded a JSON file");

          // first convert the text into a JavaScript Object
          const data = JSON.parse(fileContent);

          // next create the two SQL statements, one to create the table, the other to insert the data.
          // We will go through all the data once
          let headers = [];
          let headerDataType = [];

          let insertValuesSQL = 'INSERT INTO ktest VALUES ';
          let headerInputMode = true; // whether or not we are iterating the first row which is the header row.
          for (let row in data) {
            let i = 0;
            if (!headerInputMode) {
              insertValuesSQL += "( "
            }
            for (let col in data[row]) {
              if (headerInputMode) {
                headers.push(data[row][col])
              }
              else {

                // figure out the data types for the CREATE TABLE query and add the values into the 
                // INSERT VALUES query
                const dataType = typeof data[row][col];
                if (dataType === "number") {
                  if (Number.isInteger(data[row][col])) {
                    headerDataType[i] = "int"
                  } else {
                    headerDataType[i] = "decimal(30,10)"
                  }
                  insertValuesSQL += data[row][col] + ","
                } else if (dataType === "string") {
                  headerDataType[i] = "varchar"
                  insertValuesSQL += "'" + data[row][col] + "',"
                } else {
                  insertValuesSQL += "NULL,"
                  if (!headerDataType[i]) {
                    headerDataType[i] = "varchar"
                  }
                  console.log("Null value inserted")
                }
              }
              i++
            }

            // since it is the end of the row, we instead replace the ending
            // of the query with a ), instead of a ,
            if (!headerInputMode) {

              insertValuesSQL = insertValuesSQL.substring(0, insertValuesSQL.length - 1)
              insertValuesSQL += "),"
            }
            

            // now we are onto the data rows so we are not detecting any more headers.
            headerInputMode = false
          }

          // at the end, replace the ending comma with a semicolon
          insertValuesSQL = insertValuesSQL.substring(0, insertValuesSQL.length - 1)
          insertValuesSQL += ";";

          // now create the CREATE TABLE sql statement
          let createTableSQL = "CREATE TABLE ktest(";
          for (let i = 0; i < headers.length; i++) {
            createTableSQL += headers[i] + " " + headerDataType[i] + ",";
          }

          // remove the ending comma and add ");"
          createTableSQL = createTableSQL.substring(0, createTableSQL.length - 1)
          createTableSQL += ");"

          const result = await invokeLambdaFunction("execute-query", createTableSQL + insertValuesSQL);

          console.log(result)

        } else if (file.name.endsWith(".csv")) {
          console.log("You uploaded a CSV file.");
        } else if (file.name.endsWith(".xml")) {
          console.log("You uploaded an XML document");
        } else {
          console.log("You uploaded a file that we don't comply with...")
        }
      };

      reader.readAsText(file);

      setFile(null)
      handleSuccessAction()
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
      </DialogContent>

      {/* Dialog Action Buttons */}
      <DialogActions>
        <Button onClick={closeDialog}>
          {DEFAULT_STRINGS.BUTTON_CANCEL_TEXT}
        </Button>
        {/* Disable the button if there was nothing uploaded */}
        {(file === null || file === undefined) ?
          <Button
            variant="contained"
            onClick={successfullyCloseDialog}
            color="secondary"
            disabled
          >
            {DEFAULT_STRINGS.BUTTON_UPLOAD_TEXT}
          </Button> :
          <Button
            variant="contained"
            onClick={successfullyCloseDialog}
            color="secondary"
          >
            {DEFAULT_STRINGS.BUTTON_UPLOAD_TEXT}
          </Button>}
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
