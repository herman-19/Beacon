import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import Landing from "../src/components/Landing";
import Dashboard from "../src/components/Dashboard";
import EditProfile from "../src/components/EditProfile";
import Profiles from "../src/components/Profiles";
import NotFound from "../src/components/NotFound";

// function to guard the component for private access
const authGuard = (Component) => () => {
  return localStorage.getItem("token") ? <Component /> : <Redirect to="/" />;
};

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Open Sans", "sans serif"].join(","),
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/dashboard" component={authGuard(Dashboard)} />
          <Route
            exact
            path="/edit-profile"
            component={authGuard(EditProfile)}
          />
          <Route exact path="/profiles" component={authGuard(Profiles)} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
