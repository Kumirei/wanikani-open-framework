// ==UserScript==
// @name        Wanikani Open Framework - Menu module
// @namespace   rfindley
// @description Menu module for Wanikani Open Framework
// @version     1.0.3
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// ==/UserScript==

(function(global) {

	//########################################################################
	//------------------------------
	// Published interface
	//------------------------------
	global.wkof.Menu = {
		insert_script_link: insert_script_link
	};
	//########################################################################

	function escape_attr(attr) {return attr.replace(/"/g,'\'');}
	function escape_text(text) {return text.replace(/[<&>]/g, function(ch) {var map={'<':'&lt','&':'&amp;','>':'&gt;'}; return map[ch];});}

	//------------------------------
	// Install 'Scripts' header in menu, if not present.
	//------------------------------
	function install_scripts_header() {
		// Abort if already installed.
		if ($('.scripts-header').length !== 0) return false;
		var top_menu;

		// Install html.
		switch (location.pathname) {
			case '/review/session':
				// Install css and html.
				if ($('style[name="scripts_submenu"]').length === 0) {
					$('head').append(
						'<style name="scripts_submenu">'+
						'#scripts-menu.scripts-menu-icon {display:inline-block}'+
						'#scripts-menu .scripts-icon {display:inline-block}'+
						'#scripts-menu:not(.open) > .dropdown-menu {display:none;}'+
						'#scripts-menu .scripts-submenu:not(.open) > .dropdown-menu {display:none;}'+
						'#scripts-menu .dropdown-menu {position:absolute; background-color:#eee; margin:0; padding:5px 0; list-style-type:none; border:1px solid #333;}'+
						'#scripts-menu .dropdown-menu > li {text-align:left; color:#333; white-space:nowrap; line-height:20px; padding:3px 0;}'+
						'#scripts-menu .dropdown-menu > li.scripts-header {text-transform:uppercase; font-size:11px; font-weight:bold; padding:3px 20px;}'+
						'#scripts-menu .dropdown-menu > li:hover:not(.scripts-header) {background-color:rgba(0,0,0,0.15)}'+
						'#scripts-menu .dropdown-menu a {padding:3px 20px; color:#333; opacity:1;}'+
						'#scripts-menu .scripts-submenu {position:relative;}'+
						'#scripts-menu .scripts-submenu > a:after {content:"\uf0da"; font-family:"FontAwesome"; position:absolute; top:0; right:0; padding:3px 4px 3px 0;}'+
						'#scripts-menu .scripts-submenu .dropdown-menu {left:100%; top:-6px;}'+
						'</style>'
					);
				}
				$('#summary-button a[href="/review"').after(
					'<div id="scripts-menu" class="scripts-menu-icon">'+
					'  <a class="scripts-icon" href="#"><i class="icon-gear" title="Script Menu"></i></a>'+
					'  <ul class="dropdown-menu">'+
					'    <li class="scripts-header">Script Menu</li>'+
					'  </ul>'+
					'</div>'
				);
				top_menu = $('#scripts-menu');
				$('#scripts-menu > a.scripts-icon').on('click', function(e){
					top_menu.toggleClass('open');
					if (top_menu.hasClass('open')) {
						$('body').on('click.scripts-menu', function(){
							top_menu.removeClass('open');
							$('body').off('.scripts-menu');
						});
					}
					return false;
				});
				break;

			default:
				// Install css and html.
				top_menu = $('.dropdown.account');
				if ($('style[name="scripts_submenu"]').length === 0) {
					$('head').append(
						'<style name="scripts_submenu">'+
						'html#main .navbar .scripts-submenu {position:relative;}'+
						'html#main .navbar .scripts-submenu.open>.dropdown-menu {display:block;position:absolute;top:0px;}'+
						'.scripts-submenu>a:before {content:"\uf0d9 "; font-family:"FontAwesome";}'+
						'@media (max-width: 979px) {'+
						'  .scripts-submenu>a:before {content:"";}'+
						'  html#main .navbar .scripts-submenu {margin-left:1.5em;}'+
						'  html#main .navbar .scripts-submenu>a {text-align:left;}'+
						'  html#main .navbar .scripts-submenu>ul.dropdown-menu {margin-left:.5em;}'+
						'  html#main .navbar .dropdown.account>.dropdown-menu>.script-link {margin-left:1.5em;}'+
						'  html#main .navbar .dropdown.account>.dropdown-menu>.script-link>a {text-align:left;}'+
						'  html#main .navbar .dropdown-menu>li:not(.nav-header).scripts-submenu {display:block;width:100%;}'+
						'  html#main .navbar .scripts-submenu>.dropdown-menu {display:block;padding:0;margin:0;box-shadow:none;}'+
						'  html#main .navbar .scripts-submenu.open>.dropdown-menu {position:relative;top:0px;left:initial;right:initial;}'+
						'  html#main .navbar .dropdown-menu>li:not(.nav-header).scripts-submenu>.dropdown-menu>li {width:auto;padding:0 1em;}'+
						'}'+
						'</style>'
					);
				}
				$('.nav-header:contains("Account")').before(
					'<li class="scripts-header nav-header">Scripts</li>'
				);
				break;
		}

		// Click to open sub-menu.
		top_menu.on('click','.scripts-submenu>a',function(e){
			var link = $(e.target).parent();
			link.siblings('.scripts-submenu.open').removeClass('open');
			link.toggleClass('open');
			// If we opened the menu, listen for off-menu clicks.
			if (link.hasClass('open')) {
				$('body').on('click.scripts-submenu',function(e){
					$('body').off('click.scripts-submenu');
					$('.scripts-submenu').removeClass('open');
					return true;
				})
			} else {
				$('body').off('click.scripts-submenu');
			}
			return false;
		});
		return true;
	}

	//------------------------------
	// Sort menu items
	//------------------------------
	function sort_name(a,b) {
		return a.querySelector('a').innerText.localeCompare(b.querySelector('a').innerText);
	}

	//------------------------------
	// Install Submenu, if not present.
	//------------------------------
	function install_scripts_submenu(name) {
		// Abort if already installed.
		var safe_name = escape_attr(name);
		var safe_text = escape_text(name);
		var submenu = $('.scripts-submenu[name="'+safe_name+'"]');
		if (submenu.length > 0) return submenu;

		submenu = $(
			'<li class="scripts-submenu" name="'+safe_name+'">'+
			'  <a href="#">'+safe_text+'</a>'+
			'  <ul class="dropdown-menu">'+
			'  </ul>'+
			'</li>'
		);
		$('.scripts-header').after(submenu);
		var items = $('.scripts-header').siblings('.scripts-submenu,.script-link').sort(sort_name);
		$('.scripts-header').after(items);
		return submenu;
	}

	//------------------------------
	// Inserts script link into Wanikani menu.
	//------------------------------
	function insert_script_link(config) {
		// Abort if the script already exists
		var link_id = config.name+'_script_link'; 
		var link_text = escape_text(config.title);
		if ($('#'+link_id).length !== 0) return;
		install_scripts_header();
		if (config.submenu) {
			var submenu = install_scripts_submenu(config.submenu);

			// Append the script, and sort the menu.
			var menu = submenu.find('.dropdown-menu');
			var class_html = (config.class ? ' class="'+config.class+'"': '');
			menu.append('<li id="'+link_id+'" name="'+config.name+'"'+class_html+'><a href="#">'+link_text+'</a></li>');
			menu.append(menu.children().sort(sort_name));
		} else {
			var class_html = (config.class ? ' '+classes:'');
			$('.scripts-header').after('<li id="'+link_id+'" name="'+config.name+'" class="script-link'+class_html+'"><a href="#">'+link_text+'</a></li>');
			var items = $('.scripts-header').siblings('.scripts-submenu,.script-link').sort(sort_name);
			$('.scripts-header').after(items);
		}

		// Add a callback for when the link is clicked.
		$('#'+link_id).on('click', function(e){
			$('body').off('click.scripts-link');
			$('.dropdown.account').removeClass('open');
			$('#scripts-menu').removeClass('open');
			$('.scripts-submenu').removeClass('open');
			config.on_click(e);
			return false;
		});
	}

	wkof.ready('document').then(set_ready_state);

	function set_ready_state(){
		// Delay guarantees include() callbacks are called before ready() callbacks.
		setTimeout(function(){wkof.set_state('wkof.Menu', 'ready');},0);
	}

})(window);

