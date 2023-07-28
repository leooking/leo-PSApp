**Necessary environment variables:**

- Separate values for dev/stag & prod
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENTID`
- `VITE_REDIRECT_URL`
- `VITE_LOGOUT_URL`

**Secret management method used:**

- Split into two projects, stag & prod    <<<<<<<< Leave prod as is, make new stag project. <<<<<<<<<<<<
- Cloud functions for firebase for secrets are namespaced to the project
   - `functions:secrets:set [options] <KEY>`

