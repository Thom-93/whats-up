const emailjs = require('@emailjs/nodejs');

const publickey = "t9GMVP_mWg78xuX8w";
const privateKey = "ejOXJ1ANq66dw-hkYXX9N";

const serviceID = "service_j44n03q";
const templateID = "template_qn4hkzn";

const sendMail = async (user) => {
  try {
    var params = {
      name: user.username,
      email: user.local.email,
      message: 'send',
    };

    const response = await emailjs.send(serviceID, templateID, params, { publicKey: publickey, privateKey: privateKey });
  
  } catch (err) {
    console.log(err);
  }
};

exports.sendMail = sendMail;
