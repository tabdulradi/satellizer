angular.module('satellizer')
  .run(['$rootScope', '$window', '$location', 'satellizer.utils', 'satellizer.config',
    function($rootScope, $window, $location, utils, config) {
      var token = localStorage.getItem([config.tokenPrefix, config.tokenName].join('_'));

      if (token) {
        $rootScope.isAuthenticated = true;
      }

      var params = $window.location.search.substring(1);
      var qs = Object.keys($location.search()).length ? $location.search() : utils.parseQueryString(params);

      if ($window.opener && $window.opener.location.origin === $window.location.origin) {
        if (qs.oauth_token && qs.oauth_verifier) {
          $window.opener.postMessage({ oauth_token: qs.oauth_token, oauth_verifier: qs.oauth_verifier }, $window.location.origin);
        } else if (qs.code) {
          $window.opener.postMessage({ code: qs.code }, $window.location.origin);
        } else if (qs.error) {
          $window.opener.postMessage({ error: qs.error }, $window.location.origin);
        }
      }

      try {
        angular.module('ngRoute');
        $rootScope.$on('$routeChangeStart', function(event, current) {
          if ($rootScope.isAuthenticated &&
            (current.originalPath === config.loginRoute || current.originalPath === config.signupRoute)) {
            $location.path(config.loginRedirect);
          }

          if (current.protected && !$rootScope.isAuthenticated) {
            $location.path(config.loginRoute);
          }
        });
      } catch (error) {

      }

      try {
        angular.module('ui.router');
        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if ($rootScope.isAuthenticated &&
            (toState.url === config.loginRoute || toState.url === config.signupRoute)) {
            $location.path(config.loginRedirect);
          }
          if (toState.protected && !$rootScope.isAuthenticated) {
            $location.path(config.loginRoute);
          }
        });
      } catch (error) {

      }
    }]);
