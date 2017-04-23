tb.controller('ScriptViewCtrl', ['$scope', 'ScriptService', 'StylesService', 'Utils', 'ngToast', '$timeout',
	function($scope, ScriptService, StylesService, Utils, ngToast, $timeout) {

		$scope.reset = function() {
			$scope.filename = '';
			$scope.scriptContent = '';
			$scope.pageContent = '';
			$scope.pageNumbers = [];
			$scope.pageScript = '';
			$scope.pageNotes = '';
			$scope.rawBubbles = '';
			$scope.bubbles = [];
			$scope.pageStyle = '';
			$scope.panelSeparator = ScriptService.panelSeparator();
			$scope.useLayerGroups = ScriptService.useLayerGroups();
			$scope.styleSet = StylesService.getStyleSet();
			$scope.selectedStyleset = $scope.styleSet.id;
		};

		$scope.browseScript = function() {
			let result = window.cep.fs.showOpenDialogEx(false, false, 'Select script file', '', Utils.getValidFileSuffix('*.txt'), undefined, false);
			if (angular.isDefined(result.data[0])) {
				$scope.loadScript(result.data[0]);
			}
		};

		$scope.loadScript = function(filepath, page, silent) {
			let result = window.cep.fs.readFile(filepath);
			if (result.err === 0) {
				ScriptService.lastOpenedScript(filepath);
				$scope.filename = Utils.extractFilename(filepath);
				$scope.scriptContent = result.data;
				$scope.pageNumbers = ScriptService.getPageNumbers($scope.scriptContent);
				if ($scope.pageNumbers.length > 0) {
					if (!!!silent) {
						ngToast.create({className: 'info', content: $scope.pageNumbers.length + ' page(s) found in file'});
					}
					if (page != null) {
						$scope.selectedPage = page;
					}
				}
				else {
					ngToast.create({className: 'info', content: 'Did not find any page number in the script'});
					ScriptService.lastOpenedScript(null);
					ScriptService.lastOpenedPage(null);
					$scope.reset();
				}
			}
			else {
				ScriptService.lastOpenedScript(null);
				ScriptService.lastOpenedPage(null);
				$scope.reset();
				ngToast.create({className: 'danger', content: 'Could not read the file'});
			}
		};

		$scope.setPanelSeparator = function(panelSeparator) {
			$scope.panelSeparator = ScriptService.panelSeparator(panelSeparator);
		};

		$scope.setUseLayerGroups = function(use) {
			$scope.useLayerGroups = ScriptService.useLayerGroups(use);
		};

		$scope.loadPage = function(pageNumber) {
			if (angular.isDefined(pageNumber) && pageNumber != null && !Utils.isEmpty($scope.scriptContent)) {
				$scope.pageScript = ScriptService.loadPage($scope.scriptContent, pageNumber);
				if ($scope.pageScript != null) {
					let tmpPageStyle = ScriptService.getTextStyles($scope.pageScript[1], 'default_style')[0];
					$scope.pageStyle = ($scope.styleSet.styles.findIndex(function(one) { return one.keyword == tmpPageStyle; }) === -1)? {keyword: tmpPageStyle, inStyleSet: false} : {keyword: tmpPageStyle, inStyleSet: true};
					$scope.$root.log('pageStyle', $scope.pageStyle);
					$scope.pageNotes = ScriptService.getNotes($scope.pageScript[1]);
					$scope.$root.log('pageNotes', $scope.pageNotes);
					$scope.rawBubbles = $scope.pageScript[2];
					$scope.bubbles = [];
					$scope.$root.log('rawBubbles', $scope.rawBubbles);
					if (ScriptService.pageContainsText($scope.rawBubbles)) {
						$scope.$root.log('contains text');
						let lines = [];
						let previousStyle = $scope.pageStyle.keyword;
						lines = $scope.rawBubbles.split('\n');
						$scope.$root.log('lines', lines);
						lines.forEach(function(line) {
							let skipIt = ScriptService.skipThisLine(line, ScriptService.panelSeparator());
							if (skipIt === false) {
								let bubble = {
									text: ScriptService.cleanLine(line),
									styles: [],
									doublePart: false,
									notes: ScriptService.getNotes(line)
								};
								let tmpStyles = [];
								if (ScriptService.isDoubleBubblePart(line)) {
									tmpStyles = ScriptService.getTextStyles(line, previousStyle);
									bubble.doublePart = true;
									// bubble.parent = $scope.bubbles[$scope.bubbles.length -1];
									$scope.bubbles[$scope.bubbles.length -1].hasChild = true;
								}
								else {
									tmpStyles = ScriptService.getTextStyles(line, $scope.pageStyle.keyword);
								}
								previousStyle = tmpStyles[0];

								bubble.styles = tmpStyles.map(function(one) {
									let idx = $scope.styleSet.styles.findIndex(function(available) { return available.keyword == one; });
									return (idx === -1 )? {keyword: one, inStyleSet: false} : {keyword: one, inStyleSet: true};
								});

								$scope.bubbles.push(bubble);
							}
							else if (skipIt === null) {
								$scope.bubbles.push({panelSeparator: true});
							}

						});
					}
					ScriptService.lastOpenedPage(pageNumber);
					$scope.$root.log('bubbles', $scope.bubbles);
				}
				else {
					ngToast.create({className: 'info', content: 'Could not find page ' + pageNumber + ' in file'});
					$scope.selectedPage = null;
					ScriptService.lastOpenedPage(null);
					$scope.bubbles = [];
				}
			}
			else $scope.bubbles = [];
		};

		$scope.incPageNumber = function(forward) {
			let inc = (!!forward)? 1 : -1;
			if (!!$scope.pageNumbers.length) {
				if (angular.isDefined($scope.selectedPage)) {
					let idx = $scope.pageNumbers.findIndex(function(one) { return one == $scope.selectedPage; });
					if (angular.isDefined($scope.pageNumbers[idx + inc])) {
						$scope.selectedPage = $scope.pageNumbers[idx + inc];
						ScriptService.lastOpenedPage($scope.selectedPage);
					}
				}
				else {
					$scope.selectedPage = $scope.pageNumbers[0];
				}
			}
		};

		$scope.loadStyleSet = function() {
			$scope.styleSet = StylesService.getStyleSet($scope.selectedStyleset);
		};

		$scope.typeset = function(text, style) {
			if (!!$scope.selectedForcedStyle) {
				$scope.$root.log('force style', $scope.selectedForcedStyle);
				style = {keyword: $scope.selectedForcedStyle, inStyleSet: true};
			}
			if (!style.inStyleSet) {
				ngToast.create({className: 'danger', content: 'Style "'+ style.keyword +'" not found in styleset'});
			}
			else {
				let stylePreset = $scope.styleSet.styles.find(function(one) { return one.keyword == style.keyword; });
				if (!!!stylePreset) stylePreset = $scope.styleSet.styles[0];
				stylePreset.useLayerGroups = ScriptService.useLayerGroups();
				let typesetObj = {text: text, style: stylePreset};
				$scope.$root.log('typesetObj', typesetObj);
				ScriptService.typeset(typesetObj)
				.then(
					function() {},
					function(err) {
						ngToast.create({className: 'danger', content: err});
					}
				);
			}
		};

		$scope.reset();

		// autoload last openedscript
		$timeout(function() {
			if (!!ScriptService.lastOpenedScript()) {
				$scope.loadScript(ScriptService.lastOpenedScript(), ScriptService.lastOpenedPage(), true);
			}
		}, 300);

		$scope.$watch('selectedPage', function(newVal, oldVal) {
			if (angular.isDefined(newVal)) {
				$scope.loadPage(newVal);
			}
		});

		$scope.$watch('panelSeparator', function(newVal, oldVal) {
			if (angular.isDefined(newVal)) {
				$scope.loadPage($scope.selectedPage);
			}
		});

		$scope.$watch('selectedStyleset', function(newVal, oldVal) {
			if (angular.isDefined(newVal) && newVal != null) {
				$scope.loadStyleSet(newVal);
				$scope.loadPage($scope.selectedPage);
			}
		});

	}
]);