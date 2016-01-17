import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import fs from 'fs';
// import TreeMenuFacetedNavigation from '../TreeMenuFacetedNavigation';

describe('TreeMenuFacetedNavigation', () => {

  const treeData = JSON.parse(fs.readFileSync('./example/treeData.json', 'utf8'));

  // const shallowRenderer = TestUtils.createRenderer();
  //
  // shallowRenderer.render(<TreeMenuFacetedNavigation data={treeData} />);
  //
  // const renderedOutput = shallowRenderer.getRenderOutput();
  //
  // it('should have a div as container', () => {
  //   expect(renderedOutput.type).to.equal('div');
  // });
  //
  // it('should return something', () => {
  //   let returnSomething = TreeMenuFacetedNavigation.prototype._get('hello!');
  //   expect(returnSomething).to.be.equal('hello!');
  // });

  it('should have a div as container', () => {
    // let o = new FacetNavigationManager();
  });
});

