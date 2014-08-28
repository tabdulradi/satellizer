angular.module('satellizer')
  .factory('satellizer.Oauth2', [
    '$q',
    '$http',
    'satellizer.popup',
    'satellizer.utils',
    function($q, $http, popup, utils) {
      return function() {
        var defaults = {
          url: null,
          name: null,
          scope: null,
          scopeDelimiter: null,
          clientId: null,
          redirectUri: null,
          popupOptions: null,
          authorizationEndpoint: null,
          requiredUrlParams: null,
          optionalUrlParams: null,
          defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
          responseType: 'code'
        };

        // TODO: setup scope delimiter and document it in readme

        function open(options) {
          angular.extend(defaults, options);
          var deferred = $q.defer();
          var url = buildUrl();

          popup.open(url, defaults.popupOptions)
            .then(function(oauthData) {
              exchangeForToken(oauthData)
                .then(function(response) {
                  deferred.resolve(response);
                })
                .catch(function(response) {
                  deferred.reject(response);
                });
            })
            .catch(function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }

        function exchangeForToken(oauthData) {
          return $http.post(defaults.url, {
            code: oauthData.code,
            clientId: defaults.clientId,
            redirectUri: defaults.redirectUri
          });
        }

        function buildUrl() {
          var baseUrl = defaults.authorizationEndpoint;
          var qs = buildQueryString();
          return [baseUrl, qs].join('?');
        }

        function buildQueryString() {
          var keyValuePairs = [];
          var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

          angular.forEach(urlParams, function(params) {
            angular.forEach(defaults[params], function(paramName) {
              var camelizedName = utils.camelCase(paramName);
              var paramValue = defaults[camelizedName];
              keyValuePairs.push([paramName, encodeURIComponent(paramValue)]);
            });
          });

          return keyValuePairs.map(function(pair) {
            return pair.join('=');
          }).join('&');
        }

        return {
          open: open,
          exchangeForToken: exchangeForToken,
          buildUrl: buildUrl,
          buildQueryString: buildQueryString
        };
      };
    }]);
