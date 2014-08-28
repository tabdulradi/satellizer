angular.module(['satellizer'])
  .constant('satellizer.config', {
    logoutRedirect: '/',
    loginRedirect: '/',
    signupRedirect: '/login',
    loginUrl: '/auth/login',
    signupUrl: '/auth/signup',
    loginRoute: '/login',
    signupRoute: '/signup',
    tokenName: 'token',
    tokenPrefix: 'satellizer',
    unlinkUrl: '/auth/unlink/',
    providers: {
      google: {
        url: '/auth/google',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
        redirectUri: window.location.origin,
        scope: 'openid profile email',
        scopeDelimiter: ' ',
        requiredUrlParams: ['scope'],
        optionalUrlParams: ['display'],
        display: 'popup',
        type: '2.0',
        popupOptions: {
          width: 452,
          height: 633
        }
      },
      facebook: {
        url: '/auth/facebook',
        authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
        redirectUri: window.location.origin + '/',
        scope: 'email',
        scopeDelimiter: ',',
        requiredUrlParams: ['display', 'scope'],
        display: 'popup',
        type: '2.0',
        popupOptions: {
          width: 481,
          height: 269
        }
      },
      linkedin: {
        url: '/auth/linkedin',
        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
        redirectUri: window.location.origin,
        requiredUrlParams: ['state'],
        scope: [],
        scopeDelimiter: ' ',
        state: 'STATE',
        type: '2.0',
        popupOptions: {
          width: 527,
          height: 582
        }
      },
      github: {
        name: 'github',
        url: '/auth/github',
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        redirectUri: window.location.origin,
        scope: [],
        scopeDelimiter: ' ',
        type: '2.0',
        popupOptions: {
          width: 1020,
          height: 618
        }
      },
      twitter: {
        url: '/auth/twitter',
        type: '1.0'
      }
    }
  });
