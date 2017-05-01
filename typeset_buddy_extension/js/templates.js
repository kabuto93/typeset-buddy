angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('app.tpl.html','<uib-tabset active="null" class="">\n\t<uib-tab index="one.name" heading="{{one.label}}" ui-sref="{{one.name}}" ui-sref-active="active" ng-repeat="one in routes"></uib-tab>\n\t<uib-tab index="9" heading="Log" ui-sref="log_view" ui-sref-active="active" ng-if="$root.debug"></uib-tab>\n\t<uib-tab index="10" heading="RESET" ng-click="resetLocalStorage()" ng-if="$root.debug"></uib-tab>\n\n\n</uib-tabset>\n\n<ui-view name="app" class="flex-col"></ui-view>');
$templateCache.put('confirm_dialog.tpl.html','<div class="modal-header">\n\t<h3 class="modal-title" id="modal-title">Confirm</h3>\n</div>\n<div class="modal-body" id="modal-body">\n\t{{message}}\n</div>\n<div class="modal-footer">\n\t<button class="btn btn-primary" type="button" ng-click="submit()">OK</button>\n\t<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>\n</div>');
$templateCache.put('log_view.tpl.html','<div class="no-shrink p header">\n\t<button class="topcoat-button" ng-click="clearLog()">\n\t\t<span class="glyphicon glyphicon-trash"></span>\n\t\tClear log\n\t</button>\n</div>\n<div class="list scrollable">\n\t<div class="no-shrink row pb" ng-repeat="entry in $root.logContent">\n\t\t<div class="col-md-2 col-xs-2">\n\t\t\t<label>{{entry.label}}</label>\n\t\t</div>\n\t\t<div class="col-md-10 col-xs-10">\n\t\t\t<pre>{{entry.value|json}}</pre>\n\t\t</div>\n\t</div>\n</div>\n');
$templateCache.put('bubble_item.tpl.html','<div class="row bubble-item" ng-class="{\'double-bubble\': !!bubble.doublePart, \'panel-separator\': !!bubble.panelSeparator}">\n\t<div class="col-lg-2 col-md-3 col-xs-3 text-center" ng-if="!!!bubble.panelSeparator">\n\t\t<button class="topcoat-button" ng-repeat="style in bubble.styles track by $index" ng-click="typesetAction({text: bubble.text, style: style.keyword})">\n\t\t\t<span>{{style.keyword}}</span>\n\t\t\t<span class="glyphicon glyphicon-warning-sign" ng-if="!!!style.inStyleSet"></span>\n\t\t</button>\n\t</div>\n\t<div class="col-lg-10 col-md-9 col-xs-9">\n\t\t<div class="bubble-content selectable">{{bubble.text}}</div>\n\t\t<div class="bubble-note selectable" ng-repeat="note in bubble.notes">{{note}}</div>\n\t</div>\n</div>');
$templateCache.put('script_view.tpl.html','<div class="row no-shrink">\n\t<div class="col-md-6 col-xs-6 flex-input">\n\t\t<div class="input-wrapper">\n\t\t\t<label class="">\n\t\t\t\t<span>Script</span>\n\t\t\t</label>\n\t\t\t<input type="text" class="topcoat-text-input" readonly="true" ng-model="filename" ng-click="browseScript()">\n\t\t</div>\n\t\t<!-- <button class="topcoat-button" ng-click="browseScript()">Browse...</button> -->\n\t</div>\n\t<div class="col-md-5 col-xs-5 flex-input">\n\t\t<div class="input-wrapper">\n\t\t\t<label class="">\n\t\t\t\t<span>Style Set</span>\n\t\t\t</label>\n\t\t\t<styleset-selector selected-value="selectedStyleset"></styleset-selector>\n\t\t</div>\n\n\t</div>\n\t<div class="col-md-1 col-xs-1 flex-input">\n\t\t<div class="btn-group" uib-dropdown is-open="status.isopen">\n\t\t\t<button class="topcoat-button" uib-dropdown-toggle>\n\t\t\t\t<span class="glyphicon glyphicon-cog"></span>\n\t\t\t</button>\n\t\t\t<ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="single-button">\n\t\t\t\t<li class="dropdown-header">Panel separator</li>\n\t\t\t\t<li role="menuitem" ng-class="{\'active\': panelSeparator == \'\u2013\'}" ng-click="setPanelSeparator(\'\u2013\')"><span>Long dash \u2013</span></li>\n\t\t\t\t<li role="menuitem" ng-class="{\'active\': panelSeparator == \'-\'}" ng-click="setPanelSeparator(\'-\')"><span>Single dash -</span></li>\n\t\t\t\t<li role="menuitem" ng-class="{\'active\': panelSeparator == \'--\'}" ng-click="setPanelSeparator(\'--\')"><span>Double dash --</span></li>\n\t\t\t\t<li role="menuitem" ng-class="{\'active\': panelSeparator == \'=\'}" ng-click="setPanelSeparator(\'=\')"><span>Equal sign =</span></li>\n\t\t\t\t<li class="dropdown-header">Use layer groups</li>\n\t\t\t\t<li role="menuitem" ng-class="{\'active\': useLayerGroups === true}" ng-click="setUseLayerGroups(true)"><span>Yes</span></li>\n\t\t\t\t<li role="menuitem" ng-class="{\'active\': useLayerGroups === false}" ng-click="setUseLayerGroups(false)" ><span>No</span></li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n</div>\n<div class="no-shrink row pb header">\n\t<div class="col-lg-4 col-md-4 col-xs-4">\n\t\t<label>Page</label>\n\t\t<button class="topcoat-icon-button--quiet" ng-disabled="!!!pageNumbers.length">\n\t\t\t<span class="glyphicon glyphicon-minus" ng-click="incPageNumber(false)"></span>\n\t\t</button>\n\n\t\t\t<select ng-options="pageNumber as pageNumber for pageNumber in pageNumbers" ng-model="selectedPage">\n\t\t\t\t<option value="">-</option>\n\t\t\t</select>\n\n\t\t<button class="topcoat-icon-button--quiet" ng-disabled="!!!pageNumbers.length">\n\t\t\t<span class="glyphicon glyphicon-plus" ng-click="incPageNumber(true)"></span>\n\t\t</button>\n\t</div>\n\t<div class="col-lg-4 col-md-4 col-xs-4">\n\t\t<label ng-if="!!selectedPage && !!bubbles.length">\n\t\t\tPage style: {{pageStyle.keyword}} <span class="glyphicon glyphicon-warning-sign" ng-if="!!!pageStyle.inStyleSet"></span>\n\t\t</label>\n\t</div>\n\t<div class="col-lg-4 col-md-4 col-xs-4">\n\t\t<label>\n\t\t\tForce\n\t\t</label>\n\t\t<tb-style-selector styleset="selectedStyleset" selected-value="selectedForcedStyle"></tb-style-selector>\n\n\t\t<!-- <div class="input-flex">\n\t\t\t<label>\n\t\t\t\t<span>Multi mode</span>\n\t\t\t</label>\n\t\t\t<div>\n\t\t\t\t<label class="topcoat-switch">\n\t\t\t\t\t<input type="checkbox" ng-model="multiMode" ng-true-value="true" class="topcoat-switch__input">\n\t\t\t\t\t<div class="topcoat-switch__toggle"></div>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div> -->\n\t</div>\n\n</div>\n<div class="page-note" ng-repeat="pageNote in pageNotes">\n\t{{pageNote}}\n</div>\n<div class="list scrollable">\n\t<div class="list-item p" ng-if="!!selectedPage && !!!bubbles.length">Nothing to typeset on this page</div>\n\t<!-- <bubble-item class="list-item" ng-repeat="bubble in bubbles" bubble="bubble" typeset-action="typeset(text, style)"></bubble-item> -->\n\n\t<div class="list-item row bubble-item" ng-class="{\'double-bubble\': !!bubble.doublePart, \'panel-separator\': !!bubble.panelSeparator}" ng-repeat="bubble in bubbles">\n\t\t<div class="col-lg-2 col-md-3 col-xs-3 text-center" ng-if="!!!bubble.panelSeparator">\n\t\t\t<button class="topcoat-button" ng-repeat="style in bubble.styles track by $index" ng-click="typeset(bubble.text, style)" ng-if="!!!multiMode" uib-tooltip="Create it or use the force :D" tooltip-popup-delay="1000" tooltip-placement="bottom" tooltip-enable="!!!style.inStyleSet">\n\t\t\t\t<span>{{style.keyword}}</span>\n\t\t\t\t<span class="glyphicon glyphicon-warning-sign" ng-if="!!!style.inStyleSet"></span>\n\t\t\t</button>\n\t\t\t<label class="topcoat-checkbox" ng-if="!!multiMode">\n\t\t\t  <input type="checkbox" ng-model="bubble.selected" ng-true-value="true">\n\t\t\t\t<div class="topcoat-checkbox__checkmark"></div>\n\t\t\t</label>\n\t\t</div>\n\t\t<div class="col-lg-10 col-md-9 col-xs-9">\n\t\t\t<div class="selectable" ng-class="{\'bubble-content\': !!!bubble.panelSeparator}">{{bubble.text}}</div>\n\t\t\t<div class="bubble-note selectable" ng-repeat="note in bubble.notes">{{note}}</div>\n\t\t</div>\n\t</div>\n\n</div>');
$templateCache.put('style_preset.tpl.html','<div class="row m0">\n\t<div class="col-md-4 col-xs-4">\n\t\t<label class="input-flex">\n\t\t\t<span>Keyword</span>\n\t\t\t<input type="text" class="topcoat-text-input" placeholder="Keyword" ng-model="preset.keyword" ng-disabled="preset.default" ng-pattern="/^[\\d\\w_]+$/i">\n\t\t</label>\n\t</div>\n\t<div class="col-md-6 col-xs-6">\n\t\t<label class="input-flex input-flex-larger">\n\t\t\t<span>Font</span>\n\t\t\t<font-selector selected-value="preset.fontName"></font-selector>\n\t\t</label>\n\t</div>\n\t<div class="col-md-2 col-xs-2 text-right">\n\t\t<button class="topcoat-button" ng-click="duplicateAction()" uib-tooltip="Duplicate style" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t<span class="glyphicon glyphicon-duplicate"></span>\n\t\t</button>\n\t\t<button class="topcoat-button" ng-click="removeAction()" ng-if="!!!preset.default" uib-tooltip="Remove style" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t<span class="glyphicon glyphicon-trash"></span>\n\t\t</button>\n\t</div>\n</div>\n\n<div class="row m0">\n\t<div class="col-md-4 col-xs-4">\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Size (px)</span>\n\t\t\t\t<input type="number" class="topcoat-text-input" min="1" max="1000" step="1" ng-model="preset.size" placeholder="1 to 1000 px" uib-tooltip="min:1 max:1000 default:20" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t</label>\n\t\t</div>\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>VScale (%)</span>\n\t\t\t\t<input type="number" class="topcoat-text-input" min="1" max="1000" step="1" ng-model="preset.vScale" placeholder="1 to 1000 %" uib-tooltip="min:1 max:1000 default:100" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t</label>\n\t\t</div>\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>HScale (%)</span>\n\t\t\t\t<input type="number" class="topcoat-text-input" min="1" max="1000" step="1" ng-model="preset.hScale" placeholder="1 to 1000 %" uib-tooltip="min:1 max:1000 default:100" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t</label>\n\t\t</div>\n\t\t<div class="input-flex">\n\t\t\t<label>\n\t\t\t\t<span>Hyphenate</span>\n\t\t\t</label>\n\t\t\t<div>\n\t\t\t\t<label class="topcoat-switch">\n\t\t\t\t\t<input type="checkbox" ng-model="preset.hyphenate" ng-true-value="true" class="topcoat-switch__input">\n\t\t\t\t\t<div class="topcoat-switch__toggle"></div>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div class="col-md-4 col-xs-4">\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Leading (px)</span>\n\t\t\t\t<input type="number" class="topcoat-text-input" min="0" max="1000" step="1" ng-model="preset.leading" placeholder="0 to 1000" uib-tooltip="min:1 max:1000 default:0 (auto)" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t</label>\n\t\t</div>\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Tracking</span>\n\t\t\t\t<input type="number" class="topcoat-text-input" min="-1000" max="10000" step="1" ng-model="preset.tracking" placeholder="-1000 to 10000" uib-tooltip="min:-1000 max:10000 default:0" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t</label>\n\t\t</div>\n\t\t<div class="input-flex">\n\t\t\t<label>\n\t\t\t\t<span>FauxBold</span>\n\t\t\t</label>\n\t\t\t<div>\n\t\t\t\t<label class="topcoat-switch">\n\t\t\t\t\t<input type="checkbox" ng-model="preset.fauxBold" ng-true-value="true" class="topcoat-switch__input">\n\t\t\t\t\t<div class="topcoat-switch__toggle"></div>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="input-flex">\n\t\t\t<label>\n\t\t\t\t<span>FauxItalic</span>\n\t\t\t</label>\n\t\t\t<div>\n\t\t\t\t<label class="topcoat-switch">\n\t\t\t\t\t<input type="checkbox" ng-model="preset.fauxItalic" ng-true-value="true" class="topcoat-switch__input">\n\t\t\t\t\t<div class="topcoat-switch__toggle"></div>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div class="col-md-4 col-xs-4">\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Antialias</span>\n\t\t\t\t<antialias-selector selected-value="preset.antialias"></antialias-selector>\n\t\t\t</label>\n\t\t</div>\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Capitalization</span>\n\t\t\t\t<capitalization-selector selected-value="preset.capitalization"></capitalization-selector>\n\t\t\t</label>\n\t\t</div>\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Justification</span>\n\t\t\t\t<justification-selector selected-value="preset.justification"></justification-selector>\n\t\t\t</label>\n\t\t</div>\n\t\t<div>\n\t\t\t<label class="input-flex">\n\t\t\t\t<span>Kerning</span>\n\t\t\t\t<kerning-selector selected-value="preset.kerning"></kerning-selector>\n\t\t\t</label>\n\t\t</div>\n\t</div>\n</div>\n<div class="row m0">\n\t<div class="col-md-4 col-xs-4">\n\t\t<label class="input-flex">\n\t\t\t<span>Layer group</span>\n\t\t\t<input type="text" class="topcoat-text-input" placeholder="Layer group" ng-model="preset.layerGroup" >\n\t\t</label>\n\t</div>\n\t<div class="col-md-8 col-xs-8 text-right">\n\t\t<button class="topcoat-button" ng-click="applyAction()" uib-tooltip="Apply style on selected text layers" tooltip-popup-delay="500" tooltip-placement="bottom-right">\n\t\t\t<span class="glyphicon glyphicon-screenshot"></span>\n\t\t\t<!-- <span>Apply style on selected layers</span> -->\n\t\t</button>\n\t</div>\n</div>');
$templateCache.put('styles.tpl.html','<div class="no-shrink p">\n\t<button class="topcoat-button" ng-click="newStyleSet()" uib-tooltip="Create a new set" tooltip-popup-delay="1000" tooltip-placement="bottom-left">\n\t<span class="glyphicon glyphicon-plus"></span>\n\t\t<!-- New -->\n\t</button>\n\t<button class="topcoat-button" ng-click="importStyleSet()" uib-tooltip="Import a set from a json file" tooltip-popup-delay="1000" tooltip-placement="bottom-left">\n\t\t<span class="glyphicon glyphicon-import"></span>\n\t\t<!-- Import -->\n\t</button>\n\t<button class="topcoat-button" ng-click="extendStyleSet()" uib-tooltip="Analyze a translation script and extend the current set with keywords found within it" tooltip-popup-delay="1000" tooltip-placement="bottom-left">\n\t\t<span class="glyphicon glyphicon-indent-right"></span>\n\t\t<!-- Extend -->\n\t</button>\n\t<button class="topcoat-button" ng-click="saveStyleSet()" uib-tooltip="Save current set" tooltip-popup-delay="1000" tooltip-placement="bottom">\n\t\t<span class="glyphicon glyphicon-floppy-disk"></span>\n\t\t<!-- Save -->\n\t</button>\n\t<button class="topcoat-button" ng-click="exportStyleSet()" ng-disabled="selectedStyleset == undefined" uib-tooltip="Export current set as a json file" tooltip-popup-delay="1000" tooltip-placement="bottom">\n\t\t<span class="glyphicon glyphicon-export"></span>\n\t\t<!-- Export -->\n\t</button>\n\t<button class="topcoat-button" ng-click="duplicateStyleSet()" ng-disabled="selectedStyleset == undefined" uib-tooltip="Duplicate current set\n\t" tooltip-popup-delay="1000" tooltip-placement="bottom">\n\t\t<span class="glyphicon glyphicon-duplicate"></span>\n\t\t<!-- Duplicate -->\n\t</button>\n\t<button class="topcoat-button" ng-click="deleteStyleSet()" ng-disabled="!!!selectedStyleset" uib-tooltip="Delete current set\n\t" tooltip-popup-delay="1000" tooltip-placement="bottom">\n\t\t<span class="glyphicon glyphicon-trash"></span>\n\t\t<!-- Delete -->\n\t</button>\n\t<styleset-selector selected-value="selectedStyleset"></styleset-selector>\n\t<button class="topcoat-button pull-right" ng-click="exportConstants()" uib-tooltip="Export available fonts and constant values" tooltip-popup-delay="1000" tooltip-placement="bottom-right">\n\t\t<span class="glyphicon glyphicon-save"></span>\n\t\t<span class="glyphicon glyphicon-book"></span>\n\t</button>\n</div>\n\n<div class="row no-shrink pb header">\n\t<div class="col-md-4 col-xs-4">\n\t\t<label>\n\t\t\tName\n\t\t\t<input type="text" class="topcoat-text-input" placeholder="Styleset name" ng-model="styleSet.name" ng-disabled="selectedStyleset === 0" ng-pattern="/[\\d\\w]{1,30}/">\n\t\t</label>\n\t</div>\n\t<div class="col-md-5 col-xs-5">\n\t\t<label>\n\t\t\tStyle filter\n\t\t\t<input type="text" class="topcoat-text-input" placeholder="filter..." ng-model="styleFilter">\n\t\t</label>\n\t\t<button class="topcoat-button" ng-click="clearStyleFilter()" ng-if="!!styleFilter">\n\t\t<span class="glyphicon glyphicon-remove"></span>\n\t</button>\n\t</div>\n\t<div class="col-md-3 col-xs-3 text-right">\n\t\t<button class="topcoat-button" ng-click="addStyle()">Add Style</button>\n\t</div>\n</div>\n<div class="list scrollable padded">\n\t<div class="list-item" ng-repeat="style in styleSet.styles |filter: {keyword: styleFilter||undefined}">\n\t\t<tb-style-preset preset="style" remove-action="removeStyle(style)" duplicate-action="duplicateStyle(style)" apply-action="applyStyle(style)" ng-class="{\'default-style\': style.default}"></tb-style-preset>\n\t</div>\n</div>');}]);