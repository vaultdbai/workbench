import Avatar from "@mui/material/Avatar";
import { stringAvatar, stringToColor } from "Components/Navbar";
import { AccountSettings, Authenticator } from "@aws-amplify/ui-react";
import { Container, Typography } from "@mui/material";


const handleChangePasswordSuccess = () => {
  alert('Password is successfully changed!')
}

const ProfilePage = (props) => {
  return (
    <>
      <Container maxWidth="md" sx={{ paddingTop: "100px" }}>

        <Authenticator>
          {({ signOut, user }) => (
            <>
              <Avatar {...stringAvatar(user.username)} sx={{
                width: 150, height: 150, fontSize: 100, bgcolor: stringToColor(user.username), "&:hover": {
                  bgcolor: "gray"
                }
              }} />
              <Typography variant="h3" sx={{ paddingTop: "10px" }}>{user.username}</Typography>
            </>
          )}
        </Authenticator>
        <Typography variant="h3" mt={4} mb={2}>Change Password</Typography>
        <AccountSettings.ChangePassword onSuccess={handleChangePasswordSuccess} />
      </Container>
    </>
  )
};

export default ProfilePage;