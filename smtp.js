const nodemailer = require('nodemailer');

// console.log(process.env.SMTP_ID)
// console.log(process.env.SMTP_PW)

const mail = {

  send : (req) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      prot: 587,
      host: 'smtp.gmail.com',
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_ID,
        pass: process.env.SMTP_PW,
      }
    });

    const option = {
      from: 'markrulerofficial@gmail.com',
      to : req.to,
      subject : 'MarkURL is here.',
      text : req.text
    }

    transporter.sendMail(option, (err, res) => {
      console.log(err || res);
    })
  }
}

module.exports = mail;