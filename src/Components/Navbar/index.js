import * as React from "react";
import {Link} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import PublishIcon from "@mui/icons-material/Publish";
import { DEFAULT_STRINGS, noop, DRAWER_WIDTH } from "utils/constants/common";
import PropTypes from "prop-types";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";

// Navbar styles
const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    borderRadius: 0,
    marginRight: theme.spacing(1),
  },
  navTitle: {
    flexGrow: 1,
  },
}));

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}`,
  };
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar = ({
  onMenuButtonClick = noop,
  onImportButtonClick = noop,
  showDrawer = true,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [avatarImage, setAvatarImage] = React.useState(null);

  React.useEffect(() => {
    fetchAvatarImage();
  }, []);

  /** 
   * Calling the AWS Database to get the avatar image of the 
   * user and putting it on the profile page. Called when we
   * reload/load the page and when an avatar image is 
   * uploaded  
   * */
  const fetchAvatarImage = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const avatarImageUrl = await Storage.get("avatars/"+ user.username + '/avatar.jpg');
      setAvatarImage(avatarImageUrl);
    } catch (error) {
      console.log('Error fetching avatar image:', error);
    }
  };

  return (
    <AppBar position="absolute" className={classes.appBar} open={showDrawer}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          onClick={onMenuButtonClick}
          disableRipple
          edge="start"
          aria-label="sidebar menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          className={classes.navTitle}
          color="textPrimary"
          variant="h6"
        >
          {DEFAULT_STRINGS.APP_TITLE}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<PublishIcon />}
          onClick={onImportButtonClick}
        >
          {DEFAULT_STRINGS.IMPORT_DATA}
        </Button>
        <Authenticator>
          {({ signOut, user }) => (
            <React.Fragment>
              <IconButton sx={{ paddingLeft: 2 }} onClick={handleClick}>
                <Avatar src={avatarImage} alt="Avatar" {...stringAvatar(user.username)} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Link to="/profile">
                  <MenuItem>
                    <Avatar/> Profile
                  </MenuItem>
                </Link>
                <MenuItem onClick={signOut}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </Authenticator>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

Navbar.propTypes = {
  onMenuButtonClick: PropTypes.func.isRequired,
  onImportButtonClick: PropTypes.func.isRequired,
  showDrawer: PropTypes.bool.isRequired,
};
