import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppBarHeader from '../components/AppBarHeader'
import GenerateReport from '../components/GenerateReport';
import MyResources from '../components/MyResources';

const AppRouter = () => (
    <BrowserRouter>
      <div>
        <AppBarHeader />
        <Switch>
          <Route exact={true} path="/" component={GenerateReport}/>
          <Route exact={true} path="/generatereport" component={GenerateReport}/>
          <Route exact={true} path="/myresources" component={MyResources} />                    
        </Switch>
      </div>
    </BrowserRouter>
  );
  
  export default AppRouter;