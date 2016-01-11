import React from 'react';
import invariant from 'invariant';
import _ from 'lodash';
import Immutable from 'immutable';
import TreeMenu, { TreeNode } from 'react-tree-menu';

require('react-tree-menu/example/tree-view.css');
require('bootstrap/dist/css/bootstrap.css');
require('font-awesome/css/font-awesome.css');


class FacetNavigationManager {

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

  /**
   * Create tree menu data from facted navigation format data
   * @param items 
   * @param depth 
   * @param options 
   * @returns {*}
   * @private
   */
  _createChildren(items, depth, options = {checkboxEnabledDepth: 1, displayChildTotalValue: true}) {
    let isCheckboxEnabled = depth <= options.checkboxEnabledDepth;
    let children = {};
    _.forEach(items, (value, key) => {
      if(_.isArray(value)) {

        let total = _.reduce([0].concat(_.pluck(value, 'value')),
          (total, n) => { return total + n; }
        );
        let label = options.displayChildTotalValue ? `${key} (${total})` : key
        children[key] = {
          label: label,
          childValueTotal: total
        };
        if(isCheckboxEnabled) {
          children[key]['checked'] = true;
          children[key]['checkbox'] = true;
        }

      } else if(_.isPlainObject(value)) {

        let myChild = this._createChildren(value, depth + 1, options);
        let total = _.reduce([0].concat(_.pluck(myChild, 'childValueTotal')), 
          (total, n) => { return total + n; }
        );
        let label = options.displayChildTotalValue ? `${key} (${total})` : key
        children[key] = {
          children: myChild,
          label: label,
          childValueTotal: total
        };
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
}

/**
 * TreeMenuFacetedNavigation
 *
 * @type {TreeMenuFacetedNavigation}
 */
class TreeMenuFacetedNavigation extends React.Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    invariant(this.props.data.meta && this.props.data.items,
      "Both meta and items props are expected in TreeMenuFacetedNavigation");

    let {meta, items} = this.props.data;

    this.naviMgr = new FacetNavigationManager(meta, items);

    // console.log("treeMenu", JSON.stringify(this.naviMgr.treeMenu, '  ', 2));

    this.state = {
      mainTreeData: this.naviMgr.treeMenu,
      mainTreeLastAction: {}
    };
  }

  /**
   * render application
   */
  render(){

    let dynamicTreeMenu = this._getPanel("Faceted Tree Menu", this._getTreeMenu());
    return (
      <div>
        <div className="row">
          <div className="col-lg-3">
            <h2>Faceted Tree Menu</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            {dynamicTreeMenu}
          </div>
          <div className="col-lg-6">
            <pre>{JSON.stringify(this.state, '  ', 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  _getTreeMenu() {
    let stateKeyLastActionPrefix = "mainTree";
    let stateKeyData = "mainTreeData";
      //<div
    return (
      <TreeMenu
        expandIconClass="fa fa-chevron-right"
        collapseIconClass="fa fa-chevron-down"
        onTreeNodeClick={this._setLastActionState.bind(this, "clicked", stateKeyLastActionPrefix)}
        onTreeNodeCollapseChange={this._handleTreeNodePropChange.bind(this, stateKeyLastActionPrefix, stateKeyData, "collapsed")}
        onTreeNodeCheckChange={this._handleTreeNodePropChange.bind(this, stateKeyLastActionPrefix, stateKeyData, "checked")}
        data={this.state.mainTreeData} />
    );
  }

  /**
   * 
   * @private
   */
  _setLastActionState(action, stateKeyLastActionPrefix, lineage) {

    let toggleEvents = ["collapsed", "checked", "selected"];

    if (toggleEvents.indexOf(action) >= 0) {
      action += "Changed";
    }

    let nodePath = lineage.join(" > ");
    console.log("Controller View received tree menu " + action + " action: " + nodePath);

    let lastActionKey = stateKeyLastActionPrefix + "LastAction";

    let mutation = {};
    mutation[lastActionKey] = {
      event: action,
      node: nodePath,
      time: new Date().getTime()
    };

    this.setState(mutation)
  }

  _handleTreeNodePropChange(stateKeyLastActionPrefix, stateKeyData, action, lineage) {

    console.log("lineage ", lineage);
    this._setLastActionState(action, stateKeyLastActionPrefix, lineage);

    let oldState = Immutable.fromJS(this.state[stateKeyData]),
        nodePath = this._getNodePath(lineage),
        keyPaths = [nodePath.concat([action])];

    this._addChildKeys(oldState, nodePath, keyPaths, action);

    //Get the new prop state
    let newPropState = !oldState.getIn(keyPaths[0]);

    //Now create a new map w/ all the changes
    let newState = oldState.withMutations(function(state) {
      keyPaths.forEach(function (keyPath) {
        state.setIn(keyPath, newPropState);
      })
    });

    let mutation = {};

    mutation[stateKeyData] = newState.toJS();

    this.setState(mutation);
  }

  /**
   * Get a node path that includes children, given a key
   * @private
   */
  _getNodePath(nodeKey) {
    if (nodeKey.length === 1) return nodeKey;
    return _(nodeKey).zip(nodeKey.map(() => {
      return "children";
    })).flatten().initial().value();
  }

  /**
   * Build a list of key paths for all children
   * @private
   */
  _addChildKeys(state, parentPath, keyPaths, action) {
    let childrenPath = parentPath.concat('children'),
        children = state.getIn(childrenPath);

    if (!children || children.size === 0) return;

    children.map((value, key) => {
      keyPaths.push(childrenPath.concat([key, action]));
      this._addChildKeys(state, childrenPath.concat([key]), keyPaths, action);
    });
  }

  _getPanel(title, treeMenuNode) {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">{title + " Menu"}</div>
          <div className="panel-body">
            {treeMenuNode}
          </div>
        </div>
      </div>
    );
  }
}

TreeMenuFacetedNavigation.propTypes = {
  onTreeNodeClick:          React.PropTypes.func,
  onTreeNodeCollapseChange: React.PropTypes.func,
  onTreeNodeCheckChange:    React.PropTypes.func,
  labelFilter:              React.PropTypes.func,
  labelFactory:             React.PropTypes.func,
  data:                     React.PropTypes.object
}

export default TreeMenuFacetedNavigation;
