const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

exports.sendEmail = functions.https.onRequest((req, res) => {

  const from = functions.config().mail.from;
  const password = functions.config().mail.password;
  const to = functions.config().mail.to;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: from,
        pass: password
    }
  });

  cors(req, res, () => {
    const mailOptions = {
      from: from,
      to: to,
      subject: 'Notificação de contato pelo site',
      html:
        `
        <h1 style="font-size: 16px;">Contato</h1>
        <p>Nome: ${req.query.name}</p>
        <p>Telefone: ${req.query.name}</p>
        <p>Email: ${req.query.email}</p>
        <p>Mensagem: ${req.query.message}</p>
        `
    };

    return transporter.sendMail(mailOptions, (error, info) => {
      console.log(info)
      if(error){
        return res.status(400).json({message: 'ERROR', detail: error.toString()});
      }
      return res.status(200).json({
        message: 'SUCCESS'
      });
    });
  });
});