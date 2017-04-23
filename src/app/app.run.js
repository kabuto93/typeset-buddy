tb.run(['CONF', '$transitions', '$state', '$stateParams', '$templateCache', '$rootScope', '$trace', '$uiRouter', 'Utils', 'themeManager', '$timeout',
	function(CONF, $transitions, $state, $stateParams, $templateCache, $rootScope, $trace, $uiRouter, Utils, themeManager, $timeout) {

		// convenience shortcuts
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.utils = Utils;
		$rootScope.CSI = new CSInterface();
		$rootScope.extensionID = $rootScope.CSI.getExtensionID();

		themeManager.init();

		function persist(on) {
			var event;
			if (on) {
			  event = new CSEvent('com.adobe.PhotoshopPersistent', 'APPLICATION');
			}
			else {
			  event = new CSEvent('com.adobe.PhotoshopUnPersistent', 'APPLICATION');
			}
			event.extensionId = $rootScope.extensionID;
			$rootScope.CSI.dispatchEvent(event);
		}

		$rootScope.os = $rootScope.CSI.getOSInformation().toLowerCase().indexOf('mac') >= 0 ? 'Mac' : 'Windows';

		// prevent Photoshop from reloading our extension everytime the panel is hidden or closed
		// persist(true);

		$rootScope.debug = CONF.debug;

		// log utility when debug mode is on
		$rootScope.log = function(what, obj) {
			if ($rootScope.debug == true) {
				if (!$rootScope.logContent) $rootScope.logContent = [];
				if (angular.isDefined(obj)) {
					$rootScope.logContent.push({label: what, value: obj});
					console.log(what, obj);
				}
				else {
					$rootScope.logContent.push({label: 'log', value: what});
					console.log(what);
				}
			}
		};

		// trace routes if debug mode
		if ($rootScope.debug == true) {
			$trace.enable(1);
			// $trace.enable('HOOK');
			persist(false);
		}
		else {
			persist(true);
		}

		$rootScope.$watch('debug', function(newVal, oldVal) {
			if (newVal != oldVal) {
				if ($rootScope.debug) {
					$trace.enable(1);
					persist(false);
				}
				else {
					$trace.disable(1);
					persist(true);
				}
			}
		});

	}
]);