import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EditorLoader = () => {
  return (
    <Box
      display="flex"
      height="140px"
      alignItems="center"
      justifyContent="center"
    >
      <Typography>Setting up Editor, Please Wait ...</Typography>
    </Box>
  );
};

export default EditorLoader;
