angular.module('satellizer')
  .config(['$httpProvider', 'satellizer.config', function($httpProvider, config) {
    $httpProvider.interceptors.push(['$q', function($q) {
      return {
        request: function(httpConfig) {
          if (localStorage.getItem([config.tokenPrefix, config.tokenName].join('_'))) {
            httpConfig.headers.Authorization = 'Bearer ' + localStorage.getItem([config.tokenPrefix, config.tokenName].join('_'));
          }
          return httpConfig;
        },
        responseError: function(response) {
          if (response.status === 401) {
            localStorage.removeItem([config.tokenPrefix, config.tokenName].join('_'));
          }
          return $q.reject(response);
        }
      };
    }]);
  }]);
