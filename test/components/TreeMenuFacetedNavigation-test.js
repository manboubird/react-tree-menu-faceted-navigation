import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import TreeMenuFacetedNavigation from '../../src/components/TreeMenuFacetedNavigation';

describe('TreeMenuFacetedNavigation', () => {

  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(<TreeMenuFacetedNavigation />);
  const renderedOutput = shallowRenderer.getRenderOutput();

  it('should have a div as container', () => {
    expect(renderedOutput.type).to.equal('div');
  });

  it('should return something', () => {
    let returnSomething = TreeMenuFacetedNavigation.prototype._get('hello!');
    expect(returnSomething).to.be.equal('hello!');
  });

});

