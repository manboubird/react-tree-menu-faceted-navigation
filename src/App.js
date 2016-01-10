import React, { Component } from 'react';
import { TreeMenuFacetedNavigation } from './Api';
import packageJSON from '../package.json';
import TreeDataJSON from '../example/TreeData.json';


/**
 * Application component
 */
class App extends Component {

  constructor() {
    super();
    this.state = {
      treeData: TreeDataJSON
    };
  }

  /**
   * render application
   */
  render() {
    const name = packageJSON.name;
    const header = `${name} ${packageJSON.version}`;
    return (
      <div>
        <header>
          <h1>{header}</h1>
        </header>
        <div>
          <TreeMenuFacetedNavigation data={this.state.treeData} />
        </div>
      </div>
    )
  }
}

export default App
