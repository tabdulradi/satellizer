angular.module('satellizer')
  .factory('satellizer.local', [
    '$q',
    '$http',
    '$location',
    '$rootScope',
    'satellizer.utils',
    'satellizer.config',
    function($q, $http, $location, $rootScope, utils, config) {

      var local = {};

      // TODO: Move to shared service
      local.parseUser = function(token, deferred) {
        // TODO: Move userFromToken to shared service
        localStorage.setItem([config.tokenPrefix, config.tokenName].join('_'), token);

        $rootScope.isAuthenticated = true;

        if (config.loginRedirect) {
          $location.path(config.loginRedirect);
        }

        deferred.resolve();
      };

      local.login = function(user) {
        var deferred = $q.defer();

        $http.post(config.loginUrl, user)
          .then(function(response) {
            local.parseUser(response.data[config.tokenName], deferred);
          })
          .catch(function(response) {
            deferred.reject(response);
          });

        return deferred.promise;
      };

      local.signup = function(user) {
        var deferred = $q.defer();

        $http.post(config.signupUrl, user)
          .then(function() {
            $location.path(config.signupRedirect);
            deferred.resolve();
          })
          .catch(function(response) {
            deferred.reject(response);
          });

        return deferred.promise;
      };

      local.logout = function() {
        var deferred = $q.defer();

        $rootScope.isAuthenticated = false;
        localStorage.removeItem([config.tokenPrefix, config.tokenName].join('_'));

        if (config.logoutRedirect) {
          $location.path(config.logoutRedirect);
        }

        deferred.resolve();

        return deferred.promise;
      };

      local.isAuthenticated = function() {
        return $rootScope.isAuthenticated;
      };

      local.unlink = function(provider) {
        var deferred = $q.defer();

        $http.get(config.unlinkUrl + provider)
          .then(function(response) {
            local.parseUser(response.data[config.tokenName], deferred);
          })
          .catch(function(response) {
            deferred.reject(response);
          });

        return deferred.promise;
      };

      return local;
    }]);
