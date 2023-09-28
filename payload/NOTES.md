### Payload SCSS Variables

https://github.com/payloadcms/payload/blob/master/src/admin/scss/app.scss
https://github.com/payloadcms/payload/blob/master/src/admin/scss/colors.scss

### Auth

Logging in to the CMS at /login creates a cookie called "payload-token"

- this cookie determines what you can read,update,etc on both the front- and back-end
- if you log out of the CMS, any collections that don't allow public "read" access will not be displayed on the front-end.
