import React from 'react';
import { render } from 'react-dom';
import Api, { TreeMenuFacetedNavigation } from './Api';
import packageJSON from '../package.json';
import TreeDataJSON from '../example/TreeData.json';


// cosnt ReactFragment = [ TreeMenuFacetedNavigation ];

/**
 * Application component
 */
class App extends React.Component {

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

const Root = document.getElementById('content');
render(<App />, Root);
