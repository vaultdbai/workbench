import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import Avatar from "@mui/material/Avatar";
import { stringAvatar, stringToColor } from "Components/Navbar";
import { AccountSettings, Authenticator } from "@aws-amplify/ui-react";
import { Button, CardContent, Container, Typography, Card, Divider } from "@mui/material";
import { FirstPage } from "@mui/icons-material";
import ImageIcon from '@mui/icons-material/Image';
import { Storage } from 'aws-amplify';
import { Auth } from 'aws-amplify';




const handleChangePasswordSuccess = () => {
  alert('Password is successfully changed!')
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  input: {
    display: 'none',
  },
}));

const ProfilePage = (props) => {

  const classes = useStyles();
  const [avatarImage, setAvatarImage] = useState(null);

  useEffect(() => {
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
      const avatarImageUrl = await Storage.get("users/" + user.username + '/avatar.jpg');
      setAvatarImage(avatarImageUrl);
    } catch (error) {
      console.log('Error fetching avatar image:', error);
    }
  };

  /**
   * Handles when an image get's uploaded. We try to store
   * the image into the database and and try to fetch it and set it
   * to the avatar.
   */
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const user = await Auth.currentAuthenticatedUser();

    try {
      await Storage.put("users/" + user.username + '/avatar.jpg', file, {
        contentType: 'image/jpeg',
      });
      fetchAvatarImage();
    } catch (error) {
      console.log('Error uploading avatar image:', error);
    }
  };
  return (
    <>
      {/* The back button for the user to go back to the workbench */}
      <Container maxWidth="md" sx={{ paddingTop: "50px" }}>
        <Link to="/">
          <Button variant="contained" startIcon={<FirstPage fontSize="large" />}>
            RETURN TO WORKBENCH
          </Button>
        </Link>
      </Container>
      <Container maxWidth="md" sx={{ paddingTop: "100px" }}>

        {/* The avatar and the name of the user along with a button to upload an avatar image */}
        <Authenticator>
          {({ signOut, user }) => (
            <Card>
              <CardContent>
                <Container sx={{ padding: "50px" }}>
                  <Avatar src={avatarImage} alt="Avatar" {...stringAvatar(user.username)} sx={{
                    width: 150, height: 150, fontSize: 100, bgcolor: stringToColor(user.username), "&:hover": {
                      bgcolor: "gray"
                    }
                  }} />

                  <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px" }}>{user.username}</Typography>
                  <Divider />
                  <Typography variant="h6" component="h2" sx={{ paddingTop: "10px" }} gutterBottom>
                    Upload Avatar
                  </Typography>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="upload-avatar"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="upload-avatar">
                    <Button variant="contained" component="span" startIcon={<ImageIcon />}>
                      Choose Image
                    </Button>
                  </label>
                </Container>
              </CardContent>
            </Card>
          )}
        </Authenticator>

        <Container sx={{ paddingTop: "20px" }} />

        {/* A place to change the user's password */}
        <Card>
          <CardContent>
            <Typography variant="h3" mb={2}>Change Password</Typography>
            <AccountSettings.ChangePassword onSuccess={handleChangePasswordSuccess} />
          </CardContent>
        </Card>

      </Container>
    </>
  )
};

export default ProfilePage;