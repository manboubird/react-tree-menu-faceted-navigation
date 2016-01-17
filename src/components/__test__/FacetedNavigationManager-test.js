import { expect } from 'chai';
import fs from 'fs';
import FacetedNavigationManager from '../FacetedNavigationManager';

describe('FacetedNavigationManager', () => {

  const treeData = JSON.parse(fs.readFileSync('./example/treeData.json', 'utf8'));

  it('should have a div as container', () => {
    let o = new FacetedNavigationManager();

    let checkboxEnabledDepth = 3;
    // let items = treeData.items;
    let items = {
          "items": { 
            "A": {
              "_label": "Product A",
              "large-1": {
                "_label": "Large Category 1",
                "middle-3": {
                  "_label": "Middle Category 3",
                  "small-1": {
                    "_label": "Middle Category 3",
                    "_contents": [ { "value": 4 }, { "value": 3} ]
                  },
                  "small-2": [ { "value": 4 }, { "value": 3} ]
                }
              }
            }
          }
    };
    let children = o._itemToTreeMenu(items, checkboxEnabledDepth); 
  });
});

