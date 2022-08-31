const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: process.env.FROM_MAIL,
    subject: "Thanks for joining in!",
    text: `Welcome to the app ${name}. Let me know how you get along with the app!`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: process.env.FROM_MAIL,
    subject: "Sorry for seeing you leaving out!",
    text: `Sorry to see you leaving the app ${name}. Hope we will one day see you again!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
