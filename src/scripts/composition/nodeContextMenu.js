// External
import Promise from '../../../node_modules/es6-promise/lib/es6-promise/Promise';
import debounce from '../../../node_modules/lodash-es/debounce';

// Internal
import { dropMenu } from '../commons/charts';
import { requestNextAnimationFrame } from '../commons/shims';
import { allTransitionsEnded } from '../commons/d3-utils';

const CLASS_NAME = 'context-menu';
const CLASS_CHECKBOX = 'checkbox';
const TRANSITION_SPEED = 125;
const BUTTON_QUERY_DEBOUNCE = 666;
const BUTTON_ROOT_DEBOUNCE = 500;
const BUTTON_DEFAULT_DEBOUNCE = 150;
const BUTTON_BAM_EFFECT_ANIMATION_TIME = 700;

class NodeContextMenu {
  constructor (vis, visData, baseEl, events, querying) {
    const that = this;

    this._x = 0;
    this._y = 0;
    this._yOffset = 0;
    this._scale = 0;

    this.vis = vis;
    this.visData = visData;
    this.baseEl = baseEl;
    this.events = events;

    this.wrapper = this.baseEl.append('g')
      .attr('class', CLASS_NAME)
      .call(this.updateAppearance.bind(this));

    this.numButtonRows = querying ? 2 : 3;
    this.height = this.visData.global.row.height * this.numButtonRows;

    this.bg = this.wrapper.append('path')
      .attr('class', 'bgBorder')
      .attr('d', dropMenu({
        x: -1,
        y: -1,
        width: this.visData.global.column.width + 2,
        height: this.height + 2,
        radius: 5,
        arrowSize: 6
      }))
      .style('filter', 'url(#drop-shadow-context-menu)');

    this.bg = this.wrapper.append('path')
      .attr('class', 'bg')
      .attr('d', dropMenu({
        x: 0,
        y: 0,
        width: this.visData.global.column.width,
        height: this.height,
        radius: 4,
        arrowSize: 6
      }))
      .style('filter', 'url(#drop-shadow-context-menu)');

    this.buttonQuery = this.wrapper.append('g')
      .call(this.createButton.bind(this), {
        alignRight: false,
        classNames: [],
        distanceFromCenter: 1,
        fullWidth: true,
        label: 'Query:',
        labelTwo: 'query-mode',
        bamEffect: true
      })
      .on('click', function () {
        that.clickQueryHandler.call(that, this);
      });
    this.buttonQueryFill = this.buttonQuery.select('.bg-fill-effect');
    this.buttonQueryBamEffect = this.buttonQuery.select('.bg-bam-effect');

    this.buttonRoot = this.wrapper.append('g')
      .call(this.createButton.bind(this), {
        alignRight: false,
        classNames: [],
        distanceFromCenter: 0,
        fullWidth: false,
        label: 'Root'
      })
      .on('click', function () {
        that.clickRootHandler.call(that, this);
      });
    this.buttonRootFill = this.buttonRoot.select('.bg-fill-effect');
    this.checkboxRoot = this.createCheckbox(this.buttonRoot);

    this.buttonLock = this.wrapper.append('g')
      .call(this.createButton.bind(this), {
        alignRight: true,
        classNames: [],
        distanceFromCenter: 0,
        fullWidth: false,
        label: 'Focus',
        bamEffect: true
      })
      .on('click', function () {
        that.clickLockHandler.call(that, this);
      });
    this.buttonLockFill = this.buttonLock.select('.bg-fill-effect');
    this.buttonLockBamEffect = this.buttonLock.select('.bg-bam-effect');
    this.checkboxLock = this.createCheckbox(this.buttonLock);
  }

  createButton (selection, properties) {
    let classNames = 'button';
    if (properties.classNames && properties.classNames.length) {
      classNames += ' ' + properties.classNames.join(' ');
    }
    selection.attr('class', classNames);

    selection
      .datum(properties)
      .call(
        this.createButtonBg.bind(this), {
          bamEffect: properties.bamEffect,
          fullWidth: properties.fullWidth
        }
      )
      .call(
        this.addLabel.bind(this),
        properties.label,
        properties.labelTwo
      )
      .call(
        this.positionButton.bind(this),
        properties.distanceFromCenter,
        properties.alignRight
      );

    this.debouncedQueryHandler = debounce(
      this.queryHanlder, BUTTON_QUERY_DEBOUNCE
    );
    this.debouncedRootHandler = debounce(
      this.rootHandler, BUTTON_ROOT_DEBOUNCE
    );
  }

  queryHanlder (debounced) {
    if (debounced) {
      if (this.tempQueryMode !== this.currentQueryMode) {
        if (this.tempQueryMode) {
          this.vis.nodes.queryByNode(this.node, this.tempQueryMode);
          this.triggerButtonBamEffect(this.buttonQueryBamEffect);
          this.buttonQuery.classed('active', true);
        } else {
          this.vis.nodes.unqueryByNode(this.node, this.tempQueryMode);
          this.buttonQuery.classed('active', false);
        }
      }
    } else {
      this.vis.nodes.toggleQueryByNode(this.node);
    }

    // Reset temporary query modes.
    this.tempQueryMode = undefined;
    this.currentQueryMode = undefined;
    this.buttonQuery.classed('fill-effect', false);
  }

  clickQueryHandler () {
    this.buttonQuery.classed('fill-effect', true);
    this.updateQuery(true, BUTTON_QUERY_DEBOUNCE);
    if (!this.vis.disableDebouncedContextMenu) {
      this.debouncedQueryHandler(true);
    } else {
      this.queryHandler();
    }
  }

  rootHandler (debounced) {
    if (!debounced || this.tempRoot !== this.currentRootState) {
      this.close();
      this.vis.nodes.toggleRoot(this.node);
    }

    // Reset temporary root values.
    this.tempRoot = undefined;
    this.currentRootState = undefined;
    this.buttonRoot.classed('fill-effect', false);
  }

  clickRootHandler () {
    this.buttonRoot.classed('fill-effect', true);
    this.checkRoot(true, BUTTON_ROOT_DEBOUNCE);
    if (!this.vis.disableDebouncedContextMenu) {
      this.debouncedRootHandler(true);
    } else {
      this.rootHandler();
    }
  }

  clickLockHandler () {
    this.buttonLock.classed('fill-effect', true);
    this.vis.nodes.toggleLock(this.node);
    const checked = this.checkLock();
    if (checked) {
      this.buttonLock.classed('active', true);
    } else {
      this.buttonLock.classed('active', false);
    }
    setTimeout(() => {
      if (checked) {
        this.triggerButtonBamEffect(this.buttonLockBamEffect);
      }
      this.buttonLock.classed('fill-effect', false);
    }, BUTTON_DEFAULT_DEBOUNCE);
  }

  triggerButtonBamEffect (button) {
    button.classed('active', true);
    setTimeout(() => {
      button.classed('active', false);
    }, BUTTON_BAM_EFFECT_ANIMATION_TIME);
  }

  createButtonBg (selection, params) {
    selection.datum(data => {
      data.x = this.visData.global.row.padding;
      data.y = this.visData.global.row.padding;
      data.width = this.visData.global.column.width * (params.fullWidth ? 1 : 0.5) -
        this.visData.global.row.padding * 2;
      data.height = this.visData.global.row.contentHeight;
      data.rx = 2;
      data.ry = 2;

      return data;
    }).append('rect')
      .attr('class', 'bg')
      .attr('x', data => data.x)
      .attr('y', data => data.y)
      .attr('width', data => data.width)
      .attr('height', data => data.height)
      .attr('rx', data => data.rx)
      .attr('ry', data => data.ry);

    selection.append('rect')
      .attr('class', 'bg-fill-effect')
      .attr('x', data => data.x)
      .attr('y', data => data.y)
      .attr('width', data => data.width)
      .attr('height', 0)
      .attr('rx', data => data.rx)
      .attr('ry', data => data.ry);

    if (params.bamEffect) {
      selection.append('rect')
        .attr('class', 'bg-bam-effect')
        .attr('x', data => data.x)
        .attr('y', data => data.y)
        .attr('width', data => data.width)
        .attr('height', data => data.height)
        .attr('rx', data => data.rx)
        .attr('ry', data => data.ry);
    }
  }

  createCheckbox (selection) {
    const height = Math.round(selection.datum().height / 2);
    const x = -1.75 * height + this.visData.global.row.padding;

    const container = selection.append('g').attr('class', CLASS_CHECKBOX);

    container.append('rect')
      .attr('class', 'checkbox-bg')
      .attr('x', data => data.width + x)
      .attr('y', height / 2 + this.visData.global.row.padding)
      .attr('width', height * 1.5)
      .attr('height', height)
      .attr('rx', height / 2)
      .attr('ry', height / 2);

    this.checkBoxMovement = (height - 2) / 2;

    return container.append('rect')
      .attr('class', 'checkbox-knob')
      .attr('x', data => data.width + x + 1)
      .attr('y', height / 2 + this.visData.global.row.padding + 1)
      .attr('width', height - 2)
      .attr('height', height - 2)
      .attr('rx', height - 2);
  }

  positionButton (selection, distanceFromCenter, alignRight) {
    const x = alignRight ? this.visData.global.column.width / 2 : 0;
    // When the buttons are created I assume that the menu is positioned
    // above the node; i.e. `distanceFromCenter` needs to be inverted.
    const y = this.visData.global.row.height *
      (this.numButtonRows - distanceFromCenter - 1);

    selection.attr('transform', `translate(${x}, ${y})`);
  }

  addLabel (selection, label, labelTwo) {
    const div = selection.append('foreignObject')
      .attr('x', this.visData.global.row.padding * 2)
      .attr('y', this.visData.global.row.padding +
        this.visData.global.cell.padding)
      .attr('width', this.visData.global.column.contentWidth)
      .attr('height', this.visData.global.row.contentHeight -
        this.visData.global.cell.padding * 2)
      .attr('class', 'label-wrapper')
      .append('xhtml:div')
        .style('line-height', (this.visData.global.row.contentHeight -
          this.visData.global.cell.padding * 2) + 'px');

    div.append('xhtml:span')
      .attr('class', 'label')
      .attr('title', label)
      .text(label);

    if (labelTwo) {
      div.append('xhtml:span').attr('class', `label-two ${labelTwo}`);
    }
  }

  get translate () {
    return 'translate(' + this._x + 'px,' + (this._y + this._yOffset) + 'px)';
  }

  set translate (position) {
    this._x = position.x;
    this._y = position.y;
  }

  get scale () {
    return 'scale(' + (this.opened ? 1 : 0.5) + ')';
  }

  updateAppearance (selection) {
    selection
      .classed('transitionable', this.visible)
      .classed('open', this.opened)
      .style('transform', this.translate + ' ' + this.scale)
      .style(
        'transform-origin',
        (this.visData.global.column.width / 2) + 'px ' +
        (this.height + this.visData.global.row.height) + 'px'
      );
  }

  open (node) {
    return new Promise(resolve => {
      this.node = node;
      this.closing = undefined;

      this.updateStates();
      this.translate = {
        x: this.node.datum().x,
        y: this.node.datum().y - this.height
      };
      this._yOffset = this.visData.nodes[this.node.datum().depth].scrollTop;
      this.wrapper.call(this.updateAppearance.bind(this));
      this.opened = true;
      this.visible = true;

      requestNextAnimationFrame(() => {
        this.wrapper.call(this.updateAppearance.bind(this));
        setTimeout(() => { resolve(true); }, TRANSITION_SPEED);
      });
    });
  }

  close () {
    if (!this.closing) {
      this.closing = new Promise(resolve => {
        this.opened = false;
        this.wrapper.call(this.updateAppearance.bind(this));

        setTimeout(() => {
          this.visible = false;
          this.wrapper.call(this.updateAppearance.bind(this));
          resolve(this.node.datum().id);
          this.node = undefined;
        }, TRANSITION_SPEED);
      });
    }
    return this.closing;
  }

  toggle (node) {
    return new Promise(resolve => {
      const nodeId = node.datum().id;
      let closed = Promise.resolve();

      if (this.visible) {
        closed = this.close();
      }

      closed.then((previousNodeId) => {
        if (nodeId !== previousNodeId) {
          this.open(node).then(() => { resolve(nodeId); });
        } else {
          resolve(nodeId);
        }
      });
    });
  }

  scrollY (offset) {
    this._yOffset = offset;
    this.wrapper.call(this.updateAppearance.bind(this));
  }

  updateStates () {
    this.checkLock();
    this.checkRoot();
    this.updateQuery();
  }

  checkLock () {
    const checked = this.node.datum().data.state.lock;
    this.buttonLock.classed('semi-active', checked);
    this.checkboxLock.style(
      'transform',
      'translateX(' + (checked ? this.checkBoxMovement : 0) + 'px)'
    );
    if (checked) {
      this.fillButton(this.buttonLockFill);
    } else {
      this.emptyButton(this.buttonLockFill);
    }
    return checked;
  }

  checkRoot (debounced, time) {
    const state = this.node.datum().data.state.root;
    let checked = state;

    if (debounced) {
      if (typeof this.currentRootState === 'undefined') {
        this.currentRootState = !!state;
      }
      if (typeof this.tempRoot === 'undefined') {
        this.tempRoot = this.currentRootState;
      }
      this.tempRoot = !this.tempRoot;
      checked = this.tempRoot;
    }

    if (!state) {
      if (debounced) {
        if (checked) {
          this.fillButton(this.buttonRootFill, time);
        } else {
          this.hideFillButton(this.buttonRootFill);
        }
      } else {
        this.emptyButton(this.buttonRootFill, time);
      }
    } else {
      if (debounced) {
        if (!checked) {
          this.emptyButton(this.buttonRootFill, time);
        } else {
          this.showFillButton(this.buttonRootFill);
        }
      } else {
        this.fillButton(this.buttonRootFill, time);
      }
    }

    this.buttonRoot.classed('semi-active active', checked);
    this.checkboxRoot.style(
      'transform',
      'translateX(' + (checked ? this.checkBoxMovement : 0) + 'px)'
    );
  }

  updateQuery (debounced, time) {
    const state = this.node.datum().data.state.query;
    let queryMode = state;

    function nextQueryMode (mode) {
      switch (mode) {
        case 'or':
          return 'and';
        case 'and':
          return 'not';
        case 'not':
          return null;
        default:
          return 'or';
      }
    }

    if (debounced) {
      if (typeof this.currentQueryMode === 'undefined') {
        this.currentQueryMode = state;
      }
      if (typeof this.tempQueryMode === 'undefined') {
        this.tempQueryMode = this.currentQueryMode;
      }
      this.tempQueryMode = nextQueryMode(this.tempQueryMode);
      queryMode = this.tempQueryMode;
    }

    if (debounced) {
      if (queryMode) {
        if (queryMode === state) {
          this.showFillButton(this.buttonQueryFill);
        } else {
          this.fillButton(this.buttonQueryFill, time);
        }
      } else {
        if (state) {
          this.emptyButton(this.buttonQueryFill, time);
        } else {
          this.hideFillButton(this.buttonQueryFill);
        }
      }
    } else {
      this.emptyButton(this.buttonQueryFill, time);
    }

    this.buttonQuery
      .classed('semi-active', !!queryMode)
      .classed('active', !!state)
      .select('.query-mode')
        .text(queryMode || 'not queried')
        .classed('inactive', !queryMode);
  }

  fillButton (selection, time) {
    selection
      .transition()
      .duration(0)
      .attr('y', data => data.y)
      .attr('height', 0)
      .call(allTransitionsEnded, () => {
        selection
          .transition()
          .duration(time || BUTTON_DEFAULT_DEBOUNCE)
          .ease('linear')
          .attr('height', data => data.height);
      });
  }

  emptyButton (selection, time) {
    selection
      .transition()
      .duration(0)
      .attr('y', data => data.y)
      .attr('height', data => data.height)
      .call(allTransitionsEnded, () => {
        selection
          .transition()
          .duration(time || BUTTON_DEFAULT_DEBOUNCE)
          .ease('linear')
          .attr('y', data => data.height)
          .attr('height', 0);
      });
  }

  hideFillButton (selection) {
    selection.transition().duration(0).attr('height', 0);
  }

  showFillButton (selection) {
    selection.transition().duration(0).attr('height', data => data.height);
  }
}

export default NodeContextMenu;
