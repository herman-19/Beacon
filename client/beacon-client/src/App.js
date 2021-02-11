import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Landing from "../src/components/Landing";
import Dashboard from "../src/components/Dashboard";
import NotFound from "../src/components/NotFound";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
