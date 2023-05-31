import ImportFormDialog from "Components/ImportFormDialog";
import Navbar from "Components/Navbar";
import SideBar from "Components/SideBar";
import Vaultdb from "Containers/Vaultdb";
import HomePageLayout from "layouts/HomePageLayout";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Configration from "Configration";
import ErrorBoundary from "Components/ErrorBoundary";
import { AppContextProvider } from "context/AppContext";
import { getTablesMetaData } from "utils/vaultdb";

/**
 * Home Component
 *
 * Can have routing logic to render different Layouts/pages
 * for different routes,  devices etc.
 */
const Home = () => {
  // Sidebar State to toggle drawer
  const [showDrawer, setShowDrawer] = useState(true);
  const [tablesData, setTablesData] = useState({});
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    async function getMetadata() {
      setTablesData(await getTablesMetaData());
    }
    // Configure application
    Configration.configure(
      window.APPLICATION_NAME,
      window.REGION,
      window.USER_POOL_ID,
      window.USER_POOL_APP_CLIENT_ID,
      window.USER_IDENTITY_POOL_ID
    );
    console.log(user);
    const idToken = user?.signInUserSession?.idToken;
    if (!idToken) console.log("User Does not exists");
    Configration.setUserCredentials(idToken);
    getMetadata();
  }, [user]);

  const toggleDrawerState = useCallback(() => {
    setShowDrawer((show) => !show);
  }, [setShowDrawer]);

  // State to toggle Import Data Dialog
  const [showImportDialog, setShowImportDialog] = useState(false);

  const closeImportDialog = () => {
    setShowImportDialog(false);
  };

  const openImportDialog = () => {
    setShowImportDialog(true);
  }

  const handleImportDialogSuccess = () => {
    console.log("Success on Import dialog")
    setShowImportDialog(false);
  };

  // creates list of sidebars items to be shown
  // returns Array of tables metadata info
  const sideBarItems = useMemo(
    () =>
      Object.keys(tablesData).map(
        (tableName) => tablesData[tableName].metaData
      ),
    [tablesData]
  );

  return (
    <ErrorBoundary>
      <AppContextProvider value={{ tablesData: tablesData }}>
        <HomePageLayout
          navBar={
            <Navbar
              onMenuButtonClick={toggleDrawerState}
              onImportButtonClick={openImportDialog}
              showDrawer={showDrawer}
            />
          }
          sideBar={
            <SideBar
              showDrawer={showDrawer}
              items={sideBarItems}
              setShowDrawer={setShowDrawer}
            />
          }
          showDrawer={showDrawer}
        >
          {/* Content  for the Home page*/}
          <Vaultdb />
          <ImportFormDialog
            showDialog={showImportDialog}
            handleCancelAction={closeImportDialog}
            handleSuccessAction={handleImportDialogSuccess}
          />
        </HomePageLayout>
      </AppContextProvider>
    </ErrorBoundary>
  );
};

export default Home;
