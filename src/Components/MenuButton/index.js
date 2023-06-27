import React from "react";
import useMenuStyles from "./menuStyles";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { noop } from "utils/constants/common";
import PropTypes from "prop-types";

const MenuButton = ({ title = "", menuItems = [], onMenuItemClick = noop, disabled = true }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useMenuStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item) => {
    onMenuItemClick(item);
    console.log(item);
    handleClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        className={classes.button}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
      >
        <GetAppRoundedIcon className={classes.downloadIcon} />
        <span>{title}</span>
        <ExpandMoreIcon
          className={anchorEl ? classes.upIcon : classes.downIcon}
        />
      </Button>
      {/*  menu items for Menu Button */}
      <Menu
        id="simple-menu"
        aria-label="export data menu"
        classes={{ paper: classes.paper }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((menuItem, index) => (
          <MenuItem
            key={`menuitem-${title}-${index}`}
            onClick={() => handleMenuItemClick(menuItem)}
          >
            {menuItem}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuButton;

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
  onMenuItemClick: PropTypes.func,
  disabled: PropTypes.bool
};
