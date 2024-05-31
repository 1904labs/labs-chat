// we want to generate a random session id each 
// time the react app is loaded and then cache that
// value so we can return it in the export
// this way, components can share the same session
// 
// POSSIBLE TODO: have the session managed in this file
// use the localstorage instead so that we can 
// pull from there and reuse the session without 
// worrying about page refreshes

// don't think we need to import crypto for this?
// ... do we? Seems to just work.
const sessionId = crypto.randomUUID();

// export the session id as a "cached" value
export default sessionId;