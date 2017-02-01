const IncomingWebhook = require('@slack/client').IncomingWebhook
const url = process.env.SLACK_WEBHOOK

var webhook = new IncomingWebhook(url)

function send (message) {
  webhook.send(message, function (err, res) {
    if (err) {
      console.log('Error:', err)
    } else {
      console.log('Message sent')
    }
  })
}

module.exports = {send}
