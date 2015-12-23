'use strict';

import * as d3 from 'd3';
import * as config from './config';

const TOPBAR_EL = 'div';
const TOPBAR_CLASS = 'topbar';

const TOPBAR_CONTROL_EL = 'ul';
const TOPBAR_CONTROL_CLASS = 'controls';

class Topbar {
  constructor (vis, selection, visData) {
    let that = this;

    this.vis = vis;
    this.visData = visData;
    // Add base topbar element
    this.el = selection.select('.topbar');

    if (this.el.empty()) {
      this.el = selection.insert(TOPBAR_EL, ':first-child')
        .attr('class', TOPBAR_CLASS);
    }

    this.controls = this.el.selectAll(TOPBAR_CONTROL_CLASS)
      .data(visData.nodes)
      .enter()
      .append(TOPBAR_CONTROL_EL)
        .classed(TOPBAR_CONTROL_CLASS, true)
        .style('width', this.visData.global.column.width + 'px');

    this.controls.append('li')
      .attr('class', 'toggle')
      .style('width', this.visData.global.column.padding + 'px')
      .on('click', this.toggleColumn);

    this.controls.append('li')
      .attr('class', 'sort-precision ease-all')
      .style({
        'width': this.visData.global.column.contentWidth / 2 + 'px',
        'left': this.visData.global.column.padding + 'px',
      })
      .on('click', function (data, index) {
        that.sortColumn(this, index, 'precision');
      })
      .on('mouseenter', function () {
        that.highlightBars(this.parentNode, 'precision');
        d3.select(this).style(
          'width',
          (that.visData.global.column.contentWidth - 16) + 'px'
        );
      })
      .on('mouseleave', function () {
        that.highlightBars(this.parentNode, 'precision', true);
        d3.select(this).style(
          'width',
          (that.visData.global.column.contentWidth / 2) + 'px'
        );
      })
      .html(
        '<div class="expandable-label">' +
        '  <span class="letter abbr">P</span>' +
        '  <span class="letter abbr">r</span>' +
        '  <span class="letter">e</span>' +
        '  <span class="letter abbr">c</span>' +
        '  <span class="letter">i</span>' +
        '  <span class="letter">s</span>' +
        '  <span class="letter">i</span>' +
        '  <span class="letter">o</span>' +
        '  <span class="letter">n</span>' +
        '</div>' +
        '<svg class="icon-unsort invisible-default visible">' +
        '  <use xlink:href="' + this.vis.iconPath + '#unsort"></use>' +
        '</svg>' +
        '<svg class="icon-sort-asc invisible-default">' +
        '  <use xlink:href="' + this.vis.iconPath + '#sort-asc"></use>' +
        '</svg>' +
        '<svg class="icon-sort-desc invisible-default">' +
        '  <use xlink:href="' + this.vis.iconPath + '#sort-desc"></use>' +
        '</svg>'
      );

    this.controls.append('li')
      .attr('class', 'sort-recall ease-all')
      .style({
        'width': this.visData.global.column.contentWidth / 2 + 'px',
        'left': this.visData.global.column.contentWidth / 2 +
          this.visData.global.column.padding + 'px',
      })
      .on('click', function (data, index) {
        that.sortColumn(this, index, 'recall');
      })
      .on('mouseenter', function () {
        that.highlightBars(this.parentNode, 'recall');
        d3.select(this).style({
          'width': (that.visData.global.column.contentWidth - 16) + 'px',
          'left': (that.visData.global.column.padding + 16) + 'px'
        });
      })
      .on('mouseleave', function () {
        that.highlightBars(this.parentNode, 'recall', true);
        d3.select(this).style({
          'width': (that.visData.global.column.contentWidth) / 2 + 'px',
          'left': (that.visData.global.column.contentWidth / 2 +
            that.visData.global.column.padding) + 'px'
        });
      })
      .html(
        '<div class="expandable-label">' +
        '  <span class="letter abbr">R</span>' +
        '  <span class="letter">e</span>' +
        '  <span class="letter abbr">c</span>' +
        '  <span class="letter">a</span>' +
        '  <span class="letter abbr">l</span>' +
        '  <span class="letter">l</span>' +
        '</div>' +
        '<svg class="icon-unsort invisible-default visible">' +
        '  <use xlink:href="' + this.vis.iconPath + '#unsort"></use>' +
        '</svg>' +
        '<svg class="icon-sort-asc invisible-default">' +
        '  <use xlink:href="' + this.vis.iconPath + '#sort-asc"></use>' +
        '</svg>' +
        '<svg class="icon-sort-desc invisible-default">' +
        '  <use xlink:href="' + this.vis.iconPath + '#sort-desc"></use>' +
        '</svg>'
      );

    this.controls.append('li')
      .attr('class', 'options')
      .style('width', this.visData.global.column.padding + 'px')
      .on('click', this.toggleOptions)
      .html(
        '<svg class="icon-gear">' +
        '  <use xlink:href="' + this.vis.iconPath + '#gear"></use>' +
        '</svg>'
      );

    /**
     * Stores current sorting, e.g. type, order and a reference to the element.
     *
     * @type  {Object}
     */
    this.sorting = {};
    this.controls.each((data, index) => {
      /*
       * Order:
       * 0 = unsorted
       * 1 = asc
       * -1 = desc
       */
      this.sorting[index] = {
        type: undefined,
        order: 0,
        el: undefined
      };
    });
  }

  toggleColumn () {
    console.log('Toggle column');
  }

  selectNodesColumn (el) {
    return this.vis.selectByColumn(d3.select(el).datum().level, '.node');
  }

  highlightBars (el, type, deHighlight) {
    let nodes = this.selectNodesColumn(el);
    nodes.selectAll('.bar.' + type)
      .classed('highlight', !deHighlight);
  }

  sortColumn (el, index, type) {
    if (this.sorting[index].el) {
      if (this.sorting[index].type !== type) {
        this.sorting[index].el.select('.icon-sort-desc')
          .classed('visible', false);
        this.sorting[index].el.select('.icon-sort-asc')
          .classed('visible', false);
        this.sorting[index].el.select('.icon-unsort')
          .classed('visible', true);
      }
    }

    this.sorting[index].el = d3.select(el);
    this.sorting[index].type = type;

    // -1 = desc, 1 = asc
    if (this.sorting[index].order === -1) {
      this.sorting[index].order = 1;
      this.sorting[index].el.select('.icon-sort-desc')
        .classed('visible', false);
      this.sorting[index].el.select('.icon-sort-asc')
        .classed('visible', true);
    } else {
      this.sorting[index].order = -1;
      this.sorting[index].el.select('.icon-sort-asc')
        .classed('visible', false);
      this.sorting[index].el.select('.icon-sort-desc')
        .classed('visible', true);
    }

    this.sorting[index].el.select('.icon-unsort')
      .classed('visible', false);

    this.vis.sortColumn(index, type, this.sorting[index].order);
  }

  toggleOptions () {
    console.log('Toggle options');
  }
}

export default Topbar;
