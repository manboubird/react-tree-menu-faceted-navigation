import invariant from 'invariant';
import _ from 'lodash';

const META_ITEM_KEY_CONTENTS = "contents"
const META_ITEM_KEY_LABEL = "label"
const META_ITEM_KEY_CHILDREN = "children"
const META_ITEM_KEYS = [META_ITEM_KEY_LABEL, META_ITEM_KEY_CONTENTS, META_ITEM_KEY_CHILDREN]

export default class FacetNavigationManager {

  constructor(meta, items) {
    let enabledCheckboxDepth = 3; // The depth shallower than this threshhold have checkbox
    this.treeMenu = this._itemToTreeMenu(items, enabledCheckboxDepth);
    // console.log("treeMenu", JSON.stringify(this.treeMenu, '  ', 2));
  }

  _itemToTreeMenu(items, checkboxEnabledDepth) {
    let rootDepthCount = 1;
    let options = {
      checkboxEnabledDepth: checkboxEnabledDepth,
      displayChildTotalValue: true
    };
    return this._createChildren(items, rootDepthCount, options);
  }

  // _processContents(labelVjisCheckboxEnabled) {
  //    let children = {};
  //    let total = _.reduce([0].concat(_.pluck(value, 'value')),
  //      (total, n) => { return total + n; }
  //    );
  //    children[key] = {
  //      label: label,
  //      childValueTotal: total
  //    };
  //    if(isCheckboxEnabled) {
  //      children[key]['checked'] = true;
  //      children[key]['checkbox'] = true;
  //    }
  //    return children;
  // }

  _createMeta(items, depth, options) {
    let children = {};
    _.forEach(items, (value, key) => {
      if(key == META_ITEM_KEY_CHILDREN) {

      }else if(key == META_ITEM_KEY_LABEL) {
        let label = value[META_ITEM_KEY_LABEL] : parentKey;
        if(options.displayChildTotalValue) {
          label = label.concat(` (${total})`);
        } 
      }else if(key == META_ITEM_KEY_CONTENTS) {

      }else{
        invariant(false, "ERR"); 
      }
    });
    return children;
  }

  /**
   * Create tree menu data from facted navigation format data
   * @param items 
   * @param depth 
   * @param options 
   * @returns {*}
   * @private
   */
  _createChildren(items, depth, options = {checkboxEnabledDepth: 1, displayChildTotalValue: true}, isChildren = true) {
    let isCheckboxEnabled = depth <= options.checkboxEnabledDepth;
    let children = {};
    _.forEach(items, (value, key) => {
      if(_.contains(META_ITEM_KEYS, key)) {
        console.log(`meta key = ${key}`);
      } else if(_.isArray(value)) {

        let total = _.reduce([0].concat(_.pluck(value, 'value')),
          (total, n) => { return total + n; }
        );
        let label = META_ITEM_KEY_LABEL in value ? value[META_ITEM_KEY_LABEL] : key;
        if(options.displayChildTotalValue) {
          label.concat(` (${total})`);
        } 
        children[key] = {
          label: label,
          childValueTotal: total
        };
        if(isCheckboxEnabled) {
          children[key]['checked'] = true;
          children[key]['checkbox'] = true;
        }

      } else if(_.isPlainObject(value)) {

        let total = 0;

        let label = META_ITEM_KEY_LABEL in value ? value[META_ITEM_KEY_LABEL] : key;
        if(options.displayChildTotalValue) {
          label =label.concat(` (${total})`);
        } 

        if(META_ITEM_KEY_CONTENTS in value) {
          total = _.reduce([0].concat(_.pluck(value[META_ITEM_KEY_CONTENTS], 'value')),
            (total, n) => { return total + n; }
          );
          children[key] = {label: label, childValueTotal: total };
        } else { 
          let myChild = this._createChildren(value, depth + 1, options);
          total = _.reduce([0].concat(_.pluck(myChild, 'childValueTotal')), 
            (total, n) => { return total + n; }
          );
          children[key] = {label: label, childValueTotal: total, children: myChild};
        }


        // children[key].label = label;
        // children[key].childValueTotal = total;

        if(isCheckboxEnabled) {
          children[key]['checked'] = true;
          children[key]['checkbox'] = true;
        }

      } else {
        invariant(_.isArray(value) || _.isPlainObject(value),
                  "Illegal items types");
      }
    });
    return children;
  }
  // _createChildren(items, depth, options = {checkboxEnabledDepth: 1, displayChildTotalValue: true}) {
  //   let isCheckboxEnabled = depth <= options.checkboxEnabledDepth;
  //   let children = {};
  //   _.forEach(items, (value, key) => {
  //     if(_.contains(META_ITEM_KEYS, key)) {
  //       console.log(`meta key = ${key}`);
  //     } else if(_.isArray(value)) {
  //
  //       let total = _.reduce([0].concat(_.pluck(value, 'value')),
  //         (total, n) => { return total + n; }
  //       );
  //       let label = META_ITEM_KEY_LABEL in value ? value[META_ITEM_KEY_LABEL] : key;
  //       if(options.displayChildTotalValue) {
  //         label.concat(` (${total})`);
  //       } 
  //       children[key] = {
  //         label: label,
  //         childValueTotal: total
  //       };
  //       if(isCheckboxEnabled) {
  //         children[key]['checked'] = true;
  //         children[key]['checkbox'] = true;
  //       }
  //
  //     } else if(_.isPlainObject(value)) {
  //
  //       let total = 0;
  //
  //       let label = META_ITEM_KEY_LABEL in value ? value[META_ITEM_KEY_LABEL] : key;
  //       if(options.displayChildTotalValue) {
  //         label =label.concat(` (${total})`);
  //       } 
  //
  //       if(META_ITEM_KEY_CONTENTS in value) {
  //         total = _.reduce([0].concat(_.pluck(value[META_ITEM_KEY_CONTENTS], 'value')),
  //           (total, n) => { return total + n; }
  //         );
  //         children[key] = {label: label, childValueTotal: total };
  //       } else { 
  //         let myChild = this._createChildren(value, depth + 1, options);
  //         total = _.reduce([0].concat(_.pluck(myChild, 'childValueTotal')), 
  //           (total, n) => { return total + n; }
  //         );
  //         children[key] = {label: label, childValueTotal: total, children: myChild};
  //       }
  //
  //
  //       // children[key].label = label;
  //       // children[key].childValueTotal = total;
  //
  //       if(isCheckboxEnabled) {
  //         children[key]['checked'] = true;
  //         children[key]['checkbox'] = true;
  //       }
  //
  //     } else {
  //       invariant(_.isArray(value) || _.isPlainObject(value),
  //                 "Illegal items types");
  //     }
  //   });
  //   return children;
  // }
}
