import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Landing from "../src/components/Landing";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Landing} />
    </Router>
  );
}

export default App;
