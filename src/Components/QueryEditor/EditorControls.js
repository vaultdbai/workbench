import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import Paper from "@mui/material/Paper";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import EditableTabs from "Components/EditableTabs";
import MenuButton from "Components/MenuButton";
import {
  EDITOR_TAB_ADD,
  EDITOR_TAB_CHANGE,
  EDITOR_TAB_DELETE,
  noop,
} from "utils/constants/common";
import PropTypes from "prop-types";

// Editor Controls Styles
const useStyles = makeStyles((theme) => ({
  controlsWrapperRootStyles: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgb(254,252,254)",
  },
  editorButton: {
    marginRight: theme.spacing(1),
    minWidth: "fit-content",
  },

  editorButtonsWrapper: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

const EditorControls = ({
  editorTabs = [],
  updateEditorTabs = noop,
  onRunQuery = noop,
  exportButtonDisabled = true,
  activeQuery = ''
}) => {
  const classes = useStyles();

  return (
    <Paper square classes={{ root: classes.controlsWrapperRootStyles }}>
      <EditableTabs
        tabsList={editorTabs}
        onTabAdd={() => updateEditorTabs({ type: EDITOR_TAB_ADD })}
        onTabDelete={(tabId) =>
          updateEditorTabs({ type: EDITOR_TAB_DELETE, data: { id: tabId } })
        }
        onTabChange={(data) => {
          updateEditorTabs({ type: EDITOR_TAB_CHANGE, data });
        }}
      />
      <Box className={classes.editorButtonsWrapper} display="flex">
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<PlayArrowRoundedIcon />}
          className={classes.editorButton}
          onClick={onRunQuery}
        >
          Run Query
        </Button>
        <MenuButton
          disabled={exportButtonDisabled}
          activeQuery={activeQuery}
          title="EXPORT"
          menuItems={["CSV File"/*, "JSON File", "Parquet File", "Excel File"*/]} // TODO: Try to figure out a way to export these kinds of files
        />
      </Box>
    </Paper>
  );
};
export default EditorControls;

EditorControls.propTypes = {
  editorTabs: PropTypes.array,
  updateEditorTabs: PropTypes.func.isRequired,
  onRunQuery: PropTypes.func.isRequired,
  exportButtonDisabled: PropTypes.bool,
  activeQuery: PropTypes.string
};
