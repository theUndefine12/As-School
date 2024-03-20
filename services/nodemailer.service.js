import nodemailer from 'nodemailer'
import Code from '../models/Code.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "miko.mikoo1999@gmail.com",
    pass: "uohw jaeo fswk djps",
  },
});

// nodemailer.service.js
const mailOptions = (email, num) => {
  return {
    from: 'As-Company',
    to: email,
    subject: 'Zl-Aset',
    // text: 'Hello Bro This is your verification code' + ' ' + num,
     html: `<h2>Hi Bro This is your verification code: <h3>${num}</h3></h2>`
  };
};


const deleteExpiredOtpCodes = async () => {
  const result = await Code.deleteMany({})

  console.log('The Codes is Deleted from Db', result.deletedCount)
};

export const sendOtp = async (email) => {
  const randomNumbers =
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10);

  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 2);

  const otp = new Code({email: email, code: randomNumbers, experienceIn: expirationDate})

  await otp.save()
  console.log(otp);

  transporter.sendMail(mailOptions(email, randomNumbers), (error, info) => {
    if (error) {
      console.error('❌ Error:', error.message)
    } else {
      console.log('✅ Email sent:', info.response)
    }
  })

  setInterval(deleteExpiredOtpCodes, 60000)
}
