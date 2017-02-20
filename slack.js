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

function getImage (images) {
  if (!images) return null

  return images[0]
}

function getPrice (price) {
  if (!price) return null

  const sliced = price.slice(6)
  return parseInt(sliced)
}

function getColor (value) {
  if (!value) return 'warning'

  if (value <= 3000) {
    return 'good'
  } else if (value <= 3250) {
    return 'warning'
  }

  return 'danger'
}

function getDescription (description) {
  let count = 0

  for (let i = 0; i < description.length; i++) {
    const chars = description[i] + description[i + 1]
    console.log(chars)
    if (chars === '\n') {
      count++
    }

    if (count === 3) {
      console.log(description.split(i + 2))
      return description.split(i + 2)
    }
  }
}

function sendMessage (listing, result) {
  const image = getImage(listing.images)
  const price = getPrice(result.price)
  const color = getColor(price)

  const payload = {
    attachments: [
      {
        title: listing.title,
        title_link: listing.url,
        text: listing.description,
        color: color,
        image_url: image,
        fallback: `[${listing.title}]: <${listing.url}>`,
        'fields': [
          {
            'title': 'Price',
            'value': '$' + price,
            'short': true
          }
        ]
      }
    ]
  }

  send(payload)
}

module.exports = sendMessage
