angular.module('satellizer')
  .provider('$auth', ['satellizer.config', function(config) {
    Object.defineProperties(this, {
      logoutRedirect: {
        get: function() { return config.logoutRedirect; },
        set: function(value) { config.logoutRedirect = value; }
      },
      loginRedirect: {
        set: function(value) { config.loginRedirect = value; },
        get: function() { return config.loginRedirect; }
      },
      signupRedirect: {
        get: function() { return config.signupRedirect; },
        set: function(value) { config.signupRedirect = value; }
      },
      loginUrl: {
        get: function() { return config.loginUrl; },
        set: function(value) { config.loginUrl = value; }
      },
      signupUrl: {
        get: function() { return config.signupUrl; },
        set: function(value) { config.signupUrl = value; }
      },
      loginRoute: {
        get: function() { return config.loginRoute; },
        set: function(value) { config.loginRoute = value; }
      },
      signupRoute: {
        get: function() { return config.signupRoute; },
        set: function(value) { config.signupRoute = value; }
      },
      tokenName: {
        get: function() { return config.tokenName; },
        set: function(value) { config.tokenName = value; }
      },
      tokenPrefix: {
        get: function() { return config.tokenPrefix; },
        set: function(value) { config.tokenPrefix = value; }
      },
      unlinkUrl: {
        get: function() { return config.unlinkUrl; },
        set: function(value) { config.unlinkUrl = value; }
      }
    });

    this.facebook = function(params) {
      angular.extend(config.providers.facebook, params);
    };

    this.google = function(params) {
      angular.extend(config.providers.google, params);
    };

    this.linkedin = function(params) {
      angular.extend(config.providers.linkedin, params);
    };

    this.github = function(params) {
      angular.extend(config.providers.github, params);
    };

    this.twitter = function(params) {
      angular.extend(config.providers.twitter, params);
    };

    var oauth = function(params) {
      config.providers[params.name] = config.providers[params.name] || {};
      angular.extend(config.providers[params.name], params);
    };

    this.oauth1 = function(params) {
      oauth(params);
      config.providers[params.name].type = '1.0';
    };

    this.oauth2 = function(params) {
      oauth(params);
      config.providers[params.name].type = '2.0';
    };

    this.$get = [
      '$q',
      '$http',
      '$rootScope',
      'satellizer.local',
      'satellizer.utils',
      'satellizer.Oauth1',
      'satellizer.Oauth2',
      function($q, $http, $rootScope, local, utils, Oauth1, Oauth2) {

        // TODO: rootscope events

        var $auth = {};

        $auth.authenticate = function(name) {
          var deferred = $q.defer();
          var provider = (config.providers[name].type === '1.0') ? new Oauth1() : new Oauth2();

          provider.open(config.providers[name])
            .then(function(response) {
              local.parseUser(response.data[config.tokenName], deferred);
            })
            .catch(function(response) {
              deferred.reject(response);
            });

          return deferred.promise;
        };

        $auth.login = function(user) {
          return local.login(user);
        };

        $auth.signup = function(user) {
          return local.signup(user);
        };

        $auth.logout = function() {
          return local.logout();
        };

        $auth.isAuthenticated = function() {
          return local.isAuthenticated();
        };

        $auth.link = function(name) {
          return $auth.authenticate(name);
        };

        $auth.unlink = function(provider) {
          return local.unlink(provider);
        };

        // TODO: call from parseUser
        $auth.updateToken = function(token) {
          localStorage.setItem([config.tokenPrefix, config.tokenName].join('_'), token);
        };

        return $auth;
      }];

  }]);
