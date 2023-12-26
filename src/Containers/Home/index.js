import ImportFormDialog from "Components/ImportFormDialog";
import Navbar from "Components/Navbar";
import SideBar from "Components/SideBar";
import FileSideBar from "Components/FileSideBar";
import Vaultdb from "Containers/Vaultdb";
import HomePageLayout from "layouts/HomePageLayout";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Configration from "Configration";
import ErrorBoundary from "Components/ErrorBoundary";
import { AppContextProvider } from "context/AppContext";
import { Storage } from 'aws-amplify';
import { getTablesMetaData, getCataloguesMetaData, addCatalogue } from "utils/vaultdb";

/**
 * Home Component
 *
 * Can have routing logic to render different Layouts/pages
 * for different routes,  devices etc.
 */
const Home = () => {
  // Sidebar State to toggle drawer
  const [showDrawer, setShowDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [tablesData, setTablesData] = useState({});
  const [exportedFilesData, setExportedFilesData] = useState([]);
  const [catalogueData, setCatalogData] = useState([]);

  const { user } = useAuthenticator((context) => [context.user]);

  // Called when a user switches from one catalogue to another
  const getDatabaseTables = async () => {
    const tableData = await getTablesMetaData()
    setTablesData(tableData);
  }

  const addAndFetchCatalogues = async (catalogue) => {
    const result = setCatalogData(await addCatalogue(catalogue));
    console.log(result);

    const tableData = await getCataloguesMetaData();
    setCatalogData(tableData);
  }

  // When the sidebar initially loads, get the test catalogue's tables
  // along with the user's catalogues.
  useEffect(() => {
    async function getMetadata() {
      setTablesData(await getTablesMetaData());
    }

    async function getCatalogues() {
      setCatalogData(await getCataloguesMetaData());
    }

    console.log(user);
    const idToken = user?.signInUserSession?.idToken;
    if (!idToken) console.log("User Does not exists");
    Configration.setUserCredentials(idToken);
    getCatalogues();
    getMetadata();

    // Grab exported files names
    Storage.list('users/' + user.username + '/exported_files/')
      .then((result) => {
        const files = result.results;
        setExportedFilesData(files.slice(1)); // first file listed is an empty, nameless file.
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const toggleRightDrawerState = useCallback(() => {
    setShowRightDrawer((show) => !show);
  }, [setShowRightDrawer]);

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
    //getDatabaseTables();
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
              onFileButtonClick={toggleRightDrawerState}
              onImportButtonClick={openImportDialog}
              showDrawer={showDrawer}
              showRightDrawer={showRightDrawer}
            />
          }
          sideBar={
            <SideBar
              changeCatalog={getDatabaseTables}
              addAndFetchCat={addAndFetchCatalogues}
              showDrawer={showDrawer}
              items={sideBarItems}
              catalogues={catalogueData}
              setShowDrawer={setShowDrawer}
            />
          }
          rightSideBar={
            <FileSideBar
              showDrawer={showRightDrawer}
              items={exportedFilesData}
              setShowDrawer={setShowRightDrawer}
            />
          }
          showDrawer={showDrawer}
          showRightDrawer={showRightDrawer}
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
