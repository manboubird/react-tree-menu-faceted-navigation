import React from 'react';
import { render } from 'react-dom';
import TreeMenuFacetedNavigation from './Api';
import packageJSON from '../package.json';


const App = React.createClass({
  render() {
    const name = packageJSON.name;
    const header = `${name} ${packageJSON.version}`;

    return (
      <div>
        <header>
          <h1>{header}</h1>
        </header>
        <section>
          {this.props.children || name}
        </section>
      </div>
    )
  }
});

render((<App />), document.getElementById('content'));
