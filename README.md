Overview
========

This project demonstrates simple login functionality for a distributed application.

Getting started
---------------

1. Add `account.local`, `consumer.local` and `other.local` as aliases for `127.0.0.1` in your hosts file
1. `cd account`
1. `npm install`
1. `npm start`
1. Open browser to http://account.local:3000/
1. Open a new terminal for consumer
1. `cd consumer`
1. `npm install`
1. `npm start`
1. Open browser to http://consumer.local:4000/
1. Open a new terminal for other consumer
1. `cd other-consumer`
1. `npm install`
1. `npm start`
1. Open browser to http://other-consumer.local:4001/
1. Make sure you can see all three browser windows
1. Type some username into the account.local browser
1. All windows should now appear as logged in with the user
1. Click logoout into the account.local browser
1. All windows should now appear as logged out

Implementation of single sign-on
--------------------------------

The single sign-on is designed through having a `<iframe hidden=true href="http://account.local:30001/id.html">` on all consuming pages. This frame content runs on the same host as the master login session and can thus retrieve session data. It uses window.postMessage to post the session information back to the parent page.

When the user logs in or out at http://account.local:3000, the page updates `localStorage`. The `id.html` frame listens to local storage events and updates any parent page with the new login status, which means that all current windows are automatically logged in or out instantanously.

The `id.html` page has a whitelist of SSO partners to avoid leaking information through phishing attacks.

TODO
----

* Add configurable (30 second) expiry to code
* Invalidate server side session when id.html reports as logged out (bug: /update.html will fetch after signout)

* Single Sign OUT: Invalidate issued access_tokens (requires shared state!) - all access_tokens should reference same underlying session
* Add 15 minute session timer - requires all access_tokens in same session to be associated
* Automated tests (what framework to use?)
* Refactor and increase validation code
* Reduce use of session - encrypt cookie
* Encrypt code and access_token
* Use a real user database (Mongo?) with hashed passwords
