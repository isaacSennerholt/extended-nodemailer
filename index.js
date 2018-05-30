const nodemailer = require('nodemailer')

module.exports = ({serviceName, serviceEmail, servicePassword} = {}) => {

  const serviceTransporter = nodemailer.createTransport({
    service: serviceName,
    auth: {
      user: serviceEmail,
      pass: servicePassword
    }
  })

  return templateDirectory => {
    return {
      dispatch: (mailOptions, templateName, ...args) => {

        return new Promise((resolve, reject) => {
          const template = templateDirectory[templateName]
          if (!template) reject(new Error('A template was not found by given name.'))

          const html = typeof template === 'function' ?
            template(...args) :
            template

          const mailConfig = Object.assign({}, mailOptions, {from: serviceEmail, html})
          return serviceTransporter.sendMail(mailConfig, (error, info) => {
            if (error) return reject(error)
            return resolve(info)
          })
        })

      }
    }
  }

}
