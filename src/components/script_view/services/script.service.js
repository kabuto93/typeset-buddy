tb.factory('ScriptService', ['$rootScope', 'SettingsService', '$q',
	function($rootScope, SettingsService, $q) {
		var self = this;

		self.maybeTypesetToPath = function(typesetObj) {
			let def = $q.defer();
			let tmpObj = angular.copy(typesetObj);
			tmpObj.useLayerGroups = SettingsService.setting('useLayerGroups');
			$rootScope.log('typesetObj', tmpObj);
			$rootScope.CSI.evalScript('tryExec("getSingleRectangleSelectionCoordinates");', function(res) {
				$rootScope.log('maybeTypesetToPath return', res);
				if (res == 'no_document') {
					def.reject('No document');
				}
				else if (res == 'no_selection') {
					return self.typeset(tmpObj)
				}
				else if (res == 'multiple_paths') {
					def.reject('Too many paths. Only one path allowed.');
				}
				else if (res == 'too_many_anchors') {
					def.reject('Too many anchors in path. Only rectangle paths are allowed (use the marquee tool).');
				}
				else {
					try {
						res = JSON.parse(res);
						if (!angular.isDefined(res.x)) {
							def.reject('The coordinates were malformed.');
						}
						else {
							tmpObj.coordinates = res;
							return self.typeset(tmpObj);
						}
					}
					catch (e) {
						def.reject('Could not parse the coordinates.');
					}
				}
			});
			return def.promise;
		};

		self.typeset = function(typesetObj) {
			let def = $q.defer();
			$rootScope.CSI.evalScript('tryExec("typesetEX", ' + JSON.stringify(typesetObj) + ');', function(res) {
				$rootScope.log('typeset return', res);
				if (res === 'no_document') {
					def.reject('No document');
				}
				else if(res === 'done') {
					def.resolve();
				}
				else {
					def.reject(res)
				}
			});
			return def.promise;
		};

		self.typesetPage = function(pageScript, styleSet){
			let start = new Date();
			let def = $q.defer();
			let options = {
				panelSeparator: SettingsService.setting('panelSeparator'),
				useLayerGroups: SettingsService.setting('useLayerGroups'),
				skipSfxs: SettingsService.setting('skipSfxs'),
				textReplaceRules: (SettingsService.setting('textReplace'))? SettingsService.setting('textReplaceRules') : []
			};
			$rootScope.CSI.evalScript('tryExec("typesetPage", ' + JSON.stringify(pageScript) + ',' + JSON.stringify(styleSet) + ',' + JSON.stringify(options) + ');', function(res) {
				$rootScope.log('typesetPage return', res);
				if (res === 'no_document') {
					def.reject('No document');
				}
				else if(res === 'done') {
					$rootScope.log('duration', new Date() - start);
					def.resolve();
				}
				else {
					def.reject(res)
				}
			});
			return def.promise;
		};

		return self;
	}
]);
