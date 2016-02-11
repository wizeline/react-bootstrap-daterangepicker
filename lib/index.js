'use strict';
/**
 * react-bootstrap-daterangepicker.js
 *
 * A slightly modified version of bootstrap-daterangepicker.js for use in react and npm.
 * Original copyright in: ./node_modules/bootstrap-daterangepicker/
 */
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var DateRangePicker = require('bootstrap-daterangepicker');
var getOptions = require('./get-options.js');

/* this is our export React class */
module.exports = React.createClass({
	$picker: null,
	options: getOptions(),
	makeEventHandler: function (eventType) {
		return function (event, picker) {
			if (typeof this.props.onEvent === 'function') {
				this.props.onEvent(event, picker);
			}
			if (typeof this.props[eventType] === 'function') {
				this.props[eventType](event, picker);
			}
		}.bind(this);
	},
	getOptionsFromProps: function () {
		var options, props = this.props;
		this.options.forEach(function (option) {
			if (props.hasOwnProperty(option)) {
				options = options || {};
				options[option] = props[option];
			}
		});
		return options || {};
	},
	setOptionsFromProps: function () {
		var currentOptions = this.getOptionsFromProps();
		var keys = Object.keys(currentOptions);
		var $this = this;
		if ($this.$picker) {
			if (currentOptions) {
				keys.forEach(function (key) {
					$this.$picker.data('daterangepicker')[key] = currentOptions[key];
				});
			}
		}
	},
	componentDidMount: function () {
		this.initializeDateRangePicker();
	},
	componentWillUnmount: function () {
		this.removeDateRangePicker();
	},
	removeDateRangePicker: function() {
		this.$picker.data('daterangepicker').remove();
	},
	initializeDateRangePicker: function() {
		var $this = this;
		$ = (window.jQuery && window.jQuery.fn.daterangepicker)? window.jQuery : $;
		$this.$picker = $(this.refs.picker);
		// Attach to an input node if not already one
		if(!$this.$picker.is('input')) {
			var domNodeFind = $(ReactDOM.findDOMNode($this.$picker[0])).find('input');
			if(domNodeFind.length === 1) {
				$this.$picker = $(domNodeFind[0]);
			}
		}
		// initialize
		$this.$picker.daterangepicker(this.getOptionsFromProps());
		// attach event listeners
		['Show', 'Hide', 'ShowCalendar', 'HideCalendar', 'Apply', 'Cancel'].forEach(function (event) {
			var lcase = event.toLowerCase();
			$this.$picker.on(lcase + '.daterangepicker', $this.makeEventHandler('on' + event));
		});
	},
	render: function () {
		if (this.$picker) {
			this.removeDateRangePicker();
			this.initializeDateRangePicker();
		}

		this.setOptionsFromProps();

		var inUseContainer;
		if(this.props.containerType
			&& (typeof(this.props.containerType) === 'string' || typeof(this.props.containerType) === 'function')) {
			inUseContainer = this.props.containerType;
		} else {
			inUseContainer = 'div';
		}

		return React.createElement(
			inUseContainer,
			React.__spread({ref: 'picker'},  this.props),
			this.props.children
		);
	}
});
