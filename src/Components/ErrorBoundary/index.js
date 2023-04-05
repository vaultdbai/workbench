import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import React from "react";
import Button from "@mui/material/Button";

/**
 * Error Boundaries can only be class object
 * Takes care of Error thrown by the components
 * Display Fallback UI
 * */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    this.setState(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container>
          <Typography variant="h6">Something went wrong</Typography>
          <Typography variant="h6">Please reload and try again</Typography>
          <Button
            mt={3}
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
