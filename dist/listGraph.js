/* Copyright Fritz Lekschas: D3 example visualization app using the list-like graph layout */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('$'), require('d3')) :
  typeof define === 'function' && define.amd ? define(['$', 'd3'], factory) :
  (global.ListGraph = factory(global.$,global.d3));
}(this, (function ($,d3) { 'use strict';

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Base error class.
 */
var ExtendableError = function (_Error) {
  inherits(ExtendableError, _Error);

  /**
   * Constructor.
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-12
   * @param   {String}  message  Custom error message.
   */
  function ExtendableError(message) {
    classCallCheck(this, ExtendableError);

    var _this = possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

    _this.name = _this.constructor.name;
    _this.message = message;
    Error.captureStackTrace(_this, _this.constructor.name);
    return _this;
  }

  return ExtendableError;
}(Error);

/**
 * D3 version 4 not found error.
 */
var D3VersionFourRequired = function (_ExtendableError) {
  inherits(D3VersionFourRequired, _ExtendableError);

  /**
   * Constructor
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-12
   * @param   {String}  versionFound  D3 version string.
   */
  function D3VersionFourRequired(versionFound) {
    classCallCheck(this, D3VersionFourRequired);
    return possibleConstructorReturn(this, (D3VersionFourRequired.__proto__ || Object.getPrototypeOf(D3VersionFourRequired)).call(this, 'D3 version 4 is required to run the code. Found version ' + versionFound));
  }

  return D3VersionFourRequired;
}(ExtendableError);

/**
 * When varible is no object
 */
var NoObject = function (_ExtendableError2) {
  inherits(NoObject, _ExtendableError2);

  /**
   * Constructor
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-12
   * @param   {String}  variableName  Name of the variable that ought to be an
   *   object.
   */
  function NoObject(variableName) {
    classCallCheck(this, NoObject);
    return possibleConstructorReturn(this, (NoObject.__proto__ || Object.getPrototypeOf(NoObject)).call(this, 'The "' + variableName + '" must be an object.'));
  }

  return NoObject;
}(ExtendableError);

// Internal
var LayoutNotAvailable = function (_ExtendableError) {
  inherits(LayoutNotAvailable, _ExtendableError);

  function LayoutNotAvailable(message) {
    classCallCheck(this, LayoutNotAvailable);
    return possibleConstructorReturn(this, (LayoutNotAvailable.__proto__ || Object.getPrototypeOf(LayoutNotAvailable)).call(this, message || 'D3.layout.listGraph.js has not been loaded yet.'));
  }

  return LayoutNotAvailable;
}(ExtendableError);

var EventDispatcherNoFunction = function (_ExtendableError2) {
  inherits(EventDispatcherNoFunction, _ExtendableError2);

  function EventDispatcherNoFunction(message) {
    classCallCheck(this, EventDispatcherNoFunction);
    return possibleConstructorReturn(this, (EventDispatcherNoFunction.__proto__ || Object.getPrototypeOf(EventDispatcherNoFunction)).call(this, message || 'Dispatcher needs to be a function.'));
  }

  return EventDispatcherNoFunction;
}(ExtendableError);

var CLASSNAME = 'list-graph';

/**
 * Width of the scrollbar in pixel.
 *
 * @type  {Number}
 */
var SCROLLBAR_WIDTH = 6;

/**
 * Default number of columns
 *
 * @type  {Number}
 */
var COLUMNS = 5;

/**
 * Default number of rows.
 *
 * @type  {Number}
 */
var ROWS = 5;

/**
 * Path to the icon file. An empty path is equal to inline SVG.
 *
 * @type  {String}
 */
var ICON_PATH = '';

/**
 * Default sort order.
 *
 * @description
 * -1 = desc, 1 = asc
 *
 * @type  {Number}
 */
var DEFAULT_SORT_ORDER = -1;

/**
 * Default bar display mode.
 *
 * @type  {String}
 */
var DEFAULT_BAR_MODE = 'one';

/**
 * Default highlighting of the active level.
 *
 * @type  {Boolean}
 */
var HIGHLIGHT_ACTIVE_LEVEL = true;

/**
 * Default active level.
 *
 * @type  {Number}
 */
var ACTIVE_LEVEL = 0;

/**
 * Default difference when no custom root is queried for.
 *
 * @type  {Number}
 */
var NO_ROOT_ACTIVE_LEVEL_DIFF = 0;

/**
 * Default querying.
 *
 * @type  {Boolean}
 */
var QUERYING = false;

/**
 * Default value for hiding links pointing to nodes outside the visible area.
 *
 * @type  {Boolean}
 */
var HIDE_OUTWARDS_LINKS = false;

/**
 * Default value for showing the link indicator bar when links to hidden nodes
 * are hidden.
 *
 * @type  {Boolean}
 */
var SHOW_LINK_LOCATION = false;

/**
 * Default for disabling debouncing of the node context menu.
 *
 * @type  {Boolean}
 */
var DISABLE_DEBOUNCED_CONTEXT_MENU = false;

/**
 * Default transition speed in milliseconds for super fast transition.
 *
 * @type  {Number}
 */
var TRANSITION_LIGHTNING_FAST = 150;

/**
 * Default transition speed in milliseconds for semi-fast transition.
 *
 * @type  {Number}
 */
var TRANSITION_SEMI_FAST = 250;
/**
 * Strength of how much links should be bundled.
 *
 * @description
 * The value ranges from 0 (no bundling at all) to 1 (move line through every
 * controll point).
 *
 * @type  {Number}
 */
var LINK_BUNDLING_STRENGTH = 0.95;

// External
// eslint-disable-line import/no-unresolved

var TOPBAR_EL = 'div';
var TOPBAR_CLASS = 'top-bar';

var TOPBAR_CONTROL_EL = 'ul';
var TOPBAR_CONTROL_CLASS = 'controls';
var TOPBAR_GLOBAL_CONTROL_CLASS = 'global-controls';

var Topbar = function () {
  function Topbar(vis, selection, visData) {
    var _this = this;

    classCallCheck(this, Topbar);

    var self = this;

    this.vis = vis;
    this.visData = visData;
    // Add base topbar element
    this.el = selection.select('.' + TOPBAR_CLASS);

    if (this.el.empty()) {
      this.el = selection.insert(TOPBAR_EL, ':first-child').attr('class', TOPBAR_CLASS);
    }

    this.controlSwitch = this.el.append('div').attr('title', 'Toggle global / local topbar').style('width', this.visData.global.column.padding + 'px').classed('control-switch', true).on('click', this.switch.bind(this));

    this.switchArrow = this.controlSwitch.append('svg').append('use').attr('xlink:href', this.vis.iconPath + '#arrow-down').attr('class', 'switch-arrow');

    this.globalControls = this.el.append(TOPBAR_CONTROL_EL).classed(TOPBAR_GLOBAL_CONTROL_CLASS, true);

    // Add button for sorting by precision
    this.globalPrecision = this.globalControls.append('li').attr('class', 'control-btn sort-precision').classed('active', function () {
      if (self.vis.currentSorting.global.type === 'precision') {
        // Save currently active element. Needed when when re-sorting for the
        // first time, to be able to de-highlight this element.
        self.vis.currentSorting.global.el = d3.select(this);
        return true;
      }
      return false;
    }).on('click', function () {
      self.sortAllColumns(this, 'precision');
    }).on('mouseenter', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.highlightBars(undefined, 'precision');
      }, []);
    }).on('mouseleave', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.highlightBars(undefined, 'precision', true);
      }, []);
    });

    this.globalPrecisionWrapper = this.globalPrecision.append('div').attr('class', 'wrapper');

    this.globalPrecisionWrapper.append('span').attr('class', 'label').text('Precision');

    this.globalPrecisionWrapper.append('svg').attr('class', 'icon-unsort invisible-default').classed('visible', this.vis.currentSorting.global.type !== 'precision').append('use').attr('xlink:href', this.vis.iconPath + '#unsort');

    this.globalPrecisionWrapper.append('svg').attr('class', 'icon-sort-asc invisible-default').classed('visible', this.vis.currentSorting.global.type === 'precision' && this.vis.currentSorting.global.order === 1).append('use').attr('xlink:href', this.vis.iconPath + '#sort-asc');

    this.globalPrecisionWrapper.append('svg').attr('class', 'icon-sort-desc invisible-default').classed('visible', this.vis.currentSorting.global.type === 'precision' && this.vis.currentSorting.global.order !== 1).append('use').attr('xlink:href', this.vis.iconPath + '#sort-desc');

    // Add button for sorting by recall
    this.globalRecall = this.globalControls.append('li').attr('class', 'control-btn sort-recall').classed('active', function () {
      if (self.vis.currentSorting.global.type === 'recall') {
        // See precision
        self.vis.currentSorting.global.el = d3.select(this);
        return true;
      }
      return false;
    }).on('click', function () {
      self.sortAllColumns(this, 'recall');
    }).on('mouseenter', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.highlightBars(undefined, 'recall');
      }, []);
    }).on('mouseleave', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.highlightBars(undefined, 'recall', true);
      }, []);
    });

    this.globalRecallWrapper = this.globalRecall.append('div').attr('class', 'wrapper');

    this.globalRecallWrapper.append('span').attr('class', 'label').text('Recall');

    this.globalRecallWrapper.append('svg').attr('class', 'icon-unsort invisible-default').classed('visible', this.vis.currentSorting.global.type !== 'recall').append('use').attr('xlink:href', this.vis.iconPath + '#unsort');

    this.globalRecallWrapper.append('svg').attr('class', 'icon-sort-asc invisible-default').classed('visible', this.vis.currentSorting.global.type === 'recall' && this.vis.currentSorting.global.order === 1).append('use').attr('xlink:href', this.vis.iconPath + '#sort-asc');

    this.globalRecallWrapper.append('svg').attr('class', 'icon-sort-desc invisible-default').classed('visible', this.vis.currentSorting.global.type === 'recall' && this.vis.currentSorting.global.order !== 1).append('use').attr('xlink:href', this.vis.iconPath + '#sort-desc');

    // Add button for sorting by name
    this.globalName = this.globalControls.append('li').attr('class', 'control-btn sort-name').classed('active', function () {
      if (self.vis.currentSorting.global.type === 'name') {
        // See precision
        self.vis.currentSorting.global.el = d3.select(this);
        return true;
      }
      return false;
    }).on('click', function () {
      self.sortAllColumns(this, 'name');
    }).on('mouseenter', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.highlightLabels();
      }, []);
    }).on('mouseleave', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.highlightLabels(true);
      }, []);
    });

    this.globalNameWrapper = this.globalName.append('div').attr('class', 'wrapper');

    this.globalNameWrapper.append('span').attr('class', 'label').text('Name');

    this.globalNameWrapper.append('svg').attr('class', 'icon-unsort invisible-default').classed('visible', this.vis.currentSorting.global.type !== 'name').append('use').attr('xlink:href', this.vis.iconPath + '#unsort');

    this.globalNameWrapper.append('svg').attr('class', 'icon-sort-asc invisible-default').classed('visible', this.vis.currentSorting.global.type === 'name' && this.vis.currentSorting.global.order === 1).append('use').attr('xlink:href', this.vis.iconPath + '#sort-alpha-asc');

    this.globalNameWrapper.append('svg').attr('class', 'icon-sort-desc invisible-default').classed('visible', this.vis.currentSorting.global.type === 'name' && this.vis.currentSorting.global.order !== 1).append('use').attr('xlink:href', this.vis.iconPath + '#sort-alpha-desc');

    // Add button for switching to 'one bar'
    this.globalOneBar = this.globalControls.append('li').attr('class', 'control-btn one-bar').classed('active', this.vis.barMode === 'one').on('click', function () {
      self.switchBarMode(this, 'one');
    });

    this.globalOneBarWrapper = this.globalOneBar.append('div').attr('class', 'wrapper').text('One bar');

    this.globalOneBarWrapper.append('svg').attr('class', 'icon-one-bar').append('use').attr('xlink:href', this.vis.iconPath + '#one-bar');

    // Add button for switching to 'two bars'
    this.globalTwoBars = this.globalControls.append('li').attr('class', 'control-btn two-bars').classed('active', this.vis.barMode === 'two').on('click', function () {
      self.switchBarMode(this, 'two');
    });

    this.globalTwoBarsWrapper = this.globalTwoBars.append('div').attr('class', 'wrapper').text('Two bars');

    this.globalTwoBarsWrapper.append('svg').attr('class', 'icon-two-bars').append('use').attr('xlink:href', this.vis.iconPath + '#two-bars');

    // Add button for zoom-out
    this.globalZoomOut = this.globalControls.append('li').attr('class', 'control-btn zoom-out').classed('active', this.vis.zoomedOut).on('mouseenter', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.vis.globalView.call(_this.vis);
      }, []);
    }).on('mouseleave', function () {
      _this.vis.interactionWrapper.call(_this.vis, function () {
        _this.vis.zoomedView.call(_this.vis);
      }, []);
    }).on('click', function () {
      self.vis.toggleView.call(self.vis);
      d3.select(this).classed('active', self.vis.zoomedOut);
    });

    this.globalZoomOutWrapper = this.globalZoomOut.append('div').attr('class', 'wrapper').text('Zoom Out');

    this.globalZoomOutWrapper.append('svg').attr('class', 'icon-zoom-out').append('use').attr('xlink:href', this.vis.iconPath + '#zoom-out');

    this.localControlWrapper = this.el.append('div').classed('local-controls', true);

    this.localControls = this.localControlWrapper.selectAll(TOPBAR_CONTROL_CLASS).data(visData.nodes).enter().append(TOPBAR_CONTROL_EL).classed(TOPBAR_CONTROL_CLASS, true).style('width', this.visData.global.column.width + 'px');

    this.localControls.each(function (data, index) {
      var control = d3.select(this);

      /*
       * Order:
       * 0 = unsorted
       * 1 = asc
       * -1 = desc
       */
      self.vis.currentSorting.local[index] = {
        type: data.sortBy,
        order: data.sortOrder,
        el: undefined
      };

      control.append('li').attr('class', 'control-btn toggle').style('width', self.visData.global.column.padding + 'px').on('click', self.toggleColumn);

      control.append('li').attr('class', 'control-btn sort-precision ease-all').classed('active', function () {
        if (self.vis.currentSorting.local[index].type === 'precision') {
          // See precision
          self.vis.currentSorting.local[index].el = d3.select(this);
          return true;
        }
        return false;
      }).style('width', self.visData.global.column.contentWidth / 2 + 'px').style('left', self.visData.global.column.padding + 'px').on('click', function (controlData) {
        self.sortColumn(this, controlData.level, 'precision');
      }).on('mouseenter', function () {
        self.highlightBars(this.parentNode, 'precision');
        d3.select(this).style('width', self.visData.global.column.contentWidth - 16 + 'px');
      }).on('mouseleave', function () {
        self.highlightBars(this.parentNode, 'precision', true);
        d3.select(this).style('width', self.visData.global.column.contentWidth / 2 + 'px');
      }).html('<div class="expandable-label">' + '  <span class="letter abbr">P</span>' + '  <span class="letter abbr">r</span>' + '  <span class="letter">e</span>' + '  <span class="letter abbr">c</span>' + '  <span class="letter">i</span>' + '  <span class="letter">s</span>' + '  <span class="letter">i</span>' + '  <span class="letter">o</span>' + '  <span class="letter">n</span>' + '</div>' + '<svg class="icon-unsort invisible-default ' + (self.vis.currentSorting.local[index].type !== 'precision' ? 'visible' : '') + '">' + // eslint-disable-line
      '  <use xlink:href="' + self.vis.iconPath + '#unsort"></use>' + '</svg>' + '<svg class="icon-sort-asc invisible-default ' + (self.vis.currentSorting.local[index].type === 'precision' && self.vis.currentSorting.local[index].order === 1 ? 'visible' : '') + '">' + // eslint-disable-line
      '  <use xlink:href="' + self.vis.iconPath + '#sort-asc"></use>' + '</svg>' + '<svg class="icon-sort-desc invisible-default ' + (self.vis.currentSorting.local[index].type === 'precision' && self.vis.currentSorting.local[index].order !== 1 ? 'visible' : '') + '">' + // eslint-disable-line
      '  <use xlink:href="' + self.vis.iconPath + '#sort-desc"></use>' + '</svg>');

      control.append('li').attr('class', 'control-btn sort-recall ease-all').classed('active', function () {
        if (self.vis.currentSorting.local[index].type === 'recall') {
          // See recall
          self.vis.currentSorting.local[index].el = d3.select(this);
          return true;
        }
        return false;
      }).style('width', self.visData.global.column.contentWidth / 2 + 'px').style('left', self.visData.global.column.contentWidth / 2 + self.visData.global.column.padding + 'px').on('click', function (controlData) {
        self.sortColumn(this, controlData.level, 'recall');
      }).on('mouseenter', function () {
        self.highlightBars(this.parentNode, 'recall');
        d3.select(this).style('width', self.visData.global.column.contentWidth - 16 + 'px').style('left', self.visData.global.column.padding + 16 + 'px');
      }).on('mouseleave', function () {
        self.highlightBars(this.parentNode, 'recall', true);
        d3.select(this).style('width', self.visData.global.column.contentWidth / 2 + 'px').style('left', self.visData.global.column.contentWidth / 2 + self.visData.global.column.padding + 'px');
      }).html('<div class="expandable-label">' + '  <span class="letter abbr">R</span>' + '  <span class="letter">e</span>' + '  <span class="letter abbr">c</span>' + '  <span class="letter">a</span>' + '  <span class="letter abbr">l</span>' + '  <span class="letter">l</span>' + '</div>' + '<svg class="icon-unsort invisible-default ' + (self.vis.currentSorting.local[index].type !== 'recall' ? 'visible' : '') + '">' + // eslint-disable-line
      '  <use xlink:href="' + self.vis.iconPath + '#unsort"></use>' + '</svg>' + '<svg class="icon-sort-asc invisible-default ' + (self.vis.currentSorting.local[index].type === 'recall' && self.vis.currentSorting.local[index].order === 1 ? 'visible' : '') + '">' + // eslint-disable-line
      '  <use xlink:href="' + self.vis.iconPath + '#sort-asc"></use>' + '</svg>' + '<svg class="icon-sort-desc invisible-default ' + (self.vis.currentSorting.local[index].type === 'recall' && self.vis.currentSorting.local[index].order !== 1 ? 'visible' : '') + '">' + // eslint-disable-line
      '  <use xlink:href="' + self.vis.iconPath + '#sort-desc"></use>' + '</svg>');

      control.append('li').attr('class', 'control-btn options').style('width', self.visData.global.column.padding + 'px').on('click', self.toggleOptions).html('<svg class="icon-gear">' + '  <use xlink:href="' + self.vis.iconPath + '#gear"></use>' + '</svg>');

      if (self.vis.currentSorting.local[index].type) {
        self.vis.currentSorting.local[index].el = control.select('.sort-' + self.vis.currentSorting.local[index].type);
      }
    });
  }

  // toggleColumn () {
  //   console.log('Toggle column');
  // }

  createClass(Topbar, [{
    key: 'selectNodesLevel',
    value: function selectNodesLevel(el) {
      return this.vis.selectByLevel(d3.select(el).datum().level, '.node');
    }
  }, {
    key: 'highlightLabels',
    value: function highlightLabels(deHighlight) {
      this.vis.baseElD3.selectAll('.node').classed('highlight-label', !deHighlight);
    }
  }, {
    key: 'highlightBars',
    value: function highlightBars(el, type, deHighlight) {
      var nodes = el ? this.selectNodesLevel(el) : this.vis.baseElD3.selectAll('.node');

      nodes.classed('highlight-bar', !deHighlight).selectAll('.bar.' + type).classed('highlight', !deHighlight);
    }
  }, {
    key: 'sortAllColumns',
    value: function sortAllColumns(el, type) {
      var newSortType = this.vis.currentSorting.global.type !== type;

      if (newSortType) {
        if (this.semiActiveSortingEls) {
          this.resetSemiActiveSortingEls();
        }
        // Unset class of previous global sorting element
        if (this.vis.currentSorting.global.el) {
          this.resetSortEl(this.vis.currentSorting.global.el, type);
        }
      }

      this.vis.currentSorting.global.el = d3.select(el);
      this.vis.currentSorting.global.el.classed('active', true);
      this.vis.currentSorting.global.type = type;

      var columnKeys = Object.keys(this.vis.currentSorting.local);
      for (var i = 0, len = columnKeys.length; i < len; i++) {
        // Update local sorting properties and buttons but do **not** sort
        // locally!
        this.sortColumn(el, columnKeys[i], type, true);
      }

      this.vis.sortAllColumns(type, newSortType);
    }
  }, {
    key: 'sortColumn',
    value: function sortColumn(el, index, type, global) {
      // Reset global sorting
      if (!global) {
        if (this.semiActiveSortingEls) {
          this.resetSemiActiveSortingEls();
        }
        if (this.vis.currentSorting.global.type) {
          this.resetSortEl(this.vis.currentSorting.global.el, type);
        }
        this.vis.currentSorting.global.type = undefined;
      }

      var newSortType = false;

      if (this.vis.currentSorting.local[index].el) {
        if (this.vis.currentSorting.local[index].type !== type) {
          this.resetSortEl(this.vis.currentSorting.local[index].el, type);
        }
      }

      if (this.vis.currentSorting.local[index].type !== type) {
        newSortType = true;
        // Reset sort order
        this.vis.currentSorting.local[index].order = 0;
      }

      this.vis.currentSorting.local[index].el = d3.select(el);
      this.vis.currentSorting.local[index].type = type;

      // -1 = desc, 1 = asc
      if (this.vis.currentSorting.local[index].order === -1) {
        this.vis.currentSorting.local[index].order = 1;
        this.vis.currentSorting.local[index].el.select('.icon-sort-desc').classed('visible', false);
        this.vis.currentSorting.local[index].el.select('.icon-sort-asc').classed('visible', true);
      } else {
        this.vis.currentSorting.local[index].order = -1;
        this.vis.currentSorting.local[index].el.select('.icon-sort-asc').classed('visible', false);
        this.vis.currentSorting.local[index].el.select('.icon-sort-desc').classed('visible', true);
      }

      this.vis.currentSorting.local[index].el.select('.icon-unsort').classed('visible', false);

      this.vis.currentSorting.local[index].el.classed('active', true);

      if (!global) {
        this.vis.sortColumn(index, type, this.vis.currentSorting.local[index].order, newSortType);
      }
    }
  }, {
    key: 'resetSortEl',
    value: function resetSortEl(el, newType) {
      el.classed('active', false);
      el.select('.icon-sort-desc').classed('visible', false);
      el.select('.icon-sort-asc').classed('visible', false);
      el.select('.icon-unsort').classed('visible', true);
      if (newType === 'name') {
        el.classed('semi-active', true);
        this.semiActiveSortingEls = true;
      }
    }
  }, {
    key: 'resetSemiActiveSortingEls',
    value: function resetSemiActiveSortingEls() {
      this.el.selectAll('.semi-active').classed('semi-active', false);
    }
  }, {
    key: 'switch',
    value: function _switch() {
      this.el.classed('details', !this.el.classed('details'));
    }
  }, {
    key: 'switchBarMode',
    value: function switchBarMode(el, mode) {
      if (this.vis.nodes.barMode !== mode) {
        if (mode === 'one') {
          this.globalOneBar.classed('active', true);
          this.globalTwoBars.classed('active', false);
        } else {
          this.globalOneBar.classed('active', false);
          this.globalTwoBars.classed('active', true);
        }
        this.vis.switchBarMode(mode);
      }
    }
  }]);
  return Topbar;
}();

// External
// eslint-disable-line import/no-unresolved

/**
 * Class name of columns.
 *
 * @type  {String}
 */
var COLUMN_CLASS = 'column';

/**
 * Class name of scroll containers.
 *
 * @type  {String}
 */
var SCROLL_CONTAINER_CLASS = 'scroll-container';

var Levels = function () {
  /**
   * Level / column constructor.
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-14
   * @param   {Object}  selection  D3 selection of element the levels should be
   *   appended to.
   * @param   {Object}  vis        List Graph App.
   * @param   {Object}  visData    List Graph App data.
   */
  function Levels(selection, vis, visData) {
    var _this = this;

    classCallCheck(this, Levels);

    this.vis = vis;
    this.visData = visData;
    this.groups = selection.selectAll('g').data(this.visData.nodes).enter().append('g').attr('class', COLUMN_CLASS).classed('active', function (data, index) {
      if (_this.vis.highlightActiveLevel) {
        if (!_this.vis.nodes || !_this.vis.nodes.rootedNode) {
          return index === _this.vis.activeLevel - _this.vis.noRootActiveLevelDiff;
        }
        return index === _this.vis.activeLevel;
      }
      return false;
    }).each(function (data) {
      data.scrollTop = 0;
    });

    // We need to add an empty rectangle that fills up the whole column to ensure
    // that the `g`'s size is at a maximum, otherwise scrolling will be halted
    // when the cursor leaves an actually drawn element.
    this.groups.append('rect').attr('class', SCROLL_CONTAINER_CLASS).attr('x', function (data) {
      return data.x;
    }).attr('y', function (data) {
      return data.y;
    }).attr('width', this.visData.global.column.width + 1).attr('height', this.visData.global.column.height);
  }

  /**
   * Prepare column for scrolling.
   *
   * @method  scrollPreparation
   * @author  Fritz Lekschas
   * @date    2016-09-14
   * @param   {Number}  scrollbarWidth  Width of the scrollbar in pixel.
   */


  createClass(Levels, [{
    key: 'scrollPreparation',
    value: function scrollPreparation(scrollbarWidth) {
      var _this2 = this;

      this.groups.each(function (data, index) {
        var contentHeight = data.nodes.getBoundingClientRect().height + 2 * _this2.visData.global.row.padding;
        var scrollHeight = contentHeight - _this2.visData.global.column.height;
        var scrollbarHeight = scrollHeight > 0 ? Math.max(_this2.visData.global.column.height * _this2.visData.global.column.height / contentHeight, 10) : 0;

        data.height = contentHeight;
        data.linkSelections = {
          incoming: index > 0 ? _this2.vis.selectByLevel(index - 1, '.link') : null,
          outgoing: _this2.vis.selectByLevel(index, '.link')
        };
        data.scrollHeight = scrollHeight;
        data.scrollTop = 0;
        data.scrollbar = {
          el: undefined,
          x: data.x + (_this2.visData.global.column.width - scrollbarWidth),
          y: 0,
          width: scrollbarWidth,
          height: scrollbarHeight,
          scrollHeight: _this2.visData.global.column.height - scrollbarHeight,
          scrollTop: 0,
          heightScale: d3.scaleLinear().domain([0, scrollHeight]).range([0, _this2.visData.global.column.height - scrollbarHeight])
        };
        data.invertedHeightScale = data.scrollbar.heightScale.invert;
      });
    }

    /**
     * Update the properties for column scrolling.
     *
     * @method  updateScrollProperties
     * @author  Fritz Lekschas
     * @date    2016-09-14
     */

  }, {
    key: 'updateScrollProperties',
    value: function updateScrollProperties() {
      var _this3 = this;

      this.groups.each(function (data) {
        var contentHeight = data.nodes.getBoundingClientRect().height + 2 * _this3.visData.global.row.padding;
        var scrollHeight = contentHeight - _this3.visData.global.column.height;
        var scrollbarHeight = scrollHeight > 0 ? Math.max(_this3.visData.global.column.height * _this3.visData.global.column.height / contentHeight, 10) : 0;

        data.height = contentHeight;
        data.scrollHeight = scrollHeight;
        data.scrollTop = 0;
        data.scrollbar.y = 0;
        data.scrollbar.height = scrollbarHeight;
        data.scrollbar.scrollHeight = _this3.visData.global.column.height - scrollbarHeight;
        data.scrollbar.scrollTop = 0;
        data.scrollbar.heightScale = d3.scaleLinear().domain([0, scrollHeight]).range([0, _this3.visData.global.column.height - scrollbarHeight]);
      });
    }

    /**
     * Check if column should be hidden when it's not in the visible area.
     *
     * @method  updateVisibility
     * @author  Fritz Lekschas
     * @date    2016-09-14
     */

  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.groups.each(function () {
        var group = d3.select(this);

        group.classed('hidden', group.selectAll('.node').filter(function (data) {
          return !data.hidden;
        }).empty());
      });
    }

    /**
     * Get the column's class name.
     *
     * @method  className
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @return  {String}  Class name of the column.
     */

  }, {
    key: 'focus',


    /**
     * Focus a level.
     *
     * @method  focus
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Number}  level  ID of the column.
     */
    value: function focus(level) {
      if (this.vis.highlightActiveLevel) {
        this.groups.filter(function (data) {
          return data.level === level;
        }).classed('active', true);
      }
    }

    /**
     * Blur a level.
     *
     * @method  blur
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Number}  level  ID of the column.
     */

  }, {
    key: 'blur',
    value: function blur(level) {
      if (this.vis.highlightActiveLevel) {
        if (level) {
          this.groups.filter(function (data) {
            return data.level === level;
          }).classed('active', false);
        } else {
          this.groups.classed('active', false);
        }
      }
    }
  }, {
    key: 'className',
    get: function get() {
      return COLUMN_CLASS;
    }

    /**
     * Get the column's height.
     *
     * @method  height
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @return  {Number}  Column height in pixel.
     */

  }, {
    key: 'height',
    get: function get() {
      return this.visData.global.column.height;
    }
  }]);
  return Levels;
}();

// External
// eslint-disable-line import/no-unresolved

// Internal
/**
 * Class name of the group of link container.
 *
 * @type  {String}
 */
var LINKS_CLASS = 'links';

/**
 * Class name of a link element.
 *
 * @type  {String}
 */
var LINK_CLASS = 'link';

var Links = function () {
  /**
   * [constructor description]
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-14
   * @param   {Object}   vis      List Graph App.
   * @param   {Object}   levels   List Graph App's levels.
   * @param   {Object}   visData  List Graph App's data.
   * @param   {Object}   layout   List Graph Layout.
   */
  function Links(vis, levels, visData, layout) {
    var _this = this;

    classCallCheck(this, Links);

    this.vis = vis;
    this.visData = visData;
    this.layout = layout;

    this.groups = levels.append('g').attr('class', LINKS_CLASS).call(function (selection) {
      selection.each(function () {
        d3.select(this.parentNode).datum().links = this;
      });
    });

    this.links = this.groups.selectAll(LINK_CLASS).data(function (data, index) {
      return _this.layout.links(index);
    }).enter().append('g').attr('class', LINK_CLASS).classed('visible', !this.vis.hideOutwardsLinks || this.linkVisibility.bind(this));

    this.links.append('path').attr('class', LINK_CLASS + '-bg').attr('d', this.diagonal.bind(this));

    this.links.append('path').attr('class', LINK_CLASS + '-direct').attr('d', this.diagonal.bind(this));
  }

  /**
   * Creates a SVG path string for links based on B-splines.
   *
   * @method  diagonal
   * @author  Fritz Lekschas
   * @date    2016-09-22
   * @return  {String}  SVG path string.
   */


  createClass(Links, [{
    key: 'linkVisibility',


    /**
     * Assess link visibility
     *
     * @method  linkVisibility
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}  data  D3 selection data object of links.
     */
    value: function linkVisibility(data) {
      // Cache visibility.
      data.hidden = this.vis.pointsOutside.call(this.vis, data);
      return data.hidden === 0;
    }

    /**
     * [highlight description]
     *
     * @method  highlight
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Array}    nodeIds    Array of Node IDs.
     * @param   {Boolean}  highlight  If `true` highlights links.
     * @param   {String}   className  Class name added for CSS-based highlighting.
     */

  }, {
    key: 'highlight',
    value: function highlight(nodeIds, _highlight, className) {
      this.links.filter(function (data) {
        return nodeIds[data.id];
      }).classed(className, _highlight);
    }

    /**
     * Make links temporarily visible.
     *
     * @method  makeAllTempVisible
     * @author  Fritz Lekschas
     * @date    2016-09-22
     * @param   {Boolean}  unset  If `true` reverts the temporal visibility.
     */

  }, {
    key: 'makeAllTempVisible',
    value: function makeAllTempVisible(unset) {
      if (unset) {
        this.links.classed('visible', this.linkVisibility.bind(this));
      } else {
        this.links.classed('visible', true);
      }
    }

    /**
     * Scroll links when the container is scrolled.
     *
     * @method  scroll
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}  selection  D3 selection of links.
     * @param   {Object}  data       Updated link data depending on scroll
     *   position.
     */

  }, {
    key: 'scroll',
    value: function scroll(selection, data) {
      // Update data of `g`.
      selection.data(data);

      if (this.vis.hideOutwardsLinks) {
        // Check if links point outwards.
        selection.classed('visible', this.linkVisibility.bind(this));
      }

      // Next, update all paths according to the new data.
      selection.selectAll('path').attr('d', this.diagonal);
    }

    /**
     * Sort links by applying updated data and transitioning to the new position.
     *
     * @method  sort
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {[type]}    update  [description]
     * @return  {[type]}            [description]
     */

  }, {
    key: 'sort',
    value: function sort(update) {
      var start = function start() {
        d3.select(this).classed('sorting', true);
      };
      var end = function end() {
        d3.select(this).classed('sorting', false);
      };

      // Update data of `g`.
      this.links.data(update, function (data) {
        return data.id;
      });

      // Next update all paths according to the new data.
      this.links.selectAll('path').transition().duration(TRANSITION_SEMI_FAST).attr('d', this.diagonal).on('start', start).on('end', end);
    }

    /**
     * Update the visual state of the link according to the current state of data.
     *
     * @description
     * This method differs from checking whether a source or target node is
     * visible as it purely depends on the `hidden` property of the node data. It
     * is primarily used to hide links of hidden nodes, e.g., when nodes are
     * hidden manually.
     *
     * @method  updateVisibility
     * @author  Fritz Lekschas
     * @date    2016-09-14
     */

  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.links.classed('hidden', function (data) {
        return data.target.node.hidden || data.source.node.hidden;
      }).transition().duration(TRANSITION_SEMI_FAST).attr('d', this.diagonal);
    }
  }, {
    key: 'diagonal',
    get: function get() {
      var _this2 = this;

      var extraOffsetX = this.vis.showLinkLocation ? 6 : 0;

      function getSourceX(source) {
        return source.node.x + source.offsetX + this.visData.global.column.contentWidth + this.visData.global.column.padding;
      }

      function getTargetX(source) {
        return source.node.x + source.offsetX + this.visData.global.column.padding;
      }

      function getY(source) {
        return source.node.y + source.offsetY + this.visData.global.row.height / 2;
      }

      var getLine = d3.line().x(function (data) {
        return data.x;
      }).y(function (data) {
        return data.y;
      }).curve(d3.curveBundle.beta(LINK_BUNDLING_STRENGTH));

      return function (data) {
        var points = [];

        var sourceX = getSourceX.call(_this2, data.source);
        var sourceY = getY.call(_this2, data.source);

        var targetX = getTargetX.call(_this2, data.target);
        var targetY = getY.call(_this2, data.target);

        var middleX = (sourceX + targetX) / 2;
        var relMiddleX = (targetX - (sourceX + targetX) / 2) * 2 / 3;

        // Push the start point
        points.push({
          x: sourceX + extraOffsetX,
          y: sourceY
        });

        points.push({
          x: middleX,
          y: sourceY
        });

        // Push a control point
        points.push({
          x: targetX - relMiddleX,
          y: targetY
        });

        // Push a control point
        points.push({
          x: targetX - extraOffsetX,
          y: targetY
        });

        return getLine(points);
      };
    }
  }]);
  return Links;
}();

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = root.isFinite;

/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

/**
 * Collect all cloned nodes, including the original node.
 *
 * @method  collectInclClones
 * @author  Fritz Lekschas
 * @date    2016-03-20
 * @param   {Object}   node                 Start node
 * @param   {Boolean}  onlyForOriginalNode  If `true` only collect clones when
 *   `node` is not a clone itself.
 * @return  {Array}                         Array of original and cloned nodes.
 */
function collectInclClones(node, onlyForOriginalNode) {
  var originalNode = node;

  if (node.clone) {
    originalNode = node.originalNode;
    if (onlyForOriginalNode) {
      return [];
    }
  }

  var clones = [originalNode];

  if (originalNode.clones.length) {
    clones = clones.concat(originalNode.clones);
  }

  return clones;
}

// External
// Internal
function _up(node, callback, depth, includeClones, child, visitedNodes) {
  if (visitedNodes[node.id]) {
    if (!visitedNodes[node.id][child.id]) {
      callback(node, child);
    }
    return;
  }

  var nodes = includeClones ? collectInclClones(node) : [node];

  for (var i = nodes.length; i--;) {
    visitedNodes[nodes[i].id] = {};

    if (child) {
      callback(nodes[i], child);
      visitedNodes[nodes[i].id][child.id] = true;
    }

    if (!isFinite(depth) || depth > 0) {
      var parentsId = Object.keys(nodes[i].parents);
      for (var j = parentsId.length; j--;) {
        _up(nodes[i].parents[parentsId[j]], callback, depth - 1, includeClones, nodes[i], visitedNodes);
      }
    }
  }
}

/**
 * Traverse the graph upwards from a given node until a certain depth.
 *
 * @method  up
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}    node           D3 data object of a selected DOM element.
 * @param   {Function}  callback       Method to be called on every traversed
 *   node.
 * @param   {Number}    depth          Max steps to traverse upwards. If
 *   `undefined` will traverse till the root node.
 * @param   {Boolean}   includeClones  If `true` cloned nodes will be traversed
 *   as well.
 */
function up(node, callback, depth, includeClones) {
  var visitedNodes = {};
  _up(node, callback, depth, includeClones, undefined, visitedNodes);
}

function _down(node, callback, depth, includeClones, visitedNodes) {
  if (visitedNodes[node.id]) {
    return;
  }

  var nodes = includeClones ? collectInclClones(node) : [node];

  for (var i = nodes.length; i--;) {
    callback(nodes[i]);

    visitedNodes[nodes[i].id] = true;

    // We only need to recursivly traverse the graph for the original node as
    // the clones do not have any children (i.e. the have the same children as
    // the original node)
    if (i === 0 && (!isFinite(depth) || depth > 0)) {
      for (var j = nodes[i].childRefs.length; j--;) {
        _down(nodes[i].childRefs[j], callback, depth - 1, includeClones, visitedNodes);
      }
    }
  }
}

/**
 * Traverse the graph downwards from a given node until a certain depth.
 *
 * @method  down
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}    node           D3 data object of a selected DOM element.
 * @param   {Function}  callback       Method to be called on every traversed
 *   node.
 * @param   {Number}    depth          Max steps to traverse downwards. If
 *   `undefined` will traverse till leaf nodes.
 * @param   {Boolean}   includeClones  If `true` cloned nodes will be traversed
 *   as well.
 */
function down(node, callback, depth, includeClones) {
  var visitedNodes = {};
  _down(node, callback, depth, includeClones, visitedNodes);
}

/**
 * Traverse the graph up- and downwards from a given node until a certain depth.
 *
 * @method  upAndDown
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}    node           D3 data object of a selected DOM element.
 * @param   {Function}  callback       Method to be called on every upwards
 *   traversed node.
 * @param   {Function}  callback       Method to be called on every downwards
 *   traversed node.
 * @param   {Number}    depth          Max steps to traverse downwards. If
 *   `undefined` will traverse till leaf nodes.
 * @param   {Boolean}   includeClones  If `true` cloned nodes will be traversed
 *   as well.
 */
function upAndDown(node, callbackUp, callbackDown, depth, includeClones) {
  if (callbackDown) {
    up(node, callbackUp, depth, includeClones);
    down(node, callbackDown, depth, includeClones);
  } else {
    var visitedNodes = {};
    up(node, callbackUp, depth, includeClones, visitedNodes);
    down(node, callbackUp, depth, includeClones, visitedNodes);
  }
}

/**
 * Traverse siblings from a given nodes.
 *
 * @method  siblings
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}    node      D3 data object of a selected DOM element.
 * @param   {Function}  callback   Method to be called on every visited node.
 */
function siblings(node, callback) {
  var parentsId = Object.keys(node.parents);
  for (var i = parentsId.length; i--;) {
    for (var j = node.parents[parentsId[i]].childRefs.length; j--;) {
      callback(node.parents[parentsId[i]].childRefs[j]);
    }
  }
  // The root node doesn't have a `parents` property but might have `siblings`.
  if (node.siblings) {
    var siblingsId = Object.keys(node.siblings);
    for (var _i = siblingsId.length; _i--;) {
      callback(node.siblings[siblingsId[_i]]);
    }
  }
}

var BAR_CLASS = 'bar';

var Bar =
/**
 * Bar constructor
 *
 * @method  constructor
 * @author  Fritz Lekschas
 * @date    2016-09-14
 * @param   {Object}  baseEl    D3 selection of the base element where bars
 *   should be appended to.
 * @param   {Object}  barData   Object with the bar properties.
 * @param   {Object}  nodeData  Object with the node properties.
 * @param   {Object}  visData   Object with the list graph app properties.
 * @param   {Object}  bars      Bars class.
 */
function Bar(baseEl, barData, nodeData, visData, bars) {
  var _this = this;

  classCallCheck(this, Bar);

  this.data = barData;
  this.nodeData = nodeData;
  this.visData = visData;
  this.bars = bars;

  this.data.x = nodeData.x;
  this.data.level = nodeData.depth;

  this.height = this.visData.global.row.contentHeight / (this.data.length * 2) - this.visData.global.cell.padding * 2;

  this.activeHeight = this.visData.global.row.contentHeight - 2;

  this.inactiveheight = this.visData.global.cell.padding * 2 - 1;

  this.selection = baseEl.selectAll(BAR_CLASS).data(this.data).enter().append('g').attr('class', function (data) {
    return BAR_CLASS + ' ' + data.id;
  }).classed('active', function (data) {
    return data.id === _this.visData.nodes[_this.nodeData.depth].sortBy;
  });

  // Local helper method to avoid code duplication.
  function setupMagnitude(selection) {
    var _this2 = this;

    var currentSorting = this.visData.nodes[this.nodeData.depth].sortBy;

    selection.attr('d', function (data) {
      return _this2.bars.generatePath(data, currentSorting);
    }).classed('bar-magnitude', true);
  }

  function setupBorder(selection) {
    selection.attr('x', 0).attr('y', this.visData.global.row.padding).attr('width', this.visData.global.column.contentWidth).attr('height', this.visData.global.row.contentHeight).attr('rx', 2).attr('ry', 2).classed('bar-border', true);
  }

  this.selection.append('rect').call(setupBorder.bind(this));

  this.selection.append('path').call(setupMagnitude.bind(this));
};

/**
 * Returns the path for a rounded rectangle
 *
 * Credits go to Mike Bostock: http://bl.ocks.org/mbostock/3468167
 *
 * @method  roundRect
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Number}    x       X coordinate.
 * @param   {Number}    y       Y coordinate.
 * @param   {Number}    width   Width of the rectangle.
 * @param   {Number}    height  Height of the rectangle.
 * @param   {Number}    radius  Radius.
 * @return  {String}            Path string of the rounded rectangle.
 */
function roundRect(x, y, width, height, radius) {
  var topLeft = radius.topLeft || 0;
  var topRight = radius.topRight || 0;
  var bottomLeft = radius.bottomLeft || 0;
  var bottomRight = radius.bottomRight || 0;

  return 'M' + (x + topLeft) + ',' + y + 'h' + (width - topLeft - topRight) + 'a' + topRight + ',' + topRight + ' 0 0 1 ' + topRight + ',' + topRight + 'v' + (height - (topRight + bottomRight)) + 'a' + bottomRight + ',' + bottomRight + ' 0 0 1 ' + -bottomRight + ',' + bottomRight + 'h' + (bottomLeft - (width - bottomRight)) + 'a' + bottomLeft + ',' + bottomLeft + ' 0 0 1 ' + -bottomLeft + ',' + -bottomLeft + 'v' + (topLeft - (height - bottomLeft)) + 'a' + topLeft + ',' + topLeft + ' 0 0 1 ' + topLeft + ',' + -topLeft + 'z';
}

/**
 * Creates a path that looks like a drop menu
 *
 * @example
 * The following is an example how to create a drop menu path:
 * ```javascript
 * import { dropMenu } from './charts';
 * const dropMenuPath = dropMenu({
 *   x: 0,
 *   y: 0,
 *   width: 50,
 *   height: 100,
 *   radius: 5,
 *   arrowSize: 5
 * });
 * ```
 *
 * @method  dropMenu
 * @author  Fritz Lekschas
 * @date    2016-03-03
 * @param   {Object}  c  Config object that needs to contain the following
 *   properties: x, y, width, height, radius and arrowSize.
 */
function dropMenu(c) {
  return 'M' + (c.x + c.radius) + ',' + c.y + 'h' + (c.width - c.radius * 2) + 'a' + c.radius + ',' + c.radius + ' 0 0 1 ' + c.radius + ',' + c.radius + 'v' + (c.height - c.radius * 2) + 'a' + c.radius + ',' + c.radius + ' 0 0 1 ' + -c.radius + ',' + c.radius + 'h' + -(c.width - c.radius * 2 - c.arrowSize * 2) / 2 + 'l' + -c.arrowSize + ',' + c.arrowSize + 'l' + -c.arrowSize + ',' + -c.arrowSize + 'h' + -(c.width - c.radius * 2 - c.arrowSize * 2) / 2 + 'a' + c.radius + ',' + c.radius + ' 0 0 1 ' + -c.radius + ',' + -c.radius + 'v' + (c.radius - (c.height - c.radius)) + 'a' + c.radius + ',' + c.radius + ' 0 0 1 ' + c.radius + ',' + -c.radius + 'z';
}

// External
// eslint-disable-line import/no-unresolved

// Internal
var BARS_CLASS = 'bars';

var Bars = function () {
  /**
   * [constructor description]
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-14
   * @param   {Object}  baseEl   D3 selection where the group of bars should be
   *   appended to.
   * @param   {String}  mode     Display more. Can be either `one` or `two`.
   * @param   {Object}  visData  Object with the list graph app data.
   */
  function Bars(baseEl, mode, visData) {
    classCallCheck(this, Bars);

    var self = this;

    this.mode = mode;
    this.visData = visData;

    this.xScale = d3.scaleLinear().domain([0, 1]).range([1, this.visData.global.column.contentWidth - 3]);

    this.baseEl = baseEl.append('g').attr('class', BARS_CLASS);

    this.baseEl.each(function (datum) {
      new Bar(d3.select(this), datum.data.bars, datum, self.visData, self);
    });
  }

  /**
   * Updates all bar magnitude elements.
   *
   * @method  updateAll
   * @author  Fritz Lekschas
   * @date    2016-09-14
   * @param   {Object}  update  Object with the current data.
   * @param   {String}  sortBy  Name of the poperty to be sorted by.
   */


  createClass(Bars, [{
    key: 'updateAll',
    value: function updateAll(update, sortBy) {
      var _this = this;

      this.baseEl.selectAll('.bar-magnitude').data(update, function (data) {
        return data.barId;
      }).transition().duration(TRANSITION_SEMI_FAST).attr('d', function (data) {
        return _this.generatePath(data, sortBy);
      });
    }

    /**
     * Update bars when switching the bar mode.
     *
     * @method  update
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}  selection  D3 selection
     * @param   {String}  sortBy     Name of the poperty to be sorted by.
     */

  }, {
    key: 'update',
    value: function update(selection, sortBy) {
      var _this2 = this;

      selection.each(function (data) {
        var el = d3.select(this);

        if (data.id === sortBy && !el.classed('active')) {
          el.classed('active', true);
          // Ensure that the active bars we are places before any other bar,
          // thus placing them in the background
          this.parentNode.insertBefore(this, this.parentNode.children[0]);
        }

        if (data.id !== sortBy) {
          el.classed('active', false);
        }
      });

      selection.selectAll('.bar-magnitude').transition().duration(TRANSITION_SEMI_FAST).attr('d', function (data) {
        return _this2.generatePath(data, sortBy);
      });
    }

    /**
     * Switch one and two-bar display mode.
     *
     * @method  switchMode
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {String}  mode            Name of the display mode. Can either be
     *   `one` or `two`.
     * @param   {String}  currentSorting  Name if the property currently sorted
     *   by.
     */

  }, {
    key: 'switchMode',
    value: function switchMode(mode, currentSorting) {
      var _this3 = this;

      if (this.mode !== mode) {
        if (mode === 'one') {
          if (currentSorting.global.type) {
            this.baseEl.selectAll('.bar').selectAll('.bar-magnitude').transition().duration(TRANSITION_SEMI_FAST).attr('d', function (data) {
              return _this3.generateOneBarPath(data, currentSorting.global.type);
            });
          } else {
            // console.error(
            //   'Switching magnitude visualization after individual sorting is ' +
            //   'not supported yet.'
            // );
          }
        }

        if (mode === 'two') {
          this.baseEl.selectAll('.bar.precision').selectAll('.bar-magnitude').transition().duration(TRANSITION_SEMI_FAST).attr('d', function (data) {
            return _this3.generateTwoBarsPath(data);
          });

          this.baseEl.selectAll('.bar.recall').selectAll('.bar-magnitude').transition().duration(TRANSITION_SEMI_FAST).attr('d', function (data) {
            return _this3.generateTwoBarsPath(data, true);
          });
        }

        this.mode = mode;
      }
    }

    /**
     * Helper method to generate path used as a bar.
     *
     * @method  generatePath
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}   data             Data object.
     * @param   {String}   sortBy           Name of the property currently sorted
     *   by.
     */

  }, {
    key: 'generatePath',
    value: function generatePath(data, sortBy) {
      if (this.mode === 'two') {
        return this.generateTwoBarsPath(data);
      }
      return this.generateOneBarPath(data, sortBy);
    }

    /**
     * Generates a bar when one-bar display mode is active.
     *
     * @method  generateOneBarPath
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}   data    Data object.
     * @param   {String}   sortBy  Name of the property currently sorted by.
     */

  }, {
    key: 'generateOneBarPath',
    value: function generateOneBarPath(data, sortBy) {
      var height = this.visData.global.row.contentHeight;
      var normValue = Math.min(data.value, 1) || 0;

      var x = 0;
      var width = 2;

      var radius = {
        topLeft: 2,
        bottomLeft: 2
      };

      if (data.id !== sortBy) {
        x = this.xScale(normValue);
        radius = {};
      } else {
        width = this.visData.global.column.contentWidth * normValue;
      }

      x = Math.min(x, this.visData.global.column.contentWidth - 2);

      return roundRect(x, this.visData.global.row.padding, width, height, radius);
    }

    /**
     * Generates a bar when two-bar display mode is active.
     *
     * @method  generateTwoBarsPath
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}   data      Data object.
     * @param   {Boolean}  isBottom  If `true` then the bottom bar should be
     *   generated.
     */

  }, {
    key: 'generateTwoBarsPath',
    value: function generateTwoBarsPath(data, isBottom) {
      var normValue = Math.min(data.value, 1);
      var height = this.visData.global.row.contentHeight / 2;
      var width = this.visData.global.column.contentWidth * normValue;

      var y = this.visData.global.row.padding;
      var radius = { topLeft: 2 };

      if (isBottom) {
        radius = { bottomLeft: 2 };
        y += height;
      }

      return roundRect(0, y, width, height, radius);
    }
  }]);
  return Bars;
}();

// External
/**
 * Merges multiple distinct D3 selection objects.
 *
 * @description
 * First an empty selection is created by querying for a non-existing element.
 *
 * @method  mergeSelections
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Array}   selections  Array of multiple D3 selection objects.
 * @return  {Object}              Single D3 selection object containing all the
 *   selected elements from `selections`.
 */
function mergeSelections(selections) {
  // Create a new empty selection
  var mergedSelection = d3.selectAll('.d3-list-graph-not-existent');

  for (var i = selections.length; i--;) {
    mergedSelection._groups = mergedSelection._groups.concat(selections[i]._groups);
  }

  return mergedSelection;
}

/**
 * Detects when an array of transitions has ended.
 *
 * @method  allTransitionsEnded
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}    transition  D3 transition object.
 * @param   {Function}  callback    Callback function to be triggered when all
 *   transitions have ended.
 */
function allTransitionsEnded(transition, callback) {
  if (transition.size() === 0) {
    callback();
  }
  var n = 0;
  transition.each(function () {
    return ++n;
  }).on('end', function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (! --n) callback.apply(this, args);
  });
}

// External
// eslint-disable-line import/no-unresolved
// Internal
var CLASS_NODES = 'nodes';
var CLASS_NODE = 'node';
var CLASS_NODE_VISIBLE = 'visible-node';
var CLASS_CLONE = 'clone';
var CLASS_LABEL_WRAPPER = 'label-wrapper';
var CLASS_FOCUS_CONTROLS = 'focus-controls';
var CLASS_ROOT = 'root';
var CLASS_QUERY = 'query';
var CLASS_LOCK = 'lock';
var CLASS_INACTIVE = 'inactive';
var CLASS_INDICATOR_BAR = 'link-indicator';
var CLASS_INDICATOR_LOCATION = 'link-location-indicator';
var CLASS_INDICATOR_INCOMING = 'incoming';
var CLASS_INDICATOR_OUTGOING = 'outgoing';
var CLASS_INDICATOR_ABOVE = 'above';
var CLASS_INDICATOR_BELOW = 'below';

var Nodes = function () {
  function Nodes(vis, baseSelection, visData, links, events) {
    var _this = this;

    classCallCheck(this, Nodes);

    var self = this;

    this.vis = vis;
    this.visData = visData;
    this.links = links;
    this.events = events;
    this.currentLinks = {};
    this.iconDimension = Math.min(this.visData.global.row.contentHeight / 2 - this.visData.global.cell.padding * 2, this.visData.global.column.padding / 2 - 4);

    var linkDensityBg = d3.scaleLinear().domain([1, this.vis.rows]).range(['#ccc', '#000']);

    function drawLinkIndicator(selection, direction) {
      var incoming = direction === 'incoming';

      selection.attr('class', CLASS_INDICATOR_BAR + ' ' + (incoming ? CLASS_INDICATOR_INCOMING : CLASS_INDICATOR_OUTGOING)).attr('d', roundRect(incoming ? -7 : this.visData.global.column.contentWidth, this.visData.global.row.height / 2 - 1, 7, 2, {
        topLeft: incoming ? 1 : 0,
        topRight: incoming ? 0 : 1,
        bottomLeft: incoming ? 1 : 0,
        bottomRight: incoming ? 0 : 1
      })).attr('fill', function (data) {
        return linkDensityBg(data.links[direction].refs.length);
      }).classed('visible', function (data) {
        return data.links[direction].refs.length > 0;
      }).style('transform-origin', (incoming ? 0 : this.visData.global.column.contentWidth) + 'px ' + this.visData.global.row.height / 2 + 'px');
    }

    function drawLinkLocationIndicator(selection, direction, position) {
      var above = position === 'above';
      var incoming = direction === 'incoming';

      var className = CLASS_INDICATOR_LOCATION + ' ' + (incoming ? CLASS_INDICATOR_INCOMING : CLASS_INDICATOR_OUTGOING) + ' ' + (above ? CLASS_INDICATOR_ABOVE : CLASS_INDICATOR_BELOW);

      selection.datum(function (data) {
        return data.links[direction];
      }).attr('class', className).attr('x', incoming ? -5 : this.visData.global.column.contentWidth + 2).attr('y', above ? this.visData.global.row.height / 2 - 1 : this.visData.global.row.height / 2 + 1).attr('width', 3).attr('height', 3).attr('fill', function (data) {
        return linkDensityBg(data.refs.length);
      });
    }

    // Helper
    function drawFullSizeRect(selection, className, shrinking, noRoundBorder) {
      var shrinkingAmount = shrinking || 0;

      selection.attr('x', shrinkingAmount).attr('y', self.visData.global.row.padding + shrinkingAmount).attr('width', self.visData.global.column.contentWidth - 2 * shrinkingAmount).attr('height', self.visData.global.row.contentHeight - 2 * shrinkingAmount).attr('rx', noRoundBorder ? 0 : 2 - shrinkingAmount).attr('ry', noRoundBorder ? 0 : 2 - shrinkingAmount).classed(className, true);
    }

    function drawMaxSizedRect(selection) {
      selection.attr('x', 0).attr('y', 0).attr('width', self.visData.global.column.contentWidth).attr('height', self.visData.global.row.height).attr('class', 'invisible-container');
    }

    this.groups = baseSelection.append('g').attr('class', CLASS_NODES).call(function (selection) {
      selection.each(function storeLinkToGroupNode() {
        d3.select(this.parentNode).datum().nodes = this;
      });
    });

    this.nodes = this.groups.selectAll('.' + CLASS_NODE).data(function (data) {
      return data.rows;
    }).enter().append('g').classed(CLASS_NODE, true).classed(CLASS_CLONE, function (data) {
      return data.clone;
    }).attr('transform', function (data) {
      return 'translate(' + (data.x + _this.visData.global.column.padding) + ', ' + data.y + ')';
    });

    this.nodes.append('rect').call(drawMaxSizedRect);

    this.visNodes = this.nodes.append('g').attr('class', CLASS_NODE_VISIBLE);

    this.visNodes.append('rect').call(drawFullSizeRect, 'bg-border');

    this.visNodes.append('rect').call(drawFullSizeRect, 'bg', 1, true);

    if (this.vis.showLinkLocation) {
      this.nodes.append('rect').call(drawLinkLocationIndicator.bind(this), 'incoming', 'above');
      this.nodes.append('rect').call(drawLinkLocationIndicator.bind(this), 'incoming', 'bottom');
      this.nodes.append('rect').call(drawLinkLocationIndicator.bind(this), 'outgoing', 'above');
      this.nodes.append('rect').call(drawLinkLocationIndicator.bind(this), 'outgoing', 'bottom');

      this.nodes.append('path').call(drawLinkIndicator.bind(this), 'incoming');
      this.nodes.append('path').call(drawLinkIndicator.bind(this), 'outgoing');

      // Set all the link location indicator bars.
      this.groups.each(function (data, index) {
        _this.calcHeightLinkLocationIndicator(index, true, true);
      });
    }

    // Rooting icons
    var nodeRooted = this.nodes.append('g').attr('class', CLASS_FOCUS_CONTROLS + ' ' + CLASS_ROOT + ' ' + CLASS_INACTIVE);

    nodeRooted.append('rect').call(this.setUpFocusControls.bind(this), 'left', 0.6, 'hover-helper', 'hover-helper');

    nodeRooted.append('svg').call(this.setUpFocusControls.bind(this), 'left', 0.6, 'icon', 'ease-all state-inactive invisible-default icon').append('use').attr('xlink:href', this.vis.iconPath + '#unlocked');

    nodeRooted.append('svg').call(this.setUpFocusControls.bind(this), 'left', 0.6, 'icon', 'ease-all state-active invisible-default icon').append('use').attr('xlink:href', this.vis.iconPath + '#locked');

    // Querying icons
    if (this.vis.querying) {
      var nodeQuery = this.nodes.append('g').attr('class', CLASS_FOCUS_CONTROLS + ' ' + CLASS_QUERY + ' ' + CLASS_INACTIVE);

      nodeQuery.append('rect').call(this.setUpFocusControls.bind(this), 'right', 0.6, 'hover-helper', 'hover-helper');

      nodeQuery.append('svg').call(this.setUpFocusControls.bind(this), 'right', 0.6, 'icon', 'ease-all state-and-or invisible-default icon').append('use').attr('xlink:href', this.vis.iconPath + '#union');

      nodeQuery.append('svg').call(this.setUpFocusControls.bind(this), 'right', 0.6, 'icon', 'ease-all state-not invisible-default icon').append('use').attr('xlink:href', this.vis.iconPath + '#not');
    }

    this.bars = new Bars(this.visNodes, this.vis.barMode, this.visData);

    this.visNodes.append('rect').call(drawFullSizeRect, 'border');

    // Add node label
    this.visNodes.append('foreignObject').attr('x', this.visData.global.cell.padding).attr('y', this.visData.global.row.padding + this.visData.global.cell.padding).attr('width', this.visData.global.column.contentWidth).attr('height', this.visData.global.row.contentHeight - this.visData.global.cell.padding * 2).attr('class', CLASS_LABEL_WRAPPER).append('xhtml:div').attr('class', 'label').attr('title', function (data) {
      return data.data.name;
    }).style('line-height', this.visData.global.row.contentHeight - this.visData.global.cell.padding * 2 + 'px').append('xhtml:span').text(function (data) {
      return data.data.name;
    });

    if (isFunction(this.events.on)) {
      this.events.on('d3ListGraphFocusNodes', function (event) {
        return _this.focusNodes(event);
      });

      this.events.on('d3ListGraphBlurNodes', function (event) {
        return _this.blurNodes(event);
      });

      this.events.on('d3ListGraphNodeEnter', function (nodeIds) {
        return _this.eventHelper(nodeIds, _this.highlightNodes);
      });

      this.events.on('d3ListGraphNodeLeave', function (nodeIds) {
        return _this.eventHelper(nodeIds, _this.unhighlightNodes);
      });

      this.events.on('d3ListGraphNodeLock', function (nodeIds) {
        return _this.eventHelper(nodeIds, _this.toggleLock, []);
      });

      this.events.on('d3ListGraphNodeUnlock', function (nodeIds) {
        return _this.eventHelper(nodeIds, _this.toggleLock, [true]);
      });

      this.events.on('d3ListGraphNodeRoot', function (data) {
        return _this.eventHelper(data.nodeIds, _this.toggleRoot, [false, true]);
      });

      this.events.on('d3ListGraphNodeUnroot', function (data) {
        return _this.eventHelper(data.nodeIds, _this.toggleRoot, [true, true]);
      });
    }

    this.nodes.call(this.isInvisible.bind(this));
  }

  createClass(Nodes, [{
    key: 'updateLinkLocationIndicators',
    value: function updateLinkLocationIndicators(left, right) {
      this.calcHeightLinkLocationIndicator(left, false, true);
      this.calcHeightLinkLocationIndicator(right, true, false);
    }
  }, {
    key: 'calcHeightLinkLocationIndicator',
    value: function calcHeightLinkLocationIndicator(level, incoming, outgoing) {
      var nodes = this.nodes.filter(function (data) {
        return data.depth === level;
      });
      nodes.each(function (data) {
        if (incoming) {
          data.links.incoming.above = 0;
          data.links.incoming.below = 0;
          for (var i = data.links.incoming.total; i--;) {
            // We are checking the source location of the incoming link. The
            // source location is the location of the node of the column being
            // scrolled.
            if ((data.links.incoming.refs[i].hidden & 1) > 0) {
              data.links.incoming.above++;
            }
            if ((data.links.incoming.refs[i].hidden & 2) > 0) {
              data.links.incoming.below++;
            }
          }
        }
        if (outgoing) {
          data.links.outgoing.above = 0;
          data.links.outgoing.below = 0;
          for (var _i = data.links.outgoing.total; _i--;) {
            // We are checking the target location of the outgoing link. The
            // source location is the location of the node of the column being
            // scrolled.
            if ((data.links.outgoing.refs[_i].hidden & 4) > 0) {
              data.links.outgoing.above++;
            }
            if ((data.links.outgoing.refs[_i].hidden & 8) > 0) {
              data.links.outgoing.below++;
            }
          }
        }
      });

      if (incoming) {
        this.updateHeightLinkLocationIndicatorBars(nodes);
      }

      if (outgoing) {
        this.updateHeightLinkLocationIndicatorBars(nodes, true);
      }
    }
  }, {
    key: 'updateHeightLinkLocationIndicatorBars',
    value: function updateHeightLinkLocationIndicatorBars(selection, outgoing) {
      var barRefHeight = this.visData.global.row.contentHeight / 2 - 1;
      var barAboveRefTop = this.visData.global.row.height / 2 - 1;

      var baseClassName = '.' + CLASS_INDICATOR_LOCATION + '.' + (outgoing ? CLASS_INDICATOR_OUTGOING : CLASS_INDICATOR_INCOMING);

      selection.selectAll(baseClassName + '.' + CLASS_INDICATOR_ABOVE).attr('y', function (data) {
        return data.total ? barAboveRefTop - data.above / data.total * barRefHeight : barAboveRefTop;
      }).attr('height', function (data) {
        return data.total ? data.above / data.total * barRefHeight : 0;
      });

      selection.selectAll(baseClassName + '.' + CLASS_INDICATOR_BELOW).attr('height', function (data) {
        return data.total ? data.below / data.total * barRefHeight : 0;
      });
    }
  }, {
    key: 'enterHandler',
    value: function enterHandler(el, data) {
      this.highlightNodes(d3.select(el));

      var eventData = {
        id: data.id,
        clone: false,
        clonedFromId: undefined
      };

      if (data.clone) {
        eventData.clone = true;
        eventData.clonedFromId = data.originalNode.id;
      }

      this.events.broadcast('d3ListGraphNodeEnter', eventData);
    }
  }, {
    key: 'leaveHandler',
    value: function leaveHandler(el, data) {
      this.unhighlightNodes(d3.select(el));

      var eventData = {
        id: data.id,
        clone: false,
        clonedFromId: undefined
      };

      if (data.clone) {
        eventData.clone = true;
        eventData.clonedFromId = data.originalNode.id;
      }

      this.events.broadcast('d3ListGraphNodeLeave', eventData);
    }
  }, {
    key: 'lockHandler',
    value: function lockHandler(d3El) {
      var events = this.toggleLock(d3El);

      if (events.locked && events.unlocked) {
        this.events.broadcast('d3ListGraphNodeLockChange', {
          lock: {
            id: events.locked.id,
            clone: events.locked.clone,
            clonedFromId: events.locked.clone ? events.locked.originalNode.id : undefined
          },
          unlock: {
            id: events.unlocked.id,
            clone: events.unlocked.clone,
            clonedFromId: events.unlocked.clone ? events.unlocked.originalNode.id : undefined
          }
        });
      } else {
        if (events.locked) {
          this.events.broadcast('d3ListGraphNodeLock', {
            id: events.locked.id,
            clone: events.locked.clone,
            clonedFromId: events.locked.clone ? events.locked.originalNode.id : undefined
          });
        }

        if (events.unlocked) {
          this.events.broadcast('d3ListGraphNodeUnlock', {
            id: events.unlocked.id,
            clone: events.unlocked.clone,
            clonedFromId: events.unlocked.clone ? events.unlocked.originalNode.id : undefined
          });
        }
      }
    }
  }, {
    key: 'rootHandler',
    value: function rootHandler(d3El, unroot) {
      if (!d3El.datum().data.state.root && unroot) {
        // The node is not rooted so there's no point in unrooting.
        return;
      }
      var events = this.toggleRoot(d3El, unroot);

      if (events.rooted && events.unrooted) {
        this.events.broadcast('d3ListGraphNodeReroot', {
          rooted: {
            id: events.rooted.id,
            clone: events.rooted.clone,
            clonedFromId: events.rooted.clone ? events.rooted.originalNode.id : undefined
          },
          unrooted: {
            id: events.unrooted.id,
            clone: events.unrooted.clone,
            clonedFromId: events.unrooted.clone ? events.unrooted.originalNode.id : undefined
          }
        });
      } else {
        if (events.rooted) {
          this.events.broadcast('d3ListGraphNodeRoot', {
            id: events.rooted.id,
            clone: events.rooted.clone,
            clonedFromId: events.rooted.clone ? events.rooted.originalNode.id : undefined
          });
        }

        if (events.unrooted) {
          this.events.broadcast('d3ListGraphNodeUnroot', {
            id: events.unrooted.id,
            clone: events.unrooted.clone,
            clonedFromId: events.unrooted.clone ? events.unrooted.originalNode.id : undefined
          });
        }
      }
    }
  }, {
    key: 'focusNodes',
    value: function focusNodes(event) {
      var same = this.checkNodeFocusEventSame(event.nodeIds);
      if (this.nodeFocusId && !same) {
        // Show unrelated nodes first before we hide them again.
        this.blurNodes({
          nodeIds: this.nodeFocusId
        });
      }

      this.nodeFocusId = event.nodeIds;

      this.eventHelper(event.nodeIds, this.highlightNodes, ['focus', 'directParentsOnly', !!event.excludeClones, event.zoomOut || event.hideUnrelatedNodes]);

      if (event.zoomOut) {
        this.vis.globalView(this.nodes.filter(function (data) {
          return data.hovering > 0;
        }));
      } else {
        this.vis.zoomedView();
      }

      if (event.hideUnrelatedNodes) {
        if (!same || !this.tempHidingUnrelatedNodes) {
          this.hideUnrelatedNodes(event.nodeIds);
        }
      } else if (this.tempHidingUnrelatedNodes) {
        this.showUnrelatedNodes();
      }
    }
  }, {
    key: 'blurNodes',
    value: function blurNodes(event) {
      this.eventHelper(event.nodeIds, this.unhighlightNodes, ['focus', 'directParentsOnly', !!event.excludeClones]);

      if (event.zoomIn) {
        this.vis.zoomedView();
      }

      if (this.tempHidingUnrelatedNodes) {
        this.showUnrelatedNodes();
      }
    }
  }, {
    key: 'checkNodeFocusEventSame',
    value: function checkNodeFocusEventSame(nodeIds) {
      if (!this.nodeFocusId) {
        return false;
      }
      if (nodeIds.length !== this.nodeFocusId.length) {
        return false;
      }
      for (var i = nodeIds.length; i--;) {
        if (nodeIds[i] !== this.nodeFocusId[i]) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'hideUnrelatedNodes',
    value: function hideUnrelatedNodes(nodeIds) {
      this.tempHidingUnrelatedNodes = nodeIds;

      this.nodes.filter(function (data) {
        return !data.hovering;
      }).classed('hidden', true).each(function (data) {
        // Store old value for `hidden` temporarily
        data._hidden = data.hidden;
        data.hidden = true;
      });

      this.updateVisibility();
    }
  }, {
    key: 'showUnrelatedNodes',
    value: function showUnrelatedNodes() {
      this.tempHidingUnrelatedNodes = undefined;

      this.nodes.filter(function (data) {
        return !data.hovering;
      }).classed('hidden', function (data) {
        return data._hidden;
      }).each(function (data) {
        data.hidden = data._hidden;
        data._hidden = undefined;
      });

      this.updateVisibility();
    }
  }, {
    key: 'eventHelper',
    value: function eventHelper(nodeIds, callback, optionalParams, subSelectionClass) {
      var self = this;

      this.nodes
      // Filter by node ID
      .filter(function (data) {
        return !!~nodeIds.indexOf(data.id);
      }).each(function triggerCallback() {
        var d3El = d3.select(this);

        if (subSelectionClass) {
          d3El = d3El.select(subSelectionClass);
        }

        callback.apply(self, [d3El].concat(optionalParams || []));
      });
    }
  }, {
    key: 'toggleLock',
    value: function toggleLock(d3El, setFalse) {
      var data = d3El.datum();
      var events = { locked: false, unlocked: false };

      if (this.lockedNode) {
        if (this.lockedNode.datum().id === data.id) {
          this.unlockNode(this.lockedNode.datum().id);
          events.unlocked = this.lockedNode.datum();
          this.lockedNode = undefined;
        } else {
          // Reset previously locked node;
          this.unlockNode(this.lockedNode.datum().id);
          events.unlocked = this.lockedNode.datum();

          if (!setFalse) {
            this.lockNode(data.id);
            events.locked = data;
            this.lockedNode = d3El;
          }
        }
      } else {
        if (!setFalse) {
          this.lockNode(data.id);
          events.locked = data;
          this.lockedNode = d3El;
        }
      }

      return events;
    }
  }, {
    key: 'lockNode',
    value: function lockNode(id) {
      var self = this;
      var els = this.nodes.filter(function (data) {
        return data.id === id;
      });

      els.each(function (data) {
        self.highlightNodes(d3.select(this), 'lock', undefined);
        data.data.state.lock = true;
      });
    }
  }, {
    key: 'unlockNode',
    value: function unlockNode(id) {
      var self = this;
      var els = this.nodes.filter(function (data) {
        return data.id === id;
      });

      els.each(function (data) {
        self.unhighlightNodes(d3.select(this), 'lock', undefined);
        data.data.state.lock = undefined;
      });
    }
  }, {
    key: 'queryByNode',
    value: function queryByNode(d3El, mode) {
      d3El.datum().data.state.query = mode;
      d3El.classed({
        active: true,
        inactive: false,
        'query-and': mode === 'and',
        'query-or': mode === 'or',
        'query-not': mode === 'not'
      });
    }
  }, {
    key: 'unqueryByNode',
    value: function unqueryByNode(d3El) {
      var data = d3El.datum();

      data.data.state.query = undefined;
      data.data.queryBeforeRooting = undefined;

      d3El.classed({
        active: false,
        inactive: true,
        'query-and': false,
        'query-or': false,
        'query-not': false
      });

      if (this.rootedNode) {
        this.updateVisibility();
      }
    }
  }, {
    key: 'toggleQueryByNode',
    value: function toggleQueryByNode(d3El) {
      var data = d3El.datum();
      var previousMode = data.data.state.query;

      if (data.data.state.root) {
        if (previousMode !== 'or') {
          this.queryByNode(d3El, 'or');
        } else {
          this.queryByNode(d3El, 'and');
        }
      } else {
        switch (previousMode) {
          case 'or':
            this.queryByNode(d3El, 'and');
            break;
          case 'and':
            this.queryByNode(d3El, 'not');
            break;
          case 'not':
            this.unqueryByNode(d3El);
            break;
          default:
            this.queryByNode(d3El, 'or');
            break;
        }
      }
    }
  }, {
    key: 'batchQueryHandler',
    value: function batchQueryHandler(els, noNotification) {
      var actions = [];
      for (var i = els.length; i--;) {
        actions.push(this.queryHandler(els[i].d3El, els[i].action, els[i].mode, true));
      }

      if (!noNotification) {
        this.events.broadcast('d3ListGraphBatchQuery', actions);
      }
    }
  }, {
    key: 'queryHandler',
    value: function queryHandler(d3El, action, mode, returnNoNotification) {
      var data = d3El.datum();
      var previousMode = data.data.state.query;
      var event = {};

      if (!previousMode && action === 'unquery') {
        // We haven't queried anything so there's nothing to unquery.
        return undefined;
      }

      switch (action) {
        case 'query':
          this.queryByNode(d3El, mode);
          break;
        case 'unquery':
          this.unqueryByNode(d3El);
          break;
        default:
          this.toggleQueryByNode(d3El);
          break;
      }

      if (data.data.state.query) {
        if (data.data.state.query !== previousMode) {
          event.name = 'd3ListGraphNodeQuery';
          event.data = {
            id: data.id,
            clone: data.clone,
            clonedFromId: data.clone ? data.originalNode.id : undefined,
            mode: data.data.state.query
          };
        }
      } else {
        event.name = 'd3ListGraphNodeUnquery';
        event.data = {
          id: data.id,
          clone: data.clone,
          clonedFromId: data.clone ? data.originalNode.id : undefined
        };
      }

      if (event.name && !returnNoNotification) {
        this.events.broadcast(event.name, event.data);
      }

      return event.name ? event : undefined;
    }
  }, {
    key: 'toggleRoot',
    value: function toggleRoot(d3El, setFalse, noNotification) {
      var data = d3El.datum();
      var events = { rooted: false, unrooted: false };
      var queries = [];

      // Blur current levels
      this.vis.levels.blur();

      if (this.rootedNode) {
        // Reset current root node
        this.rootedNode.classed({ active: false, inactive: true });
        events.unrooted = this.rootedNode.datum();
        if (this.unrootNode(this.rootedNode).unquery) {
          queries.push({
            d3El: this.rootedNode,
            action: 'unquery'
          });
        }

        // Activate new root
        if (this.rootedNode.datum().id !== data.id && !setFalse) {
          d3El.classed({ active: true, inactive: false });
          this.rootedNode = d3El;
          events.rooted = d3El.datum();
          if (this.rootNode(d3El).query) {
            queries.push({
              d3El: d3El,
              action: 'query',
              mode: 'or'
            });
          }
        } else {
          this.rootedNode = undefined;
          // Highlight first level
          this.vis.levels.focus(this.vis.activeLevel - this.vis.noRootActiveLevelDiff);
        }
      } else {
        if (!setFalse) {
          d3El.classed({ active: true, inactive: false });
          this.rootedNode = d3El;
          events.rooted = d3El.datum();
          if (this.rootNode(d3El).query) {
            queries.push({
              d3El: d3El,
              action: 'query',
              mode: 'or'
            });
          }
        }
      }

      if (queries.length) {
        this.batchQueryHandler(queries, noNotification);
      }

      return events;
    }
  }, {
    key: 'rootNode',
    value: function rootNode(d3El) {
      var data = d3El.datum();

      data.data.state.root = true;
      d3El.classed('rooted', true);
      this.hideNodes(data);

      // Highlight level
      this.vis.levels.focus(data.depth + this.vis.activeLevel);

      if (!data.data.state.query || data.data.state.query === 'not') {
        data.data.queryBeforeRooting = false;
        return {
          query: true
        };
      }

      data.data.queryBeforeRooting = true;

      return {
        query: false
      };
    }
  }, {
    key: 'unrootNode',
    value: function unrootNode(d3El) {
      var data = d3El.datum();

      data.data.state.root = false;
      d3El.classed('rooted', false);
      this.showNodes();

      if (!data.data.queryBeforeRooting) {
        return {
          unquery: true
        };
      }

      return {
        unquery: false
      };
    }
  }, {
    key: 'setUpFocusControls',
    value: function setUpFocusControls(selection, location, position, mode, className) {
      var paddedDim = this.iconDimension + 4;

      var x = 0 - paddedDim * (position + 1);

      if (location === 'right') {
        x = this.visData.global.column.contentWidth + 2 + paddedDim * position;
      }

      var y = this.visData.global.row.padding + (this.visData.global.row.contentHeight - 2 * this.visData.global.cell.padding) / 4;

      if (mode === 'bg') {
        selection.attr('class', className).attr('cx', x + this.iconDimension / 2).attr('cy', y + this.iconDimension / 2).attr('r', this.iconDimension * 3 / 4);
      } else if (mode === 'hover-helper') {
        selection.attr('class', className).attr('x', x - 4).attr('y', y - 4).attr('width', this.iconDimension + 8).attr('height', this.iconDimension + 8).attr('rx', this.iconDimension).attr('ry', this.iconDimension);
      } else {
        selection.attr('class', className).attr('x', x).attr('y', y).attr('width', this.iconDimension).attr('height', this.iconDimension);
      }
    }

    /**
     * Helper method to hide nodes.
     *
     * @method  hideNodes
     * @author  Fritz Lekschas
     * @date    2016-02-21
     * @param   {Object}   data        Node data object.
     */

  }, {
    key: 'hideNodes',
    value: function hideNodes(data) {
      this.nodesVisibility(data);
    }

    /**
     * Helper method to show nodes.
     *
     * @method  showNodes
     * @author  Fritz Lekschas
     * @date    2016-02-21
     * @param   {Object}  data       Node data object.
     */

  }, {
    key: 'showNodes',
    value: function showNodes() {
      this.nodesVisibility(undefined, true);
    }

    /**
     * Sets the nodes' visibility
     *
     * @method  nodesVisibility
     * @author  Fritz Lekschas
     * @date    2016-02-21
     * @param   {Object}   data        Node data object.
     * @param   {Boolean}  show        If `true` nodes will be shown.
     */

  }, {
    key: 'nodesVisibility',
    value: function nodesVisibility(data, show) {
      if (show) {
        this.nodes.classed('hidden', false).each(function (nodeData) {
          nodeData.hidden = false;
        });
      } else {
        // First we set all nodes to `hidden`.
        this.nodes.each(function (nodeData) {
          nodeData.hidden = true;
        });

        // Then we set direct child and parent nodes of the current node visible.
        upAndDown(data, function (nodeData) {
          nodeData.hidden = false;
        });

        // We also show sibling nodes.
        siblings(data, function (nodeData) {
          nodeData.hidden = false;
        });

        this.nodes.classed('hidden', function (nodeData) {
          return nodeData.hidden && !nodeData.data.state.query;
        });
      }
      this.updateVisibility();
    }

    /**
     * Marks nodes as being invisible via assigning a class depending on the
     * custom scroll top position or the columns scroll top position.
     *
     * @method  isInvisible
     * @author  Fritz Lekschas
     * @date    2016-09-12
     * @param   {Object}  selection        D3 selection of nodes to be checked.
     * @param   {Number}  customScrollTop  Custom scroll top position. Used when
     *   column is actively scrolled.
     */

  }, {
    key: 'isInvisible',
    value: function isInvisible(selection, customScrollTop) {
      var _this2 = this;

      selection.classed('invisible', function (data) {
        var scrollTop = customScrollTop || _this2.visData.nodes[data.depth].scrollTop;

        // Node is right to the visible container
        if (data.x + _this2.vis.dragged.x >= _this2.vis.width) {
          return data.invisible = true;
        }
        // Node is below the visible container
        if (data.y + scrollTop >= _this2.vis.height) {
          return data.invisible = true;
        }
        // Node is above the visible container
        if (data.y + _this2.visData.global.row.height + scrollTop <= 0) {
          return data.invisible = true;
        }
        // Node is left to the visible container
        if (data.x + _this2.vis.dragged.x + _this2.visData.global.column.width <= 0) {
          return data.invisible = true;
        }
        return data.invisible = false;
      });
    }
  }, {
    key: 'makeAllTempVisible',
    value: function makeAllTempVisible(unset) {
      if (unset) {
        this.nodes.classed('invisible', function (data) {
          var prevInvisible = data._invisible;
          data._invisible = undefined;

          return prevInvisible;
        });
      } else {
        this.nodes.classed('invisible', function (data) {
          data._invisible = data.invisible;
          return false;
        });
      }
    }
  }, {
    key: 'highlightNodes',
    value: function highlightNodes(d3El, className, restriction, excludeClones, noVisibilityCheck) {
      var _this3 = this;

      var self = this;
      var data = d3El.datum();
      var nodeId = data.id;
      var currentNodeData = data.clone ? data.originalNode : data;
      var includeParents = true;
      var appliedClassName = className || 'hovering';
      var includeClones = !excludeClones;
      var includeChildren = restriction !== 'directParentsOnly';

      // Store link IDs
      if (!this.currentLinks[appliedClassName]) {
        this.currentLinks[appliedClassName] = {};
      }
      this.currentLinks[appliedClassName][nodeId] = {};

      var currentlyActiveBar = d3El.selectAll('.bar.active .bar-magnitude');
      if (!currentlyActiveBar.empty()) {
        currentlyActiveBar = currentlyActiveBar.datum();
      } else {
        currentlyActiveBar = undefined;
      }

      var traverseCallbackUp = function traverseCallbackUp(nodeData, childData) {
        nodeData.hovering = 2;
        for (var i = nodeData.links.outgoing.refs.length; i--;) {
          // Only push direct parent child connections. E.g.
          // Store: (parent)->(child)
          // Ignore: (parent)->(siblings of child)
          if (nodeData.links.outgoing.refs[i].target.node.id === childData.id) {
            _this3.currentLinks[appliedClassName][nodeId][nodeData.links.outgoing.refs[i].id] = true;
          }
        }
      };

      var traverseCallbackDown = function traverseCallbackDown(nodeData) {
        nodeData.hovering = 2;
        for (var i = nodeData.links.outgoing.refs.length; i--;) {
          _this3.currentLinks[appliedClassName][nodeId][nodeData.links.outgoing.refs[i].id] = true;
        }
      };

      if (includeParents && includeChildren) {
        upAndDown(data.clone ? data.originalNode : data, traverseCallbackUp, traverseCallbackDown, undefined, includeClones);
      }
      if (includeParents && !includeChildren) {
        up(data, traverseCallbackUp, undefined, includeClones);
      }
      if (!includeParents && includeChildren) {
        down(data.clone ? data.originalNode : data, traverseCallbackUp, undefined, includeClones);
      }

      currentNodeData.hovering = 1;

      if (includeClones) {
        for (var i = currentNodeData.clones.length; i--;) {
          currentNodeData.clones[i].hovering = 1;
        }
      }

      /**
       * Helper method to assess the node visibility.
       *
       * @method  checkNodeVisibility
       * @author  Fritz Lekschas
       * @date    2016-02-25
       * @param   {Object}  _el    [description]
       * @param   {Object}  _data  [description]
       * @return  {Boolean}        If `true` element is hidden.
       */
      function checkNodeVisibility(_el, _data) {
        return noVisibilityCheck || !_data.hidden && !self.vis.isHidden.call(self.vis, _el);
      }

      /**
       * Helper method to filter out directly hovered nodes.
       *
       * @method  checkNodeDirect
       * @author  Fritz Lekschas
       * @date    2016-02-25
       * @param   {Object}  nodeData  The node's data object.
       * @return  {Boolean}           If `true` element will not be filtered out.
       */
      function checkNodeDirect(nodeData) {
        return nodeData.hovering === 1 && checkNodeVisibility(this, nodeData);
      }

      /**
       * Helper method to filter out indirectly hovered nodes.
       *
       * @method  checkNodeIndirect
       * @author  Fritz Lekschas
       * @date    2016-02-25
       * @param   {Object}  nodeData  The node's data object.
       * @return  {Boolean}           If `true` element will not be filtered out.
       */
      function checkNodeIndirect(nodeData) {
        return nodeData.hovering === 2 && checkNodeVisibility(this, nodeData);
      }

      this.nodes.filter(checkNodeDirect).classed(appliedClassName + '-directly', true);
      this.nodes.filter(checkNodeIndirect).classed(appliedClassName + '-indirectly', true);

      this.links.highlight(this.currentLinks[appliedClassName][data.id], true, appliedClassName);
    }
  }, {
    key: 'unhighlightNodes',
    value: function unhighlightNodes(d3El, className, restriction, excludeClones) {
      var data = d3El.datum();
      var traverseCallback = function traverseCallback(nodeData) {
        nodeData.hovering = 0;
      };
      var includeParents = true;
      var appliedClassName = className || 'hovering';
      var includeClones = !excludeClones;
      var includeChildren = restriction !== 'directParentsOnly';

      data.hovering = 0;
      if (includeParents && includeChildren) {
        upAndDown(data, traverseCallback, undefined, undefined, includeClones);
      }
      if (includeParents && !includeChildren) {
        up(data, traverseCallback, undefined, includeClones);
      }
      if (!includeParents && includeChildren) {
        down(data, traverseCallback, undefined, includeClones);
      }

      if (data.clone) {
        data.originalNode.hovering = 0;
      } else {
        if (includeClones) {
          for (var i = data.clones.length; i--;) {
            data.clones[i].hovering = 0;
          }
        }
      }

      this.nodes.classed(appliedClassName + '-directly', false);
      this.nodes.classed(appliedClassName + '-indirectly', false);

      if (this.currentLinks[appliedClassName] && this.currentLinks[appliedClassName][data.id]) {
        this.links.highlight(this.currentLinks[appliedClassName][data.id], false, appliedClassName);
      }
    }
  }, {
    key: 'sort',
    value: function sort(update, newSortType) {
      var _this4 = this;

      for (var i = update.length; i--;) {
        var selection = this.nodes.data(update[i].rows, function (data) {
          return data.id;
        });

        this.vis.svgD3.classed('sorting', true);
        selection.transition().duration(TRANSITION_SEMI_FAST).attr('transform', function (data) {
          return 'translate(' + (data.x + _this4.visData.global.column.padding) + ', ' + data.y + ')';
        }).call(allTransitionsEnded, function () {
          _this4.vis.svgD3.classed('sorting', false);
          _this4.vis.updateLevelsVisibility();
          _this4.vis.updateScrolling();
        });

        if (newSortType && this.vis.currentSorting.local[update[i].level].type !== 'name') {
          this.bars.update(selection.selectAll('.bar'), update[i].sortBy);
        }
      }
    }

    /**
     * Updates the nodes' visibility visually.
     *
     * @method  updateVisibility
     * @author  Fritz Lekschas
     * @date    2016-02-21
     */

  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      var _this5 = this;

      // Calls the D3 list graph layout method to update the nodes position.
      this.vis.layout.updateNodesVisibility();

      // Transition to the updated position
      this.nodes.transition().duration(TRANSITION_SEMI_FAST).attr('transform', function (data) {
        return 'translate(' + (data.x + _this5.visData.global.column.padding) + ', ' + data.y + ')';
      }).call(allTransitionsEnded, function () {
        _this5.vis.updateLevelsVisibility();
        _this5.vis.updateScrolling();
        _this5.nodes.call(_this5.isInvisible.bind(_this5));
      });

      this.vis.links.updateVisibility();
    }
  }, {
    key: 'classNnodes',
    get: function get() {
      return CLASS_NODES;
    }
  }, {
    key: 'classNode',
    get: function get() {
      return CLASS_NODE;
    }
  }, {
    key: 'classNodeVisible',
    get: function get() {
      return CLASS_NODE_VISIBLE;
    }
  }, {
    key: 'classClone',
    get: function get() {
      return CLASS_CLONE;
    }
  }, {
    key: 'classLabelWrapper',
    get: function get() {
      return CLASS_LABEL_WRAPPER;
    }
  }, {
    key: 'classFocusControls',
    get: function get() {
      return CLASS_FOCUS_CONTROLS;
    }
  }, {
    key: 'classRoot',
    get: function get() {
      return CLASS_ROOT;
    }
  }, {
    key: 'classQuery',
    get: function get() {
      return CLASS_QUERY;
    }
  }, {
    key: 'classLock',
    get: function get() {
      return CLASS_LOCK;
    }
  }, {
    key: 'barMode',
    get: function get() {
      return this.bars.mode;
    }
  }]);
  return Nodes;
}();

// External
// eslint-disable-line import/no-unresolved

// Internal
/**
 * Class name of scrollbar elements.
 *
 * @type  {String}
 */
var SCROLLBAR_CLASS = 'scrollbar';

var Scrollbars = function () {
  /**
   * [constructor description]
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-14
   * @param   {Object}  baseEl   D3 selection of the element where the
   *   scrollbars should be appended to.
   * @param   {Object}  visData  List Graph App's data.
   * @param   {Number}  width    Width of the scrollbar in pixels.
   */
  function Scrollbars(baseEl, visData, width) {
    classCallCheck(this, Scrollbars);

    this.visData = visData;
    this.width = width;

    // Add empty scrollbar element
    this.all = baseEl.append('rect').attr('class', SCROLLBAR_CLASS).call(function (selection) {
      selection.each(function setScrollBarDomElement() {
        d3.select(this.parentNode).datum().scrollbar.el = this;
      });
    }).attr('x', function (data) {
      return data.scrollbar.x - 2;
    }).attr('y', function (data) {
      return data.scrollbar.y;
    }).attr('width', this.width).attr('height', function (data) {
      return data.scrollbar.height;
    }).attr('rx', this.width / 2).attr('ry', this.width / 2).classed('ready', true);
  }

  /**
   * Update the viisual state of the scrollbar given the current data.
   *
   * @method  updateVisibility
   * @author  Fritz Lekschas
   * @date    2016-09-14
   */


  createClass(Scrollbars, [{
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.all.transition().duration(TRANSITION_LIGHTNING_FAST).attr('x', function (data) {
        return data.scrollbar.x;
      }).attr('height', function (data) {
        return data.scrollbar.height;
      });
    }
  }]);
  return Scrollbars;
}();

// External
// Internal
var Events = function () {
  function Events(el, broadcast) {
    classCallCheck(this, Events);

    if (broadcast && !isFunction(broadcast)) {
      throw new EventDispatcherNoFunction();
    }

    this.el = el;
    this._stack = {};
    this.dispatch = broadcast || this._dispatchEvent;
  }

  createClass(Events, [{
    key: '_dispatchEvent',
    value: function _dispatchEvent(eventName, data) {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, false, false, data);
      this.el.dispatchEvent(event);
    }
  }, {
    key: 'broadcast',
    value: function broadcast(event, data) {
      this.dispatch(event, data);
    }

    /**
     * Add a callback function to an event stack.
     *
     * @method  on
     * @author  Fritz Lekschas
     * @date    2016-01-07
     *
     * @param   {String}    event     Event identifier.
     * @param   {Function}  callback  Function which is called when the event
     *   stack is triggered.
     * @param   {Number}    times     Number of times the callback function should
     *   be triggered before it is removed from the event stack. This is useful
     *   when an event happens only a certain number of times.
     * @return  {Number}              Index of callback, which is needed to
     *   manually remove the callback from the event stack.
     */

  }, {
    key: 'on',
    value: function on(event, callback, times) {
      if (!isFunction(callback)) {
        return false;
      }

      var normTimes = isFinite(times) ? parseInt(times, 10) : Infinity;

      if (isArray(this.stack[event])) {
        return this.stack[event].push({ callback: callback, times: normTimes }) - 1;
      }
      this.stack[event] = [{ callback: callback, times: normTimes }];
      return 0;
    }

    /**
     * Removes a callback function from an event stack given its index.
     *
     * @method  off
     * @author  Fritz Lekschas
     * @date    2016-01-07
     *
     * @param   {String}   event  Event identifier.
     * @param   {Number}   index  Index of the callback to be removed.
     * @return  {Boolean}         Returns `true` if event callback was found and
     *   successfully removed.
     */

  }, {
    key: 'off',
    value: function off(event, index) {
      try {
        this.stack[event].splice(index, 1);
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * Trigger an event stack
     *
     * @method  trigger
     * @author  Fritz Lekschas
     * @date    2016-01-07
     *
     * @param   {String}   event  Event identifier.
     * @return  {Boolean}         Returns `true` if an event stack was found.
     */

  }, {
    key: 'trigger',
    value: function trigger(event, data) {
      if (isArray(this.stack[event])) {
        // Traversing from the end to the start, which has the advantage that
        // deletion of events, i.e. calling `Event.off()` doesn't affect the index
        // of event listeners in the next step.
        for (var i = this.stack[event].length; i--;) {
          // Instead of checking whether `stack[event][i]` is a function here,
          // we do it just once when we add the function to the stack.
          if (this.stack[event][i].times--) {
            this.stack[event][i].callback(data);
          } else {
            this.off(event, i);
          }
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'stack',
    get: function get() {
      return this._stack;
    }
  }]);
  return Events;
}();

function objectOrFunction(x) {
  return typeof x === 'function' || (typeof x === 'object' && x !== null);
}

function isFunction$1(x) {
  return typeof x === 'function';
}

var _isArray;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray$1 = _isArray;

var len = 0;
var vertxNext;
var customSchedulerFn;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
}

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = (typeof window !== 'undefined') ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' &&
  typeof importScripts !== 'undefined' &&
  typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function() {
    process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  return function() {
    vertxNext(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function() {
    node.data = (iterations = ++iterations % 2);
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  return function() {
    setTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i+=2) {
    var callback = queue[i];
    var arg = queue[i+1];

    callback(arg);

    queue[i] = undefined;
    queue[i+1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch(e) {
    return useSetTimeout();
  }
}

var scheduleFlush;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var state = parent._state;

  if (state) {
    var callback = arguments[state - 1];
    asap(function(){
      invokeCallback(state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  var promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING   = void 0;
var FULFILLED = 1;
var REJECTED  = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch(error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch(e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
   asap(function(promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function(value) {
      if (sealed) { return; }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function(reason) {
      if (sealed) { return; }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function(value) {
      _resolve(promise, value);
    }, function(reason) {
      _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor &&
      then$$ === then &&
      constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction$1(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  parent._onerror = null;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) { return; }

  var child, callback, detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch(e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction$1(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }

  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    _resolve(promise, value);
  } else if (failed) {
    _reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    _reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value){
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch(e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray$1(input)) {
    this._input     = input;
    this.length     = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function() {
  var length  = this.length;
  var input   = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator.prototype._eachEntry = function(entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var then$$ = getThen(entry);

    if (then$$ === then &&
        entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof then$$ !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$1) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, then$$);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function(resolve$$) { resolve$$(entry); }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function(state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function(promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function(value) {
    enumerator._settledAt(FULFILLED, i, value);
  }, function(reason) {
    enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  var promise1 = resolve(1);
  var promise2 = resolve(2);
  var promise3 = resolve(3);
  var promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  var promise1 = resolve(1);
  var promise2 = reject(new Error("2"));
  var promise3 = reject(new Error("3"));
  var promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  var promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  var promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  var promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  var promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray$1(entries)) {
    return new Constructor(function(resolve, reject) {
      reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function(resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  var promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  var promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$1(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$1 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve;
Promise$1.reject = reject;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

Promise$1.prototype = {
  constructor: Promise$1,

/**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.

  ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```

  Chaining
  --------

  The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.

  ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });

  findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

  ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```

  Assimilation
  ------------

  Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.

  ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```

  If the assimliated promise rejects, then the downstream promise will also reject.

  ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```

  Simple Example
  --------------

  Synchronous Example

  ```javascript
  var result;

  try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```

  Errback Example

  ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```

  Promise Example;

  ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```

  Advanced Example
  --------------

  Synchronous Example

  ```javascript
  var author, books;

  try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```

  Errback Example

  ```js

  function foundBooks(books) {

  }

  function failure(reason) {

  }

  findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```

  Promise Example;

  ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```

  @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
*/
  then: then,

/**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.

  ```js
  function findAuthor(){
    throw new Error('couldn't find that author');
  }

  // synchronous
  try {
    findAuthor();
  } catch(reason) {
    // something went wrong
  }

  // async with promises
  findAuthor().catch(function(reason){
    // something went wrong
  });
  ```

  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
*/
  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString$1.call(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Polyfill-safe method for requesting an animation frame
 *
 * @method  requestAnimationFrame
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Function}  callback  Function to be called after a animation frame
 *   has been delivered.
 * @return  {Integer}             ID of the request.
 */
var requestAnimationFrame = function () {
  var lastTime = 0;

  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}();

/**
 * Polyfill-safe method for canceling a requested animation frame
 *
 * @method  cancelAnimationFrame
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Integer}  id  ID of the animation frame request to be canceled.
 */
var cancelAnimationFrame = function () {
  return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (id) {
    window.clearTimeout(id);
  };
}();

/**
 * Requests the next animation frame.
 *
 * @method  nextAnimationFrame
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @return  {Object}  Object holding the _request_ and _cancel_ method for
 *   requesting the next animation frame.
 */
var nextAnimationFrame = function () {
  var ids = {};

  function requestId() {
    var id = void 0;
    do {
      id = Math.floor(Math.random() * 1E9);
    } while (id in ids);
    return id;
  }

  return {
    request: window.requestNextAnimationFrame || function (callback, element) {
      var id = requestId();

      ids[id] = requestAnimationFrame(function () {
        ids[id] = requestAnimationFrame(function (ts) {
          delete ids[id];
          callback(ts);
        }, element);
      }, element);

      return id;
    },
    cancel: window.cancelNextAnimationFrame || function (id) {
      if (ids[id]) {
        cancelAnimationFrame(ids[id]);
        delete ids[id];
      }
    }
  };
}();

var requestNextAnimationFrame = nextAnimationFrame.request;

// External
// eslint-disable-line import/no-unresolved
// Internal
/**
 * Class name assigned to the context menu's root element
 *
 * @type  {String}
 */
var CLASS_NAME = 'context-menu';

/**
 * Class name assigned to checkboxes.
 *
 * @type  {String}
 */
var CLASS_CHECKBOX = 'checkbox';

/**
 * Size of the dialog arrow in pixel.
 *
 * @type  {Number}
 */
var ARROW_SIZE = 6;

/**
 * General transition speed.
 *
 * @type  {Number}
 */
var TRANSITION_SPEED = 125;

/**
 * Time in milliseconds before the query button click actially triggers its
 * action.
 *
 * The time is resetted every time the user clicks on the button again within
 * the time interval.
 *
 * @type  {Number}
 */
var BUTTON_QUERY_DEBOUNCE = 666;

/**
 * Time in milliseconds before the root button click actially triggers its
 * action.
 *
 * The time is resetted every time the user clicks on the button again within
 * the time interval.
 *
 * @type  {Number}
 */
var BUTTON_ROOT_DEBOUNCE = 500;

/**
 * Default time in milliseconds before a button click actially triggers its
 * action.
 *
 * The time is resetted every time the user clicks on the button again within
 * the time interval.
 *
 * @type  {Number}
 */
var BUTTON_DEFAULT_DEBOUNCE = 150;

/**
 * [BUTTON_BAM_EFFECT_ANIMATION_TIME description]
 *
 * @type  {Number}
 */
var BUTTON_BAM_EFFECT_ANIMATION_TIME = 700;

var NodeContextMenu = function () {
  /**
   * Node context menu constructor
   *
   * @description
   * The `init` object must contain the follow properties:
   *  - visData: the List Graph App's data. [Object]
   *  - baseEl: D3 selection of the base element. [Object]
   *  - events: the List Graph App's event library. [Object]
   *  - nodes: the List Graph App's nodes. [Object]
   *  - infoFields: the List Graph App's info field definition. [Object]
   *  - iconPath: the List Graph App's `iconPath`. [String]
   *  - isQueryable: If `true` the query button will be shown. [Boolean]
   *  - isDebounced: If `true` the menu will be debounced. [Boolean]
   *
   * @example
   * ```
   *  const nodeContextMenu = new NodeContextMenu({
   *   visData: {...},
   *   baseEl: {...},
   *   events: {...},
   *   nodes: {...},
   *   infoFields: {...},
   *   iconPath: '...',
   *   isQueryable: true,
   *   isDebounced: true
   * });
   * ```
   *
   * @method  constructor
   * @author  Fritz Lekschas
   * @date    2016-09-13
   * @param   {Object}   init  Initialization object. See example.
   */
  function NodeContextMenu(init) {
    classCallCheck(this, NodeContextMenu);

    var self = this;

    this._x = 0;
    this._y = 0;
    this._yOffset = 0;
    this._scale = 0;

    this.visData = init.visData;
    this.baseEl = init.baseEl;
    this.events = init.events;
    this.nodes = init.nodes;
    this.isQueryable = init.isQueryable;
    this.infoFields = init.infoFields;
    this.isDebounced = init.isDebounced;
    this.iconPath = init.iconPath;

    this.numButtonRows = 1;
    this.numButtonRows = this.isQueryable ? ++this.numButtonRows : this.numButtonRows;
    this.numButtonRows = this.infoFields && this.infoFields.length ? ++this.numButtonRows : this.numButtonRows;

    this.height = this.visData.global.row.height * this.numButtonRows;
    this.toBottom = false;

    this.nodeInfoId = 0;

    this.wrapper = this.baseEl.append('g').attr('class', CLASS_NAME);

    this.updateAppearance();

    this.bgWrapper = this.wrapper.append('g').classed('bgOuterWrapper', true).attr('transform', 'translate(' + this.visData.global.column.width / 2 + ' ' + this.height / 2 + ')').append('g').classed('bgInnerWrapper', true);

    this.bgBorder = this.bgWrapper.append('path').attr('class', 'bgBorder').attr('d', dropMenu({
      x: -1,
      y: -1,
      width: this.visData.global.column.width + 2,
      height: this.height + 2,
      radius: ARROW_SIZE - 2,
      arrowSize: ARROW_SIZE
    })).attr('transform', 'translate(' + -this.visData.global.column.width / 2 + ' ' + -this.height / 2 + ')');

    this.bg = this.bgWrapper.append('path').attr('class', 'bg').attr('d', dropMenu({
      x: 0,
      y: 0,
      width: this.visData.global.column.width,
      height: this.height,
      radius: ARROW_SIZE - 1,
      arrowSize: ARROW_SIZE
    })).style('filter', 'url(#drop-shadow-context-menu)').attr('transform', 'translate(' + -this.visData.global.column.width / 2 + ' ' + -this.height / 2 + ')');

    if (this.infoFields && this.infoFields.length) {
      this.textNodeInfo = this.wrapper.append('g').call(this.createTextField.bind(this), {
        alignRight: false,
        classNames: [],
        distanceFromCenter: this.isQueryable ? 2 : 1,
        fullWidth: true,
        labels: this.infoFields
      }, this.infoFields.length > 1);

      if (this.infoFields.length > 1) {
        var toggler = this.textNodeInfo.append('g').attr('class', 'toggler').on('click', function () {
          self.clickNodeInfo.call(self, this);
        });

        var togglerX = this.visData.global.column.width - this.visData.global.row.contentHeight - this.visData.global.row.padding + this.visData.global.cell.padding;

        var togglerY = this.visData.global.row.padding + this.visData.global.cell.padding;

        toggler.append('rect').attr('class', 'bg').attr('x', togglerX).attr('y', togglerY).attr('width', this.visData.global.row.contentHeight).attr('height', this.visData.global.row.contentHeight);

        toggler.append('use').attr('x', togglerX + (this.visData.global.row.contentHeight - 10) / 2).attr('y', togglerY + (this.visData.global.row.contentHeight - 10) / 2).attr('width', 10).attr('height', 10).attr('xlink:href', this.iconPath + '#arrow-right');
      }
    }

    if (this.isQueryable) {
      this.buttonQuery = this.wrapper.append('g').call(this.createButton.bind(this), {
        alignRight: false,
        classNames: [],
        distanceFromCenter: 1,
        fullWidth: true,
        label: 'Query',
        labelTwo: true,
        bamEffect: true
      }).on('click', function () {
        self.clickQueryHandler.call(self, this);
      });
      this.buttonQueryFill = this.buttonQuery.select('.bg-fill-effect');
      this.buttonQueryBamEffect = this.buttonQuery.select('.bg-bam-effect');
    }

    this.buttonRoot = this.wrapper.append('g').call(this.createButton.bind(this), {
      alignRight: false,
      classNames: [],
      distanceFromCenter: 0,
      fullWidth: false,
      label: 'Root'
    }).on('click', function () {
      self.clickRootHandler.call(self, this);
    });
    this.buttonRootFill = this.buttonRoot.select('.bg-fill-effect');
    this.checkboxRoot = this.createCheckbox(this.buttonRoot);

    this.buttonLock = this.wrapper.append('g').call(this.createButton.bind(this), {
      alignRight: true,
      classNames: [],
      distanceFromCenter: 0,
      fullWidth: false,
      label: 'Lock',
      bamEffect: true
    }).on('click', function () {
      self.clickLockHandler.call(self, this);
    });
    this.buttonLockFill = this.buttonLock.select('.bg-fill-effect');
    this.buttonLockBamEffect = this.buttonLock.select('.bg-bam-effect');
    this.checkboxLock = this.createCheckbox(this.buttonLock);

    this.components = this.wrapper.selectAll('.component');

    this.debouncedQueryHandler = debounce(this.queryHandler, BUTTON_QUERY_DEBOUNCE);
    this.debouncedRootHandler = debounce(this.rootHandler, BUTTON_ROOT_DEBOUNCE);
  }

  /* ---------------------------------------------------------------------------
   * Getter / Setter
   * ------------------------------------------------------------------------ */

  /**
   * Generates CSS string for scaling.
   *
   * @method  scale
   * @author  Fritz Lekschas
   * @date    2016-09-13
   * @return  {String}  CSS formatted string containing the scale.
   */


  createClass(NodeContextMenu, [{
    key: 'addLabel',


    /* ---------------------------------------------------------------------------
     * Methods
     * ------------------------------------------------------------------------ */

    /* ---------------------------------- A ----------------------------------- */

    /**
     * Adds a XHTML-based text elements for labelling.
     *
     * @method  addLabel
     * @author  Fritz Lekschas
     * @date    2016-09-15
     * @param   {Object}   selection   D3 selection where the label should be
     *   added to.
     * @param   {Boolean}  fullWidth   If `true` the label is drawn over the full
     *   width.
     * @param   {String}   label       First label text.
     * @param   {String}   labelTwo    Second label text.
     * @param   {Boolean}  isToggable  If `true` substracts the toggler width.
     *   This is only needed because the because Firefox's layering system seems
     *   to be buggy when it comes to `foreignObject`s. For whatever reason the
     *   `foreignObject` is drawn on top of the following `g` even though in SVG
     *   it should be the other way around.
     */
    value: function addLabel(selection, fullWidth, label, labelTwo, isToggable) {
      var width = this.visData.global.column.width * (fullWidth ? 1 : 0.5) - this.visData.global.row.padding * 4 - (isToggable ? this.visData.global.row.contentHeight : 0);

      var height = this.visData.global.row.contentHeight - this.visData.global.cell.padding * 2;

      var div = selection.append('foreignObject').attr('x', this.visData.global.row.padding * 2).attr('y', this.visData.global.row.padding + this.visData.global.cell.padding).attr('width', width).attr('height', height).attr('class', 'label-wrapper').append('xhtml:div').style('line-height', height - 2 + 'px').style('width', width + 'px');

      div.append('xhtml:span').attr('class', 'label').text(label);

      if (labelTwo) {
        div.append('xhtml:span').attr('class', 'separator').text(':');
        div.append('xhtml:span').attr('class', 'label-two');
      }
    }

    /* ---------------------------------- C ----------------------------------- */

    /**
     * Check the state of the lock button and alter its appearance accordingly.
     *
     * @method  checkLock
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @return  {Boolean}  If `true` the lock button is active.
     */

  }, {
    key: 'checkLock',
    value: function checkLock() {
      var checked = this.node.datum().data.state.lock;
      this.buttonLock.classed('semi-active', checked);
      this.checkboxLock.style('transform', 'translateX(' + (checked ? this.checkBoxMovement : 0) + 'px)');
      if (checked) {
        this.fillButton(this.buttonLockFill);
      } else {
        this.emptyButton(this.buttonLockFill);
      }
      return checked;
    }

    /**
     * Check how the menu needs to be oriented, i.e., above or below the node.
     *
     * @method  checkOrientation
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'checkOrientation',
    value: function checkOrientation() {
      if (this._y + this._yOffset >= 0) {
        this.toBottom = false;
      } else {
        this.toBottom = true;
      }
      this.components.call(this.positionComponent.bind(this));
      this.bgWrapper.classed('is-mirrored-horizontally', this.toBottom);

      var translate = 'translate(' + -this.visData.global.column.width / 2 + ' ' + -(this.height / 2 + (this.toBottom ? ARROW_SIZE : 0)) + ')';

      this.bg.attr('transform', translate).style('filter', 'url(#drop-shadow-context-menu' + (this.toBottom ? '-inverted' : '') + ')');

      this.bgBorder.attr('transform', translate);
    }

    /**
     * Check state of the root button and alter appearance accordingly.
     *
     * @method  checkRoot
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Boolean}  debounced  If `true` the root button will be debounced
     *   by `time`.
     * @param   {Number}   time       Debounce time in milliseconds.
     */

  }, {
    key: 'checkRoot',
    value: function checkRoot(debounced, time) {
      var state = this.node.datum().data.state.root;
      var checked = state;

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
            this.hideElement(this.buttonRootFill);
          }
        } else {
          this.emptyButton(this.buttonRootFill, time);
        }
      } else {
        if (debounced) {
          if (!checked) {
            this.emptyButton(this.buttonRootFill, time);
          } else {
            this.showElement(this.buttonRootFill);
          }
        } else {
          this.fillButton(this.buttonRootFill, time);
        }
      }

      this.buttonRoot.classed('semi-active', checked);
      this.checkboxRoot.style('transform', 'translateX(' + (checked ? this.checkBoxMovement : 0) + 'px)');
    }

    /**
     * Click handler of the lock button.
     *
     * @method  clickLockHandler
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'clickLockHandler',
    value: function clickLockHandler() {
      var _this = this;

      this.buttonLock.classed('fill-effect', true);
      this.nodes.lockHandler(this.node);
      var checked = this.checkLock();
      if (checked) {
        this.buttonLock.classed('active', true);
      } else {
        this.buttonLock.classed('active', false);
      }
      setTimeout(function () {
        if (checked) {
          _this.triggerButtonBamEffect(_this.buttonLockBamEffect);
        }
        _this.buttonLock.classed('fill-effect', false);
      }, BUTTON_DEFAULT_DEBOUNCE);
    }

    /**
     * Click handler of the info button.
     *
     * @method  clickNodeInfo
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'clickNodeInfo',
    value: function clickNodeInfo() {
      this.nodeInfoId = (this.nodeInfoId + 1) % this.infoFields.length;

      this.textNodeInfo.select('.label').text(this.infoFields[this.nodeInfoId].label);

      this.textNodeInfo.select('.label-two').text(this.getNodeProperty(this.infoFields[this.nodeInfoId].property));
    }

    /**
     * Click handler of the query button.
     *
     * @method  clickQueryHandler
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'clickQueryHandler',
    value: function clickQueryHandler() {
      this.buttonQuery.classed('fill-effect', true);
      this.updateQuery(true, BUTTON_QUERY_DEBOUNCE);
      if (this.isDebounced) {
        this.debouncedQueryHandler(true);
      } else {
        this.queryHandler();
      }
    }

    /**
     * Click handler of the root button.
     *
     * @method  clickRootHandler
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'clickRootHandler',
    value: function clickRootHandler() {
      this.buttonRoot.classed('fill-effect', true);
      this.checkRoot(true, BUTTON_ROOT_DEBOUNCE);
      if (this.isDebounced) {
        this.debouncedRootHandler(true);
      } else {
        this.rootHandler();
      }
    }

    /**
     * Closes the menu.
     *
     * @method  close
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @return  {Object}  Promise resolving to `true` when the menu is closed.
     */

  }, {
    key: 'close',
    value: function close() {
      var _this2 = this;

      if (!this.closing) {
        this.closing = new Promise$1(function (resolve) {
          _this2.opened = false;
          _this2.updateAppearance();

          setTimeout(function () {
            _this2.visible = false;
            _this2.updateAppearance();
            resolve(_this2.node.datum().id);
            _this2.node = undefined;
          }, TRANSITION_SPEED);
        });
      }
      return this.closing;
    }

    /**
     * Helper method to create and append a button.
     *
     * @description
     * The `properties` variable needs to contain the following properties:
     *  - fullWidth: If `true` draws the button over the full width. [Boolean]
     *  - label: The first label. Considered the main label if `labelTwo` is
     *    `undefined`. [String]
     *  - labelTwo: Second label. Considered the main label when given.
     *
     * @method  createButton
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection   D3 selection where the button should be
     *   appended to.
     * @param   {Object}  properties  The button's properties.
     */

  }, {
    key: 'createButton',
    value: function createButton(selection, properties) {
      var classNames = 'component button';
      if (properties.classNames && properties.classNames.length) {
        classNames += ' ' + properties.classNames.join(' ');
      }
      selection.attr('class', classNames);

      selection.datum(properties).call(this.createButtonBg.bind(this), {
        bamEffect: properties.bamEffect,
        fullWidth: properties.fullWidth
      }).call(this.addLabel.bind(this), properties.fullWidth, properties.label, properties.labelTwo).call(this.positionComponent.bind(this), properties.distanceFromCenter, properties.alignRight);
    }

    /**
     * Helper method to create and append a button background.
     *
     * @description
     * The `properties` variable needs to contain the following properties:
     *  - fullWidth: If `true` draws the button over the full width. [Boolean]
     *  - bamEffect: If `true` adds an extra element for the click-bam-effect.
     *
     * @method  createButtonBg
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection   D3 selection where the background element
     *   should be appended to.
     * @param   {Object}  properties  The background element's properties.
     */

  }, {
    key: 'createButtonBg',
    value: function createButtonBg(selection, properties) {
      var _this3 = this;

      selection.datum(function (data) {
        data.x = _this3.visData.global.row.padding;
        data.y = _this3.visData.global.row.padding;
        data.width = _this3.visData.global.column.width * (properties.fullWidth ? 1 : 0.5) - _this3.visData.global.row.padding * 2;
        data.height = _this3.visData.global.row.contentHeight;
        data.rx = 2;
        data.ry = 2;

        return data;
      }).append('rect').attr('class', 'bg').attr('x', function (data) {
        return data.x;
      }).attr('y', function (data) {
        return data.y;
      }).attr('width', function (data) {
        return data.width;
      }).attr('height', function (data) {
        return data.height;
      }).attr('rx', function (data) {
        return data.rx;
      }).attr('ry', function (data) {
        return data.ry;
      });

      selection.append('rect').attr('class', 'bg-fill-effect').attr('x', function (data) {
        return data.x;
      }).attr('y', function (data) {
        return data.y;
      }).attr('width', function (data) {
        return data.width;
      }).attr('height', 0).attr('rx', function (data) {
        return data.rx;
      }).attr('ry', function (data) {
        return data.ry;
      });

      if (properties.bamEffect) {
        selection.append('g').attr('transform', function (data) {
          return 'translate(' + data.width / 2 + ' ' + data.height / 2 + ')';
        }).append('g').attr('class', 'bam-effect').append('rect').attr('class', 'bam-effect-bg').attr('x', function (data) {
          return data.x;
        }).attr('y', function (data) {
          return data.y;
        }).attr('width', function (data) {
          return data.width;
        }).attr('height', function (data) {
          return data.height;
        }).attr('rx', function (data) {
          return data.rx;
        }).attr('ry', function (data) {
          return data.ry;
        }).attr('transform', function (data) {
          return 'translate(' + -data.width / 2 + ' ' + -data.height / 2 + ')';
        });
      }
    }

    /**
     * Helper method to create and append a checkbox-like button.
     *
     * @method  createCheckbox
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection  D3 selection where the checkbox element
     *   should be appended to.
     */

  }, {
    key: 'createCheckbox',
    value: function createCheckbox(selection) {
      var height = Math.round(selection.datum().height / 2);
      var x = -1.75 * height + this.visData.global.row.padding;

      var container = selection.append('g').attr('class', CLASS_CHECKBOX);

      container.append('rect').attr('class', 'checkbox-bg').attr('x', function (data) {
        return data.width + x;
      }).attr('y', height / 2 + this.visData.global.row.padding).attr('width', height * 1.5).attr('height', height).attr('rx', height / 2).attr('ry', height / 2);

      this.checkBoxMovement = (height - 2) / 2;

      return container.append('rect').attr('class', 'checkbox-knob').attr('x', function (data) {
        return data.width + x + 1;
      }).attr('y', height / 2 + this.visData.global.row.padding + 1).attr('width', height - 2).attr('height', height - 2).attr('rx', height - 2);
    }

    /**
     * Helper method to create and append a text field.
     *
     * @method  createTextField
     * @author  Fritz Lekschas
     * @date    2016-09-15
     * @param   {Object}  selection   D3 selection where the text field should be
     *   appended to.
     * @param   {Object}  properties  The text field's properties.
     * @param   {Boolean}  isToggable  If `true` substracts the toggler width.
     *   This is only needed because the because Firefox's layering system seems
     *   to be buggy when it comes to `foreignObject`s. For whatever reason the
     *   `foreignObject` is drawn on top of the following `g` even though in SVG
     *   it should be the other way around.
     */

  }, {
    key: 'createTextField',
    value: function createTextField(selection, properties, isToggable) {
      var classNames = 'component text-field';
      if (properties.classNames && properties.classNames.length) {
        classNames += ' ' + properties.classNames.join(' ');
      }
      selection.attr('class', classNames);

      selection.datum(properties).call(this.addLabel.bind(this), true, properties.labels[this.nodeInfoId].label, true, isToggable).call(this.positionComponent.bind(this), properties.distanceFromCenter, properties.alignRight);
    }

    /* ---------------------------------- E ----------------------------------- */

    /**
     * Transitions out an element top down.
     *
     * @method  emptyButton
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection   D3 selection of the element to be
     *   transitioned.
     * @param   {Number}  time       Transition time in milliseconds.
     */

  }, {
    key: 'emptyButton',
    value: function emptyButton(selection, time) {
      selection.transition().duration(0).attr('y', function (data) {
        return data.y;
      }).attr('height', function (data) {
        return data.height;
      }).call(allTransitionsEnded, function () {
        selection.transition().duration(time || BUTTON_DEFAULT_DEBOUNCE).ease(d3.easeLinear).attr('y', function (data) {
          return data.height;
        }).attr('height', 0);
      });
    }

    /* ---------------------------------- F ----------------------------------- */

    /**
     * Transitions in an element top down.
     *
     * @method  fillButton
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection   D3 selection of the element to be
     *   transitioned.
     * @param   {Number}  time       Transition time in milliseconds.
     */

  }, {
    key: 'fillButton',
    value: function fillButton(selection, time) {
      selection.transition().duration(0).attr('y', function (data) {
        return data.y;
      }).attr('height', 0).call(allTransitionsEnded, function () {
        selection.transition().duration(time || BUTTON_DEFAULT_DEBOUNCE).ease(d3.easeLinear).attr('height', function (data) {
          return data.height;
        });
      });
    }

    /* ---------------------------------- G ----------------------------------- */

    /**
     * Helper method to access a node property.
     *
     * @method  getNodeProperty
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Function}  callback  Callback returning a property of the node.
     * @return  {*}                   The value returned by the callback.
     */

  }, {
    key: 'getNodeProperty',
    value: function getNodeProperty(callback) {
      try {
        return callback(this.node.datum());
      } catch (e) {
        return undefined;
      }
    }

    /* ---------------------------------- H ----------------------------------- */

    /**
     * Hide an element by setting the height to zero.
     *
     * @method  hideElement
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection  D3 selection of element to be hidden.
     */

  }, {
    key: 'hideElement',
    value: function hideElement(selection) {
      selection.transition().duration(0).attr('height', 0);
    }

    /* ---------------------------------- I ----------------------------------- */

    /**
     * Check if menu is opened in the same column already.
     *
     * @method  isOpenSameColumn
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Number}   columnNum  Column number.
     * @return  {Boolean}             If `true` menu is opened and in the same
     *   column.
     */

  }, {
    key: 'isOpenSameColumn',
    value: function isOpenSameColumn(columnNum) {
      return this.opened && this.node.datum().depth === columnNum;
    }

    /* ---------------------------------- O ----------------------------------- */

    /**
     * Opens the menu.
     *
     * @method  open
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  node  D3 selection of the node the menu relates to.
     */

  }, {
    key: 'open',
    value: function open(node) {
      var _this4 = this;

      return new Promise$1(function (resolve) {
        _this4.node = node;
        _this4.closing = undefined;

        _this4.updateStates();

        _this4._yOffset = _this4.visData.nodes[_this4.node.datum().depth].scrollTop;
        _this4.translate = {
          x: _this4.node.datum().x,
          y: _this4.node.datum().y - _this4.height
        };
        _this4.checkOrientation();

        _this4.updateAppearance();
        _this4.opened = true;
        _this4.visible = true;

        requestNextAnimationFrame(function () {
          _this4.updateAppearance();
          setTimeout(function () {
            resolve(true);
          }, TRANSITION_SPEED);
        });
      });
    }

    /* ---------------------------------- P ----------------------------------- */

    /**
     * Positions component.
     *
     * @method  positionComponent
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}   selection           D3 selection of the element to be
     *   positioned.
     * @param   {Boolean}  distanceFromCenter  If `true` positions component from
     *   the center.
     * @param   {Boolean}  alignRight          If `true` aligns component to the
     *   right.
     * @return  {String}                       CSS-formatted translation string.
     */

  }, {
    key: 'positionComponent',
    value: function positionComponent(selection, distanceFromCenter, alignRight) {
      var _this5 = this;

      selection.datum(function (data) {
        // Lets cache some values to make our lives easier when checking the
        // position again in `checkOrientation`.
        if (distanceFromCenter) {
          data.distanceFromCenter = distanceFromCenter;
        }
        if (alignRight) {
          data.alignRight = alignRight;
        }
        return data;
      }).attr('transform', function (data) {
        var x = data.alignRight ? _this5.visData.global.column.width / 2 : 0;
        // When the buttons are created I assume self the menu is positioned
        // above the node; i.e. `distanceFromCenter` needs to be inverted.
        var y = _this5.visData.global.row.height * (_this5.toBottom ? data.distanceFromCenter : _this5.numButtonRows - data.distanceFromCenter - 1) + (_this5.toBottom ? ARROW_SIZE : 0);

        return 'translate(' + x + ', ' + y + ')';
      });
    }

    /* ---------------------------------- Q ----------------------------------- */

    /**
     * Handle the four different query states: none, or, and, and not.
     *
     * @method  queryHandler
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Boolean}  debounced  If `true` the handler will debounce.
     */

  }, {
    key: 'queryHandler',
    value: function queryHandler(debounced) {
      if (debounced) {
        if (this.tempQueryMode !== this.currentQueryMode) {
          if (this.tempQueryMode) {
            this.nodes.queryHandler(this.node, 'query', this.tempQueryMode);
            this.triggerButtonBamEffect(this.buttonQueryBamEffect);
            this.buttonQuery.classed('active', true);
          } else {
            this.nodes.queryHandler(this.node, 'unquery');
            this.buttonQuery.classed('active', false);
          }
        }
      } else {
        this.nodes.queryHandler(this.node);
      }

      // Reset temporary query modes.
      this.tempQueryMode = undefined;
      this.currentQueryMode = undefined;
      this.buttonQuery.classed('fill-effect', false);
    }

    /* ---------------------------------- R ----------------------------------- */

    /**
     * Handle re-rooting of the graph.
     *
     * @method  rootHandler
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Boolean}  debounced  If `true` the handler will debounce.
     */

  }, {
    key: 'rootHandler',
    value: function rootHandler(debounced) {
      if (!debounced || this.tempRoot !== this.currentRootState) {
        this.close();
        this.nodes.rootHandler(this.node);
      }

      // Reset temporary root values.
      this.tempRoot = undefined;
      this.currentRootState = undefined;
      this.buttonRoot.classed('fill-effect', false);

      this.buttonRoot.classed('active', this.node.datum().data.state.root);
    }

    /* ---------------------------------- S ----------------------------------- */

    /**
     * Scrolls the menu vertically.
     *
     * @method  scrollY
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Number}  offset  Scroll related offset.
     */

  }, {
    key: 'scrollY',
    value: function scrollY(offset) {
      this._yOffset = offset;
      this.updateAppearance();
    }

    /**
     * Transition element in by resetting its original height.
     *
     * @method  showElement
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  selection  D3 selection to be transitioned in.
     */

  }, {
    key: 'showElement',
    value: function showElement(selection) {
      selection.transition().duration(0).attr('y', function (data) {
        return data.y;
      }).attr('height', function (data) {
        return data.height;
      });
    }

    /* ---------------------------------- T ----------------------------------- */

    /**
     * Toggle menu visibility
     *
     * @method  toggle
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  node  D3 selection of the related node.
     */

  }, {
    key: 'toggle',
    value: function toggle(node) {
      var _this6 = this;

      return new Promise$1(function (resolve) {
        var nodeId = node.datum().id;
        var closed = Promise$1.resolve();

        if (_this6.visible) {
          closed = _this6.close();
        }

        closed.then(function (previousNodeId) {
          if (nodeId !== previousNodeId) {
            _this6.open(node).then(function () {
              resolve(nodeId);
            });
          } else {
            resolve(nodeId);
          }
        });
      });
    }

    /**
     * Call button BAM effect.
     *
     * @method  triggerButtonBamEffect
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  node  D3 selection of the button to be BAM-effected.
     */

  }, {
    key: 'triggerButtonBamEffect',
    value: function triggerButtonBamEffect(button) {
      button.classed('active', true);
      setTimeout(function () {
        button.classed('active', false);
      }, BUTTON_BAM_EFFECT_ANIMATION_TIME);
    }

    /* ---------------------------------- U ----------------------------------- */

    /**
     * Update appearance of the menu.
     *
     * @method  updateAppearance
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'updateAppearance',
    value: function updateAppearance() {
      var centerY = this.toBottom ? 0 : this.height + this.visData.global.row.height;

      this.wrapper.classed('transitionable', this.visible).classed('open', this.opened).style('transform', this.translate + ' ' + this.scale).style('transform-origin', this.visData.global.column.width / 2 + 'px ' + centerY + 'px');
    }

    /**
     * Toggle through the info text fields.
     *
     * @method  updateInfoText
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'updateInfoText',
    value: function updateInfoText() {
      if (!this.infoFields || !this.infoFields.length) {
        return;
      }

      this.textNodeInfo.select('.label').text(this.infoFields[this.nodeInfoId].label);

      this.textNodeInfo.select('.label-two').text(this.getNodeProperty(this.infoFields[this.nodeInfoId].property));
    }

    /**
     * Open menu on another node.
     *
     * @description
     * Updates the position of the menu and its content.
     *
     * @method  updatePosition
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'updatePosition',
    value: function updatePosition() {
      if (this.node && this.opened) {
        this.open(this.node);
      }
    }

    /**
     * Update querying when toggling through different query options.
     *
     * @method  updateQuery
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Boolean}  debounced  If `true` debounces querying.
     * @param   {Number}   time       Debounce time in milliseconds.
     */

  }, {
    key: 'updateQuery',
    value: function updateQuery(debounced, time) {
      if (!this.isQueryable) {
        return;
      }

      var state = this.node.datum().data.state.query;
      var queryMode = state;

      function nextQueryMode(mode) {
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
            this.showElement(this.buttonQueryFill);
          } else {
            this.fillButton(this.buttonQueryFill, time);
          }
        } else {
          if (state) {
            this.emptyButton(this.buttonQueryFill, time);
          } else {
            this.hideElement(this.buttonQueryFill);
          }
        }
      } else {
        this.emptyButton(this.buttonQueryFill, time);
      }

      this.buttonQuery.classed('semi-active', !!queryMode).classed('active', !!state).select('.label-two').text(queryMode || 'not queried').classed('inactive', !queryMode);
    }

    /**
     * Helper method to trigger a check of all buttons and text fields.
     *
     * @method  updateStates
     * @author  Fritz Lekschas
     * @date    2016-09-13
     */

  }, {
    key: 'updateStates',
    value: function updateStates() {
      if (this.node) {
        this.checkLock();
        this.checkRoot();
        this.updateQuery();
        this.updateInfoText();
      }
    }
  }, {
    key: 'scale',
    get: function get() {
      return 'scale(' + (this.opened ? 1 : 0.5) + ')';
    }

    /**
     * Generates a CSS string for translation
     *
     * @method  translate
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @return  {String}  CSS formatted string containing the translate.
     */

  }, {
    key: 'translate',
    get: function get() {
      var y = this.toBottom ? this._y + this.height + this.visData.global.row.height - ARROW_SIZE : this._y;

      return 'translate(' + this._x + 'px,' + (y + this._yOffset) + 'px)';
    }

    /**
     * Set x and y values.
     *
     * @method  translate
     * @author  Fritz Lekschas
     * @date    2016-09-13
     * @param   {Object}  position  Object containing x and y coordinates.
     */
    ,
    set: function set(position) {
      this._x = position.x;
      this._y = position.y;
    }
  }]);
  return NodeContextMenu;
}();

/* eslint no-shadow: 0 */

// External
// Internal
var LimitsUnsupportedFormat = function (_ExtendableError) {
  inherits(LimitsUnsupportedFormat, _ExtendableError);

  function LimitsUnsupportedFormat(message) {
    classCallCheck(this, LimitsUnsupportedFormat);
    return possibleConstructorReturn(this, (LimitsUnsupportedFormat.__proto__ || Object.getPrototypeOf(LimitsUnsupportedFormat)).call(this, message || 'The limits are wrongly formatted. Please provide an ' + 'object of the following format: `{ x: { min: 0, max: 1 }, y: { min: ' + '0, max: 1 } }`'));
  }

  return LimitsUnsupportedFormat;
}(ExtendableError);

/**
 * Drap and drop event handler that works via translation.
 *
 * @method  onDragDrop
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}  selection        D3 selection to listen for the drag
 *   event.
 * @param   {Object}           dragMoveHandler         Handler for drag-move.
 * @param   {Object}           dropHandler             Handler for drag-end,
 *   i.e. drop.
 * @param   {Array}            elsToBeDragged          Array of D3 selections to
 *   be moved according to the drag event. If empty or undefined `selection`
 *   will be used.
 * @param   {String}           orientation             Can either be
 *   "horizontal", "vertical" or `undefined`, i.e. both directions.
 * @param   {Object|Function}  limits                  X and Y drag limits. E.g.
 *   `{ x: { min: 0, max: 10 } }`.
 * @param   {Array}             noDraggingWhenTrue     List if function
 *   returning a Boolean value which should prevent the dragMoveHandler from
 *   working.
 * @param   {String}           clickTolerance          Specify the number of
 *   pixel that are allowed to move but still trigger a click event. Sometimes
 *   it is useful to allow the user to move 1 or 2 pixel, especially in high
 *   res environments. [Default is 0]
 */
function onDragDrop(selection, dragStartHandler, dragMoveHandler, dropHandler, elsToBeDragged, orientation, limits, noDraggingWhenTrue, dragData, clickTolerance) {
  var drag = d3.drag();
  var checkWhenDragging = isFunction(noDraggingWhenTrue);

  var appliedLimits = limits || {}; // eslint-disable-line no-param-reassign

  var filter = function filter() {
    return !(checkWhenDragging && noDraggingWhenTrue());
  };

  drag.filter(filter);

  var d2 = void 0;

  drag.on('start', function () {
    d2 = 0;
    if (typeof limits === 'function') {
      appliedLimits = limits();
    }
  });

  if (dragMoveHandler) {
    drag.on('drag', function (data) {
      if (checkWhenDragging && noDraggingWhenTrue()) {
        return;
      }
      d3.event.sourceEvent.preventDefault();
      dragStartHandler();
      dragMoveHandler.call(this, data, elsToBeDragged, orientation, appliedLimits);

      d2 += d3.event.dx * d3.event.dx + d3.event.dy * d3.event.dy;
    });
  }

  if (dropHandler) {
    drag.on('end', function () {
      dropHandler.call(this);

      if (d2 <= (clickTolerance || 0)) {
        // Don't supress the click event for minor mouse movements.
        d3.select(window).on('click.drag', null);
      }
    });
  }

  selection.each(function (data) {
    var el = d3.select(this);

    // Set default data if not available.
    if (!data) {
      data = { drag: dragData }; // eslint-disable-line no-param-reassign
      el.datum(data);
    }

    // Add drag event handler
    el.call(drag);
  });
}

/**
 * Custom drag-move handler used by the custom drag-drop handler.
 *
 * @method  dragMoveHandler
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}           data            D3's drag event object.
 * @param   {Array}            elsToBeDragged  Array of D3 selections.
 * @param   {String}           orientation     Can either be "horizontal",
 *   "vertical" or `undefined`, i.e. both directions.
 * @param   {Object|Function}  limits          X and Y drag limits. E.g.
 *   `{ x: { min: 0, max: 10 } }`.
 */
function dragMoveHandler(data, elsToBeDragged, orientation, limits) {
  var els = d3.select(this);

  if (elsToBeDragged && elsToBeDragged.length) {
    els = mergeSelections(elsToBeDragged);
  }

  function withinLimits(value, applyingLimits) {
    var restrictedValue = void 0;

    if (applyingLimits) {
      try {
        restrictedValue = Math.min(applyingLimits.max, Math.max(applyingLimits.min, value));
      } catch (e) {
        throw new LimitsUnsupportedFormat();
      }
    }
    return restrictedValue;
  }

  if (orientation === 'horizontal' || orientation === 'vertical') {
    if (orientation === 'horizontal') {
      data.drag.x += d3.event.dx;
      data.drag.x = withinLimits(data.drag.x + d3.event.dx, limits.x);
      els.style('transform', 'translateX(' + data.drag.x + 'px)');
    }
    if (orientation === 'vertical') {
      data.drag.y += d3.event.dy;
      data.drag.x = withinLimits(data.drag.y + d3.event.dy, limits.y);
      els.style('transform', 'translateY(' + data.drag.y + 'px)');
    }
  } else {
    data.drag.x += d3.event.dx;
    data.drag.y += d3.event.dy;
    els.style('transform', 'translate(' + data.drag.x + 'px,' + data.drag.y + 'px)');
  }
}

/**
 * Creates SVG filter element for simulating drop shadow.
 *
 * @description
 * Adapted from: http://bl.ocks.org/cpbotha/5200394
 *
 * @method  dropShadow
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {Object}  el       D3 selection.
 * @param   {String}  name     Filter name.
 * @param   {Number}  dx       Shadow x-distance.
 * @param   {Number}  dy       Shadow y-distance.
 * @param   {Number}  blur     Blurness.
 * @param   {Number}  opacity  Opacity of the shadow with in [0,1].
 */
function dropShadow(el, name, dx, dy, blur, opacity) {
  var defs = el.select('defs');

  if (defs.empty()) {
    defs = el.append('defs');
  }

  // create filter with id #drop-shadow
  // height = 130% so that the shadow is not clipped
  var filter = defs.append('filter').attr('id', 'drop-shadow' + (name ? '-' + name : '')).attr('height', '130%');

  // SourceAlpha refers to opacity of graphic that this filter will be applied to
  // convolve that with a Gaussian with standard deviation 3 and store result
  // in blur
  filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', blur);

  // translate output of Gaussian blur to the right and downwards with 2px
  // store result in offsetBlur
  filter.append('feOffset').attr('dx', dx).attr('dy', dy).attr('result', 'offsetBlur');

  filter.append('feComponentTransfer').append('feFuncA').attr('type', 'linear').attr('slope', opacity || 1);

  // overlay original SourceGraphic over translated blurred opacity by using
  // feMerge filter. Order of specifying inputs is important!
  var feMerge = filter.append('feMerge');

  feMerge.append('feMergeNode');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}

/**
 * Helper method to set a value if available and otherwise fall back to a
 * default value
 *
 * @method  setOption
 * @author  Fritz Lekschas
 * @date    2016-09-12
 * @param   {*}        value  Value to be set if available.
 * @param   {*}        defaultValue  Default value to be set when `value` is
 *   not available.
 * @param   {Boolean}  noFalsyValue  No falsy values are allowed. E.g., an empty
 *   string or the number zero are regarded as falsy.
 */
function setOption(value, defaultValue, noFalsyValue) {
  if (noFalsyValue) {
    return value || defaultValue;
  }

  return typeof value !== 'undefined' ? value : defaultValue;
}

// External
// eslint-disable-line import/no-unresolved
// eslint-disable-line import/no-unresolved
// Internal
// Private Variables
var _d3 = d3;

var ListGraph = function () {
  function ListGraph(init) {
    var _this = this;

    classCallCheck(this, ListGraph);

    if (init.d3) {
      _d3 = init.d3;
    }

    if (_d3.version[0] !== '4') {
      throw new D3VersionFourRequired(_d3.version);
    }

    if (!_d3.listGraph) {
      throw new LayoutNotAvailable();
    }

    var self = this;

    this.baseEl = init.element;
    this.baseEl.__d3ListGraphBase__ = true;

    this.baseElD3 = _d3.select(this.baseEl);
    this.baseElJq = $(this.baseEl);
    this.svgD3 = this.baseElD3.select('svg.base');
    this.svgEl = this.svgD3.node();
    this.outsideClickHandler = {};
    this.outsideClickClassHandler = {};

    if (this.svgD3.empty()) {
      this.svgD3 = this.baseElD3.append('svg').attr('class', 'base');
      this.svgJq = $(this.svgD3.node());
    } else {
      this.svgJq = $(this.svgD3.node());
    }

    // Array of root node IDs.
    this.rootNodes = init.rootNodes;

    // Width of the vis. If `undefined` the SVG's width will be used.
    this.width = setOption(init.width, this.svgJq.width(), true);

    // Height of the vis. If `undefined` the SVG's height will be used.
    this.height = setOption(init.height, this.svgJq.height(), true);

    // Refresh top and left position of the base `svg` everytime the user enters
    // the element with his/her mouse cursor. This will avoid relying on complex
    // browser resize events and other layout manipulations as they most likely
    // won't happen when the user tries to interact with the visualization.
    this.svgD3.on('mouseenter', this.getBoundingRect.bind(this));

    // With of the column's scrollbars
    this.scrollbarWidth = setOption(init.scrollbarWidth, SCROLLBAR_WIDTH, true);

    // Number of visible columns
    this.columns = setOption(init.columns, COLUMNS, true);

    // Number of visible rows.
    this.rows = setOption(init.rows, ROWS, true);

    // Path to SVG icon file.
    this.iconPath = setOption(init.iconPath, ICON_PATH, true);

    // If `true` query icons and controls are enabled.
    this.querying = setOption(init.querying, QUERYING);

    // If `true` hide links that point to invisible nodes.
    this.hideOutwardsLinks = setOption(init.hideOutwardsLinks, HIDE_OUTWARDS_LINKS);

    // If `true` and `this.hideOutwardsLinks === true` indicates the location of
    // target nodes of invisible nodes connected via links.
    this.showLinkLocation = setOption(init.showLinkLocation, SHOW_LINK_LOCATION);

    // The visual size of a location bucket. E.g. `3` pixel.
    this.linkLocationBucketSize = init.linkLocationBucketSize;

    // If `true` the currently rooted level will softly be highlighted.
    this.highlightActiveLevel = setOption(init.highlightActiveLevel, HIGHLIGHT_ACTIVE_LEVEL);

    // Determines which level from the rooted node will be regarded as active.
    // Zero means that the level of the rooted node is regarded.
    this.activeLevel = setOption(init.activeLevel, ACTIVE_LEVEL);

    // When no manually rooted node is available the active level will be
    // `this.activeLevel` minus `this.noRootActiveLevelDiff`.
    // WAT?
    // In some cases it makes sense to hide the original root node just to save
    // a column, so having no manually set root node means that the invisible
    // root node is active. Using this option it can be assured that the
    // approriate column is being highlighted.
    this.noRootActiveLevelDiff = setOption(init.noRootActiveLevelDiff, NO_ROOT_ACTIVE_LEVEL_DIFF);

    // Determine the level of transitions
    // - 0 [Default]: Show all transitions
    // - 1: Show only CSS transitions
    // - 2: Show no transitions
    this.lessTransitionsJs = init.lessTransitions > 0;
    this.lessTransitionsCss = init.lessTransitions > 1;

    // Enable or disable
    this.disableDebouncedContextMenu = setOption(init.disableDebouncedContextMenu, DISABLE_DEBOUNCED_CONTEXT_MENU);

    this.baseElD3.classed('less-animations', this.lessTransitionsCss);

    // Holds the key of the property to be sorted initially. E.g. `precision`.
    this.sortBy = init.sortBy;

    // Initial sort order. Anything other than `asc` will fall back to `desc`.
    this.sortOrder = init.sortOrder === 'asc' ? 1 : DEFAULT_SORT_ORDER;

    this.nodeInfoContextMenu = isArray(init.nodeInfoContextMenu) ? init.nodeInfoContextMenu : [];

    this.events = new Events(this.baseEl, init.dispatcher);

    this.baseElJq.addClass(CLASSNAME);

    this.dragged = { x: 0, y: 0 };

    if (init.forceWidth) {
      this.baseElJq.width(this.width);
    }

    this.layout = new _d3.listGraph({ // eslint-disable-line new-cap
      size: [this.width, this.height],
      grid: [this.columns, this.rows],
      d3: _d3
    });

    this.data = init.data;
    this.visData = this.layout.process(this.data, this.rootNodes, {
      showLinkLocation: this.showLinkLocation,
      linkLocationBucketSize: this.linkLocationBucketSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });

    /**
     * Stores current sorting, e.g. type, order and a reference to the element.
     *
     * @type  {Object}
     */
    this.currentSorting = {
      global: {
        type: this.sortBy,
        order: this.sortOrder
      },
      local: {}
    };

    this.barMode = init.barMode || DEFAULT_BAR_MODE;
    this.svgD3.classed(this.barMode + '-bar', true);

    this.topbar = new Topbar(this, this.baseElD3, this.visData);

    this.svgD3.attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.container = this.svgD3.append('g').attr('class', 'main-container');

    this.levels = new Levels(this.container, this, this.visData);

    this.links = new Links(this, this.levels.groups, this.visData, this.layout);
    this.nodes = new Nodes(this, this.levels.groups, this.visData, this.links, this.events);
    this.levels.scrollPreparation(this.scrollbarWidth);
    this.scrollbars = new Scrollbars(this.levels.groups, this.visData, this.scrollbarWidth);

    this.nodeContextMenu = new NodeContextMenu({
      visData: this.visData,
      baseEl: this.container,
      events: this.events,
      nodes: this.nodes,
      iconPath: this.iconPath,
      infoFields: this.nodeInfoContextMenu,
      isQueryable: this.querying,
      isDebounced: !this.disableDebouncedContextMenu
    });

    this.nodeContextMenu.wrapper.on('mousedown', function () {
      _this.mouseDownOnContextMenu = true;
    });

    dropShadow(this.svgD3, 'context-menu', 0, 1, 2, 0.2);
    dropShadow(this.svgD3, 'context-menu-inverted', 0, -1, 2, 0.2);

    // jQuery's mousewheel plugin is much nicer than D3's half-baked zoom event.
    // We are using delegated event listeners to provide better scaling
    this.svgJq.on('mousewheel', '.' + this.levels.className, function (event) {
      if (!self.zoomedOut) {
        self.mousewheelColumn(this, event);
      }
    });

    this.svgJq.on('click', function (event) {
      self.checkGlobalClick.call(self, event.target);
    });

    // Add jQuery delegated event listeners instead of direct listeners of D3.
    this.svgJq.on('click', '.' + this.nodes.classNodeVisible, function () {
      // Add a new global outside click listener using this node and the
      // node context menu as the related elements.
      requestNextAnimationFrame(function () {
        self.registerOutSideClickHandler('nodeContextMenu', [self.nodeContextMenu.wrapper.node()], ['visible-node'], function () {
          // The context of this method is the context of the outer click
          // handler.
          self.nodeContextMenu.close();
          self.unregisterOutSideClickHandler.call(self, 'nodeContextMenu');
        });
      });

      self.nodeContextMenu.toggle.call(self.nodeContextMenu, _d3.select(this.parentNode));
    });

    this.svgJq.on('click', '.' + this.nodes.classFocusControls + '.' + this.nodes.classRoot, function () {
      self.nodes.rootHandler.call(self.nodes, _d3.select(this), true);
    });

    if (this.querying) {
      this.svgJq.on('click', '.' + this.nodes.classFocusControls + '.' + this.nodes.classQuery, function () {
        self.nodes.queryHandler.call(self.nodes, _d3.select(this.parentNode), 'unquery');
        self.nodeContextMenu.updateStates();
      });
    }

    this.svgJq.on('click', '.' + this.nodes.classFocusControls + '.' + this.nodes.classLock, function () {
      self.nodes.lockHandler.call(self.nodes, this, _d3.select(this).datum());
    });

    this.svgJq.on('mouseenter', '.' + this.nodes.classNodeVisible, function () {
      self.interactionWrapper.call(self, function (domEl, data) {
        if (!this.vis.activeScrollbar) {
          this.enterHandler.call(this, domEl, data);
        }
      }.bind(self.nodes), [this, _d3.select(this).datum()]);
    });

    this.svgJq.on('mouseleave', '.' + this.nodes.classNodeVisible, function () {
      self.interactionWrapper.call(self, function (domEl, data) {
        if (!this.vis.activeScrollbar) {
          this.leaveHandler.call(this, domEl, data);
        }
      }.bind(self.nodes), [this, _d3.select(this).datum()]);
    });

    // Normally we would reference a named methods but since we need to access
    // the class' `this` property instead of the DOM element we need to use an
    // arrow function.
    this.scrollbars.all.on('mousedown', function () {
      self.scrollbarMouseDown(this, _d3.event);
    });

    // We need to listen to `mouseup` and `mousemove` globally otherwise
    // scrolling will only work as long as the cursor hovers the actual
    // scrollbar, which is super annoying.
    _d3.select(document).on('mouseup', function () {
      _this.globalMouseUp(_d3.event);
    });

    // Enable dragging of the whole graph.
    this.svgD3.call(onDragDrop, this.dragStartHandler.bind(this), this.dragMoveHandler.bind(this), this.dragEndHandler.bind(this), [this.container, this.topbar.localControlWrapper], 'horizontal', this.getDragLimits.bind(this), this.noDragging.bind(this), this.dragged, 2);

    this.events.on('d3ListGraphLevelFocus', function (levelId) {
      return _this.levels.focus(levelId);
    });

    this.events.on('d3ListGraphNodeRoot', function () {
      _this.nodes.bars.updateAll(_this.layout.updateBars(_this.data), _this.currentSorting.global.type);
      _this.updateSorting();
    });

    this.events.on('d3ListGraphNodeUnroot', function () {
      _this.nodes.bars.updateAll(_this.layout.updateBars(_this.data), _this.currentSorting.global.type);
      _this.updateSorting();
    });

    this.events.on('d3ListGraphUpdateBars', function () {
      _this.nodes.bars.updateAll(_this.layout.updateBars(_this.data), _this.currentSorting.global.type);
      _this.updateSorting();
    });

    this.events.on('d3ListGraphActiveLevel', function (nextLevel) {
      var oldLevel = _this.activeLevel;
      _this.activeLevel = Math.max(nextLevel, 0);
      if (_this.nodes.rootedNode) {
        var rootNodeDepth = _this.nodes.rootedNode.datum().depth;
        _this.levels.blur(rootNodeDepth + oldLevel);
        _this.levels.focus(rootNodeDepth + _this.activeLevel);
      } else {
        _this.levels.blur(oldLevel - _this.noRootActiveLevelDiff);
        _this.levels.focus(_this.activeLevel - _this.noRootActiveLevelDiff);
      }
    });

    // Initialize `this.left` and `this.top`
    this.getBoundingRect();
  }

  createClass(ListGraph, [{
    key: 'dragMoveHandler',
    value: function dragMoveHandler$$(data, elsToBeDragged, orientation, limits, notWhenTrue) {
      dragMoveHandler(data, elsToBeDragged, orientation, limits, notWhenTrue);
      this.checkNodeVisibility();
    }
  }, {
    key: 'checkNodeVisibility',
    value: function checkNodeVisibility(level, customScrollTop) {
      var nodes = level ? this.nodes.nodes.filter(function (data) {
        return data.depth === level;
      }) : this.nodes.nodes;

      nodes.call(this.nodes.isInvisible.bind(this.nodes), customScrollTop);
    }
  }, {
    key: 'registerOutSideClickHandler',
    value: function registerOutSideClickHandler(id, els, elClassNames, callback) {
      // We need to register a unique property to be able to indentify that
      // element later efficiently.
      for (var i = els.length; i--;) {
        if (els[i].__id__) {
          els[i].__id__.push(id);
        } else {
          els[i].__id__ = [id];
        }
      }
      var newLength = this.outsideClickHandler[id] = {
        id: id, els: els, elClassNames: elClassNames, callback: callback
      };
      for (var _i = elClassNames.length; _i--;) {
        this.outsideClickClassHandler[elClassNames[_i]] = this.outsideClickHandler[id];
      }
      return newLength;
    }
  }, {
    key: 'unregisterOutSideClickHandler',
    value: function unregisterOutSideClickHandler(id) {
      var handler = this.outsideClickHandler[id];

      // Remove element `__id__` property.
      for (var i = handler.els.length; i--;) {
        handler.els[i].__id__ = undefined;
        delete handler.els[i].__id__;
      }

      // Remove handler.
      this.outsideClickHandler[id] = undefined;
      delete this.outsideClickHandler[id];
    }
  }, {
    key: 'checkGlobalClick',
    value: function checkGlobalClick(target) {
      var found = {};
      var checkClass = Object.keys(this.outsideClickClassHandler).length;

      var el = target;
      try {
        while (!el.__d3ListGraphBase__) {
          if (el.__id__) {
            for (var i = el.__id__.length; i--;) {
              found[el.__id__[i]] = true;
            }
          }
          if (checkClass) {
            var classNames = Object.keys(this.outsideClickClassHandler);
            for (var _i2 = classNames.length; _i2--;) {
              var className = el.getAttribute('class');
              if (className && className.indexOf(classNames[_i2]) >= 0) {
                found[this.outsideClickClassHandler[classNames[_i2]].id] = true;
              }
            }
          }
          el = el.parentNode;
        }
      } catch (e) {
        return;
      }

      var handlerIds = Object.keys(this.outsideClickHandler);
      for (var _i3 = handlerIds.length; _i3--;) {
        if (!found[handlerIds[_i3]]) {
          this.outsideClickHandler[handlerIds[_i3]].callback.call(this);
        }
      }
    }
  }, {
    key: 'getDragLimits',
    value: function getDragLimits() {
      return {
        x: {
          min: this.dragMinX,
          max: 0
        }
      };
    }

    /**
     * Helper method to get the top and left position of the base `svg`.
     *
     * @Description
     * Calling `getBoundingClientRect()` right at the beginning leads to errornous
     * values, probably because the function is called because HTML has been fully
     * rendered.
     *
     * @method  getBoundingRect
     * @author  Fritz Lekschas
     * @date    2016-02-24
     */

  }, {
    key: 'getBoundingRect',
    value: function getBoundingRect() {
      this.left = this.svgEl.getBoundingClientRect().left;
      this.top = this.svgEl.getBoundingClientRect().top;
    }
  }, {
    key: 'interactionWrapper',
    value: function interactionWrapper(callback, params) {
      if (!this.noInteractions) {
        callback.apply(this, params);
      }
    }
  }, {
    key: 'dragStartHandler',
    value: function dragStartHandler() {
      if (!this.dragging) {
        this.noInteractions = this.dragging = true;
      }
    }
  }, {
    key: 'dragEndHandler',
    value: function dragEndHandler() {
      if (this.dragging) {
        this.noInteractions = this.dragging = false;
      }
    }
  }, {
    key: 'noDragging',
    value: function noDragging() {
      return !!this.activeScrollbar || this.mouseDownOnContextMenu;
    }
  }, {
    key: 'globalMouseUp',
    value: function globalMouseUp(event) {
      this.noInteractions = false;
      this.mouseDownOnContextMenu = false;

      if (this.activeScrollbar) {
        var data = this.activeScrollbar.datum();
        var deltaY = data.scrollbar.clientY - event.clientY;

        // Save final vertical position
        // Scrollbar
        data.scrollbar.scrollTop = Math.min(Math.max(data.scrollbar.scrollTop - deltaY, 0), data.scrollbar.scrollHeight);

        // Content
        data.scrollTop = Math.max(Math.min(data.scrollTop + data.invertedHeightScale(deltaY), 0), -data.scrollHeight);

        this.activeScrollbar.classed('active', false);

        this.activeScrollbar = undefined;

        this.stopScrollBarMouseMove();
      }
    }
  }, {
    key: 'startScrollBarMouseMove',
    value: function startScrollBarMouseMove() {
      var _this2 = this;

      _d3.select(document).on('mousemove', function () {
        _this2.dragScrollbar(_d3.event);
      });
    }
  }, {
    key: 'stopScrollBarMouseMove',
    value: function stopScrollBarMouseMove() {
      _d3.select(document).on('mousemove', null);
    }

    /**
     * Method for scrolling a column of nodes when the scrollbar is dragged.
     *
     * @method  dragScrollbar
     * @author  Fritz Lekschas
     * @date    2016-09-12
     * @param   {Object}  event  D3's _mousemove_ event object.
     */

  }, {
    key: 'dragScrollbar',
    value: function dragScrollbar(event) {
      event.preventDefault();
      var data = this.activeScrollbar.datum();
      var deltaY = data.scrollbar.clientY - event.clientY;

      // Scroll scrollbar
      ListGraph.scrollElVertically(this.activeScrollbar.node(), Math.min(Math.max(data.scrollbar.scrollTop - deltaY, 0), data.scrollbar.scrollHeight));

      // Scroll content
      var contentScrollTop = Math.max(Math.min(data.scrollTop + data.invertedHeightScale(deltaY), 0), -data.scrollHeight);

      ListGraph.scrollElVertically(data.nodes, contentScrollTop);

      // Scroll Links
      if (data.level !== this.visData.nodes.length) {
        this.links.scroll(data.linkSelections.outgoing, this.layout.offsetLinks(data.level, contentScrollTop, 'source'));
      }

      if (data.level > 0) {
        this.links.scroll(data.linkSelections.incoming, this.layout.offsetLinks(data.level - 1, contentScrollTop, 'target'));
      }

      if (this.showLinkLocation) {
        this.nodes.updateLinkLocationIndicators(data.level - 1, data.level + 1);
      }

      if (this.nodeContextMenu.opened) {
        this.nodeContextMenu.scrollY(contentScrollTop);
      }

      // Check if nodes are visible.
      this.checkNodeVisibility(data.level, contentScrollTop);
    }
  }, {
    key: 'scrollbarMouseDown',
    value: function scrollbarMouseDown(el, event) {
      this.noInteractions = true;
      this.activeScrollbar = _d3.select(el).classed('active', true);
      this.activeScrollbar.datum().scrollbar.clientY = event.clientY;
      this.startScrollBarMouseMove();
    }
  }, {
    key: 'mousewheelColumn',
    value: function mousewheelColumn(el, event) {
      event.preventDefault();

      var data = _d3.select(el).datum();

      if (data.scrollHeight > 0) {
        // Scroll nodes
        data.scrollTop = Math.max(Math.min(data.scrollTop + event.deltaY, 0), -data.scrollHeight);

        this.scrollY(data);
      }

      // Check if nodes are visible.
      this.checkNodeVisibility(data.level);
    }
  }, {
    key: 'scrollY',
    value: function scrollY(columnData, scrollbarDragging) {
      ListGraph.scrollElVertically(columnData.nodes, columnData.scrollTop);

      if (!scrollbarDragging) {
        // Scroll scrollbar
        columnData.scrollbar.scrollTop = columnData.scrollbar.heightScale(-columnData.scrollTop);

        ListGraph.scrollElVertically(columnData.scrollbar.el, columnData.scrollbar.scrollTop);
      }

      // Scroll Links
      if (columnData.level !== this.visData.nodes.length) {
        this.links.scroll(columnData.linkSelections.outgoing, this.layout.offsetLinks(columnData.level, columnData.scrollTop, 'source'));
      }

      if (columnData.level > 0) {
        this.links.scroll(columnData.linkSelections.incoming, this.layout.offsetLinks(columnData.level - 1, columnData.scrollTop, 'target'));
      }

      if (this.showLinkLocation) {
        this.nodes.updateLinkLocationIndicators(columnData.level - 1, columnData.level + 1);
      }

      if (this.nodeContextMenu.isOpenSameColumn(columnData.level)) {
        this.nodeContextMenu.scrollY(columnData.scrollTop);
      }
    }
  }, {
    key: 'scrollYTo',
    value: function scrollYTo(selection, positionY) {
      var _this3 = this;

      return selection.transition().duration(TRANSITION_SEMI_FAST).tween('scrollY', function (data) {
        var scrollPositionY = _d3.interpolateNumber(data.scrollTop, positionY);
        return function (time) {
          data.scrollTop = scrollPositionY(time);
          _this3.scrollY(data);
        };
      });
    }
  }, {
    key: 'resetAllScrollPositions',
    value: function resetAllScrollPositions() {
      return this.scrollYTo(this.levels.groups, 0);
    }
  }, {
    key: 'selectByLevel',
    value: function selectByLevel(level, selector) {
      return _d3.select(this.levels.groups._groups[0][level]).selectAll(selector);
    }
  }, {
    key: 'updateSorting',
    value: function updateSorting() {
      var levels = Object.keys(this.currentSorting.local);
      for (var i = levels.length; i--;) {
        this.sortColumn(i, this.currentSorting.local[levels[i]].type, this.currentSorting.local[levels[i]].order, this.currentSorting.local[levels[i]].type);
      }
    }
  }, {
    key: 'sortColumn',
    value: function sortColumn(level, property, sortOrder, newSortType) {
      this.nodes.sort(this.layout.sort(level, property, sortOrder).updateNodesVisibility().nodes(level), newSortType);
      this.links.sort(this.layout.links(level - 1, level + 1));
      this.nodeContextMenu.updatePosition();
      this.checkNodeVisibility();
    }
  }, {
    key: 'sortAllColumns',
    value: function sortAllColumns(property, newSortType) {
      this.currentSorting.global.order = this.currentSorting.global.order === -1 && !newSortType ? 1 : -1;

      this.nodes.sort(this.layout.sort(undefined, property, this.currentSorting.global.order).updateNodesVisibility().nodes(), newSortType);

      this.links.sort(this.layout.links());
      this.nodeContextMenu.updatePosition();
      this.checkNodeVisibility();
    }
  }, {
    key: 'switchBarMode',
    value: function switchBarMode(mode) {
      this.svgD3.classed('one-bar', mode === 'one');
      this.svgD3.classed('two-bar', mode === 'two');
      this.nodes.bars.switchMode(mode, this.currentSorting);
    }
  }, {
    key: 'trigger',
    value: function trigger(event, data) {
      this.events.trigger(event, data);
    }

    /**
     * Update the scroll position and scroll-bar visibility.
     *
     * @description
     * This method needs to be called after hiding or showing nodes.
     *
     * @method  updateScrolling
     * @author  Fritz Lekschas
     * @date    2016-02-21
     */

  }, {
    key: 'updateScrolling',
    value: function updateScrolling() {
      var _this4 = this;

      this.resetAllScrollPositions().call(allTransitionsEnded, function () {
        _this4.levels.updateScrollProperties();
        _this4.scrollbars.updateVisibility();
      });
    }
  }, {
    key: 'updateLevelsVisibility',
    value: function updateLevelsVisibility() {
      this.levels.updateVisibility();
    }
  }, {
    key: 'globalView',
    value: function globalView(selectionInterst) {
      var _this5 = this;

      if (!this.zoomedOut) {
        (function () {
          var x = 0;
          var y = 0;
          var width = 0;
          var height = 0;
          var cRect = void 0;
          var contBBox = _this5.container.node().getBBox();

          var globalCRect = _this5.svgD3.node().getBoundingClientRect();

          if (selectionInterst && !selectionInterst.empty()) {
            selectionInterst.each(function () {
              cRect = this.getBoundingClientRect();
              width = Math.max(width, cRect.left - (globalCRect.left + cRect.width));
              height = Math.max(height, cRect.top - (globalCRect.top + cRect.height));
            });
            width = _this5.width > width ? _this5.width : width;
            height = _this5.height > height ? _this5.height : height;
          } else {
            width = _this5.width > contBBox.width ? _this5.width : contBBox.width;
            height = _this5.height > contBBox.height ? _this5.height : contBBox.height;
          }

          x = contBBox.x + _this5.dragged.x;
          y = contBBox.y;

          _this5.nodes.makeAllTempVisible();
          _this5.links.makeAllTempVisible();

          _this5.svgD3.classed('zoomedOut', true).transition().duration(TRANSITION_SEMI_FAST).attr('viewBox', x + ' ' + y + ' ' + width + ' ' + height);
        })();
      }
    }
  }, {
    key: 'zoomedView',
    value: function zoomedView() {
      if (!this.zoomedOut) {
        this.nodes.makeAllTempVisible(true);
        this.links.makeAllTempVisible(true);

        this.svgD3.classed('zoomedOut', false).transition().duration(TRANSITION_SEMI_FAST).attr('viewBox', '0 0 ' + this.width + ' ' + this.height);
      }
    }
  }, {
    key: 'toggleView',
    value: function toggleView() {
      if (this.zoomedOut) {
        this.zoomedOut = false;
        this.zoomedView();
      } else {
        this.globalView();
        this.zoomedOut = true;
      }
    }

    /**
     * Check if an element is actually visible, i.e. within the boundaries of the
     * SVG element.
     *
     * @method  isHidden
     * @author  Fritz Lekschas
     * @date    2016-02-24
     * @param   {Object}    el  DOM element to be checked.
     * @return  {Boolean}       If `true` element is not visible.
     */

  }, {
    key: 'isHidden',
    value: function isHidden(el) {
      var boundingRect = el.getBoundingClientRect();
      return boundingRect.top + boundingRect.height <= this.top || boundingRect.left + boundingRect.width <= this.left || boundingRect.top >= this.top + this.height || boundingRect.left >= this.left + this.width;
    }

    /**
     * Assesses any of the two ends of a link points outwards.
     *
     * @description
     * In order to be able to determine where a link points to, the output of
     * `linkPointsOutside` for the source and target location is shifted bitwise
     * in such a way that this method return 11 unique numbers.
     * - 0: link is completely inwards
     * - 1: source is outwards to the top
     * - 2: source is outwards to the bottom
     * - 4: target is outwards to the top
     * - 8: target is outwards to the bottom
     * - 5: source and target are outwards to the top
     * - 6: source is outwards to the bottom and target is outwards to the top
     * - 9: source is outwards to the top and target is outwards to the bottom
     * - 10: source and target are outwards to the bottom
     * - 16: source is invisible
     * - 64: target is invisible
     *
     * If you're asking yourself: "WAT?!?!!" Think of a 4x4 binary matrix:
     * |    target    |    source    |
     * | bottom | top | bottom | top |
     * |    0   |  0  |    0   |  0  | (=0)
     * |    0   |  0  |    0   |  1  | (=1)
     * |    0   |  0  |    1   |  0  | (=2)
     * |    0   |  1  |    0   |  0  | (=4)
     * |    1   |  0  |    0   |  0  | (=8)
     * |    0   |  1  |    0   |  1  | (=5)
     * |    0   |  1  |    1   |  0  | (=6)
     * |    1   |  0  |    0   |  1  | (=9)
     * |    1   |  0  |    1   |  0  | (=10)
     *
     * *Note: 16 and 64 are two special values when the source or target node is
     * hidden. The numbers are so hight just because that the bitwise-and with 4
     * and 8 results to 0.
     *
     * To check whether the source or target location is above, below or within
     * the global SVG container is very simple. For example, to find out if the
     * target location is above, all we need to do is `<VALUE> & 4 > 0`. This
     * performs a bit-wise AND operation with only two possible outcomes: 4 and 0.
     *
     * @method  pointsOutside
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}  data  Link data.
     * @return  {Number}  Numberical represenation of the links constallation. See
     *   description for details.
     */

  }, {
    key: 'pointsOutside',
    value: function pointsOutside(data) {
      var source = this.linkPointsOutside(data.source);
      var target = this.linkPointsOutside(data.target) << 2;
      return source | target;
    }

    /**
     * Assesses whether a link's end points outwards
     *
     * @method  linkPointsOutside
     * @author  Fritz Lekschas
     * @date    2016-09-14
     * @param   {Object}  data  Link data.
     * @return  {Number}  If link ends inwards returns `0`, if it points outwards
     *   to the top returns `1` or `2` when it points to the bottom. If the node
     *   pointed to is hidden return `16`.
     */

  }, {
    key: 'linkPointsOutside',
    value: function linkPointsOutside(data) {
      var y = data.node.y + data.offsetY;
      if (data.node.hidden) {
        return 16;
      }
      if (y + this.visData.global.row.height - this.visData.global.row.padding <= 0) {
        return 1;
      }
      if (y + this.visData.global.row.padding >= this.height) {
        return 2;
      }
      return 0;
    }
  }, {
    key: 'area',
    get: function get() {
      return this.container.node().getBoundingClientRect();
    }
  }, {
    key: 'dragMinX',
    get: function get() {
      return Math.min(0, this.width - this.area.width);
    }
  }, {
    key: 'barMode',
    get: function get() {
      if (this.bars) {
        return this.nodes.bars.mode;
      }
      return this._barMode;
    },
    set: function set(mode) {
      if (this.bars) {
        this.nodes.bars.mode = mode;
      }
      this._barMode = mode;
    }
  }], [{
    key: 'scrollElVertically',
    value: function scrollElVertically(el, offset) {
      _d3.select(el).attr('transform', 'translate(0, ' + offset + ')');
    }
  }]);
  return ListGraph;
}();

ListGraph.version = '0.17.0';

return ListGraph;

})));