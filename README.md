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
