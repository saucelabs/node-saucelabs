# node-saucelabs -- Node wrapper around the Saucelabs REST API

## Download or update node

http://nodejs.org/#download

## Install

```shell
npm install saucelabs
```

## Writting a script

```javascript
var sauce = require('./index');

var myAccount = new sauce({
    username: "your sauceusername",
    password: "your sauce api key",
})

myAccount.getAccountDetails( function (err, res) {
  console.log(res);
  myAccount.getServiceStatus( function (err, res) {
    console.log(res);
    myAccount.getBrowsers( function (err, res) {
	    console.log(res);
    })
  })
});
```

## Supported Methods

<table class="wikitable">
  <tbody>
    <tr >
      <td width=50%><strong>Rest</strong></td>
      <td width=50%><strong>Node Wrapper</strong></td>
    </tr>
    <tr>
      <td>GET /users/:username</td>
      <td>getAccountDetails(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>GET /:username/limits</td>
      <td> ... </td>
    </tr>
    <tr>
      <td>GET /:username/activity</td>
      <td>getUserActivity(cb, start, end) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>GET /users/:username/usage</td>
      <td> ... </td>
    </tr>
    <tr>
      <td>GET /:username/jobs</td>
      <td>getJobs(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>GET /:username/jobs/:id</td>
      <td>showJob(id, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>PUT /:username/jobs/:id</td>
      <td>updateJob(id, data, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>PUT /:username/jobs/:id/stop</td>
      <td>stopJob(id, data, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>GET /:username/tunnels</td>
      <td>getActiveTunnels(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>GET /:username/tunnels/:id</td>
      <td>getTunnel(id, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>DELETE /:username/tunnels/:id</td>
      <td>deleteTunnel(id, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>GET /info/status</td>
      <td></td>
    </tr>
    <tr>
      <td>GET /info/browsers</td>
      <td></td>
    </tr>
    <tr>
      <td>GET /info/counter</td>
      <td>getServiceStatus(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>POST /users/:id</td>
      <td>createSubAccount(data, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>POST /users/:id/subscription</td>
      <td> ... </td>
    </tr>
  </tbody>
</table>
	
	
