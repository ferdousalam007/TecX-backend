"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_to_text_1 = require("html-to-text");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const returnHtml = ({ firstName, url }) => {
    return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Password Reset</title>
      <style>
        /* Global Styles */
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background-color: #f0f4f8;
          margin: 0;
          padding: 0;
          color: #102a43;
        }
  
        a {
          text-decoration: none;
          color: inherit;
        }
  
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          padding-bottom: 30px;
          border: 2px solid #eaeaea;
        }
  
        .header {
          background: linear-gradient(45deg, #42a5f5, #66bb6a);
          padding: 40px;
          text-align: center;
          color: white;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
  
        .header h1 {
          font-size: 26px;
          margin: 0;
          letter-spacing: 1px;
        }
  
        .header p {
          margin-top: 5px;
          font-size: 16px;
        }
  
        .content {
          padding: 40px 30px;
          text-align: center;
        }
  
        .content h2 {
          font-size: 22px;
          margin-bottom: 15px;
          color: #102a43;
        }
  
        .content p {
          font-size: 16px;
          color: #486581;
          line-height: 1.6;
          margin-bottom: 30px;
        }
  
        .btn {
          display: inline-block;
          padding: 15px 25px;
          background-color: #42a5f5;
          color: white !important;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          border-radius: 8px;
          box-shadow: 0 6px 12px rgba(66, 165, 245, 0.3);
          transition: all 0.3s ease;
        }
  
        .btn:hover {
          background-color: #1e88e5;
          box-shadow: 0 8px 16px rgba(30, 136, 229, 0.4);
        }
  
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
  
        .footer a {
          color: #42a5f5;
          font-weight: bold;
          transition: color 0.3s ease;
        }
  
        .footer a:hover {
          color: #66bb6a;
        }
  
        .link-container {
          font-size: 12px;
          margin-top: 20px;
          color: #999;
        }
  
        .link-container a {
          color: #42a5f5;
          word-wrap: break-word;
        }
  
        /* Responsive Design */
        @media screen and (max-width: 600px) {
          .container {
            padding: 20px;
          }
  
          .content {
            padding: 20px;
          }
  
          .btn {
            padding: 12px 20px;
          }
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Password Reset Request</h1>
          <p>We’ve received your password reset request</p>
        </div>
  
        <!-- Main Content -->
        <div class="content">
          <h2>Hello, ${firstName}!</h2>
          <p>
            You recently requested to reset your password. Click the button below
            to proceed with resetting your password. This link will be valid for
            the next 10 minutes.
          </p>
          <a
            href="${url}"
            class="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reset Password
          </a>
  
          <p class="link-container">
            If you’re having trouble with the button above, copy and paste the
            following link into your browser:<br />
            <a href="${url}">${url}</a>
          </p>
        </div>
  
        <!-- Footer -->
        <div class="footer">
          <p>
            Didn’t request this email? You can safely ignore it, or
            <a href="mailto:support@techtalk.com">contact us</a> if you have any
            concerns.
          </p>
          <p>Thank you for using Tech Talk!</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name;
        this.url = url;
        this.from = `Tech Talk <${process.env.EMAIL_FROM}>`;
    }
    // Send the actual email
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            mail_1.default.setApiKey(process.env.SENDGRID_PASSWORD);
            const email = {
                firstName: this.firstName,
                url: this.url,
                subject,
            };
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html: returnHtml(email),
                text: (0, html_to_text_1.htmlToText)(returnHtml(email)),
            };
            yield mail_1.default.send(mailOptions);
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)!');
        });
    }
}
exports.default = Email;
