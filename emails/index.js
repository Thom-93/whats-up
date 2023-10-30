const nodemailer = require("nodemailer");
const sparkPostTransporter = require("nodemailer-sparkpost-transport");
const path = require("path");
const pug = require("pug");

class Email {
  constructor() {
    this.from = "whats-up <no-replay@whats-up.site>";
    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport(
        sparkPostTransporter({
          sparkPostApiKey: "8739b4e60419064aa328ad0da459e5932fa0bf50",
          endpoint: "https://api.eu.sparkpost.com",
        })
      );
    } else {
      this.transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "120cc6649c890c",
          pass: "fb8f1960fcd227",
        },
      });
    }
  }

  async sendEmailVerification(options) {
    try {
      const email = {
        from: this.from,
        subject: "Email verification",
        to: options.to,
        html: pug.renderFile(
          path.join(__dirname, "templates/email-verification.pug"),
          {
            username: options.username,
            url: `https://${options.host}/users/email-verification/${options.userId}/${options.token}`,
          }
        ),
      };
      await this.transporter.sendMail(email);
    } catch (e) {
      throw e;
    }
  }

  async sendResetPasswordLink(options) {
    try {
      const email = {
        from: this.from,
        subject: "Password reset",
        to: options.to,
        html: pug.renderFile(
          path.join(__dirname, "templates/password-reset.pug"),
          {
            username: options.username,
            url: `https://${options.host}/users/reset-password/${options.userId}/${options.token}`,
          }
        ),
      };
      await this.transporter.sendMail(email);
    } catch (e) {
      throw e;
    }
  }
  async sendCheckImage(options) {
    try {
      const email = {
        from: this.from,
        subject: "Image verification",
        to: options.to,
        html: pug.renderFile(
          path.join(__dirname, "templates/img-validation.pug"),
          {
            url: `https://${options.host}/letters`,
          }
        ),
      };
      await this.transporter.sendMail(email);
    } catch (e) {
      throw e;
    }
  }

  async sendEmailFeedback(options) {
    try {
      const email = {
        from: this.from,
        subject: options.subject,
        to: "thomasxfurax@gmail.com",
        html: pug.renderFile(
          path.join(__dirname, "templates/feedback-email.pug"),
          {
            username: options.username,
            email: options.email,
            subject: options.subject,
            message: options.message,
          }
        ),
      };
      const send = await this.transporter.sendMail(email);
      if (send) {
        return true;
      } else {
        throw new Error("un probleme est survenue lors de l'envoie du mail");
      }
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new Email();
