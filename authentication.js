'use strict';

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = (z, bundle) =>
  z.request({ url: 'https://auth.lambdatest.com/api/organization/users' });

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'The Username and/or Access Key you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }

  return response;
};

//modified basic Auth middleware
const addBasicAuthHeader = (req, z, bundle) => {
    if (
      bundle.authData &&
      (bundle.authData.username || bundle.authData.accessKey)
    ) {
      const username = bundle.authData.username || '';
      const accessKey = bundle.authData.access_key || '';
  
      const buff = Buffer.from(`${username}:${accessKey}`, 'utf8');
      const header = 'Basic ' + buff.toString('base64');

      z.console.log(bundle.authData);

      throw new z.errors.Error(
        // This message is surfaced to the user
        'debug',
        'variables',
        bundle.authData
      );
  
      if (req.headers) {
        req.headers.Authorization = header;
      } else {
        req.headers = {
          Authorization: header,
        };
      }
    }
    return req;
};
  
module.exports = {
  config: {
    // "basic" auth automatically creates "username" and "password" input fields. It
    // also registers default middleware to create the authentication header.
    type: 'custom',

    // Define any input app's auth requires here. The user will be prompted to enter
    // this info when they connect their account.
    fields: [{ key: 'Username', label: 'Username', required: true }, { key: 'Access Key', label: 'Access Key', required: true }],

    // The test method allows Zapier to verify that the credentials a user provides
    // are valid. We'll execute this method whenever a user connects their account for
    // the first time.
    test,

    // This template string can access all the data returned from the auth test. If
    // you return the test object, you'll access the returned data with a label like
    // `{{json.X}}`. If you return `response.data` from your test, then your label can
    // be `{{X}}`. This can also be a function that returns a label. That function has
    // the standard args `(z, bundle)` and data returned from the test can be accessed
    // in `bundle.inputData.X`.
    connectionLabel: '{{json.username}}',
  },
  befores: [addBasicAuthHeader],
  afters: [handleBadResponses],
};