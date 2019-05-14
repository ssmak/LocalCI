<h1 align="center">LocalCI</h1>

<h5 align="center">A continuous integration(CI) solution for local application or service which is behind a firewall. No need to share code with commonly CI tools like CircleCI, TravisCI and Jenkin, because you are hosting your the whole CI cycle.</h5>
<br />
<div align="center">
  <a href="https://github.com/ssmak/local-ci">
    <img src="https://img.shields.io/badge/version-v1.0.4-blueviolet.svg" />
  </a>
  <a href="https://www.npmjs.com/package/local-ci">
    <img src="https://img.shields.io/badge/env-nodejs-orange.svg" />
  </a>
</div>
<br />

## History
I am hosting few web applications locally in development server and will be built many times a day due to provide a touch edge preview to user. The repeatly process can be done by CI tool. However, none of CI tool can deploy to my server due to the company's firewall. That's why I developed LocalCI. <br />
1) Edit and push the code to GitHub.<br />
2) GitHub will fire a Push event(trigger) to registered webhook (*the webhook should be set by you. Just point to the LocalCI server script is OK!).<br />
3) LocalCI client will pull events by polling the LocalCI server script every 5 seconds (*you should provide the repository url and branch name which you want to watch).
4) Running your post script if Push event is received.
<br />
<div align="center">
  <a href="https://paypal.me/ssmak">
    <img src="https://img.shields.io/badge/Donate-PayPal-green.svg" alt="PayPal Donation" />
  </a>
  <br />
  <a href="https://paypal.me/ssmak">
    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" alt="PayPal" />
  </a>
</div>

## Installation + Use
1. Install the npm globally
``` bash
npm install -g local-ci
```

2. Start versioning for directory
```bash
local-ci
```

## License
MIT
