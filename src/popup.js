'use strict';

angular.module('satellizer')
  .factory('satellizer.popup', ['$q', '$interval', '$window', function($q, $interval, $window) {
    var popupWindow = null;
    var polling = null;

    var popup = {};

    popup.popupWindow = popupWindow;

    popup.open = function(url, options) {

      var deferred = $q.defer();
      var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));

      popupWindow = $window.open(url, '_blank', optionsString);
      popupWindow.focus();

      popup.postMessageHandler(deferred);
      popup.pollPopup(deferred);

      return deferred.promise;
    };

    popup.pollPopup = function(deferred) {
      polling = $interval(function() {
        if (popupWindow.closed) {
          $interval.cancel(polling);
          deferred.reject({ data: 'Authorization Failed' });
        }
      }, 35);
    };

    popup.postMessageHandler = function(deferred) {
      $window.addEventListener('message', function(event) {
        if (event.origin === $window.location.origin) {
          popupWindow.close();
          if (event.data.error) {
            deferred.reject({ data: event.data.error });
          } else {
            deferred.resolve(event.data);
          }
        }
      }, false);
    };

    popup.prepareOptions = function(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return angular.extend({
        width: width,
        height: height,
        left: $window.screenX + (($window.outerWidth - width) / 2),
        top: $window.screenY + (($window.outerHeight - height) / 2.5)
      }, options);
    };

    popup.stringifyOptions = function(options) {
      var parts = [];
      angular.forEach(options, function(value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return popup;
  }]);
