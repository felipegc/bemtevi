const escapeHtml = require('escape-html');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'leticiatdrc@gmail.com',
  from: 'bemtevisaudeintegrada@gmail.com',
  subject: 'Notificação de comunicação da Bem Te Vi',
  text: 'Leticia agora vc vai receber emails das pessoas',
  html: '<strong>de forma linda e facil como agora</strong>',
};

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.email = (req, res) => {
  sgMail.send(msg);
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
};
