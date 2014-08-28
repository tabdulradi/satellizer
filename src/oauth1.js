angular.module('satellizer')
  .factory('satellizer.Oauth1', ['$q', '$http', 'satellizer.popup', function($q, $http, popup) {
    return function() {
      var defaults = {
        url: null,
        name: null,
        popupOptions: null
      };

      function open(options) {
        angular.extend(defaults, options);

        var deferred = $q.defer();

        popup.open(defaults.url)
          .then(function(response) {
            exchangeForToken(response)
              .then(function(response) {
                deferred.resolve(response);
              })
              .catch(function(response) {
                deferred.reject(response);
              });
          })
          .catch(function(response) {
            deferred.reject(response);
          });

        return deferred.promise;
      }

      function exchangeForToken(oauthData) {
        oauthData = buildQueryString(oauthData);
        return $http.get(defaults.url + '?' + oauthData);
      }

      function buildQueryString(obj) {
        var str = [];
        angular.forEach(obj, function(value, key) {
          str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
        return str.join('&');
      }

      return {
        open: open,
        exchangeForToken: exchangeForToken,
        buildQueryString: buildQueryString
      };
    };
  }]);
