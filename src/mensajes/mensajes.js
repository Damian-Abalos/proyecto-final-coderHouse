const twilio = require("twilio");
const nodemailer = require("nodemailer")
require("dotenv").config();

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const adminMail = process.env.ADMIN_MAIL;

const client = twilio(accountSid, authToken);

const enviarSms = async (to) => {
  try {
    const message = await client.messages.create({
      body: "Su pedido ha sido recibido y se encuentra en proceso.",
      from: "+19379362607",
      to: to,
    });
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

const enviarWhatsapp = async (usuarioNombre, usuarioTelefono) => {
  try {
    const message = await client.messages.create({
      body: `nuevo pedido de ${usuarioNombre}`,
      mediaUrl: [
        "https://st2.depositphotos.com/1114422/5830/v/600/depositphotos_58300529-stock-illustration-check-out-icon-symbol.jpg",
      ],
      from: "whatsapp:+14155238886",
      to: `whatsapp:+${usuarioTelefono}`,
    });
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

const enviarMail = async (usuarioNombre, usuarioMail, productosComprados) => {  
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
          user: adminMail,
          pass: 'ofznioubsfoytlta'
      }
  });
  
  const mailOptions = {
      from: 'Tercera entrega backend',
      to: adminMail,
      subject: `Nuevo pedido de ${usuarioNombre}, ${usuarioMail}`,
      html: productosComprados
  }
  
  try {
      const info = await transporter.sendMail(mailOptions)
      console.log(info)
  } catch (error) {
      console.log(error)
  }
}

module.exports = {
  enviarSms,
  enviarWhatsapp,
  enviarMail
}

// const enviarSms = async (to) => {
//   try {
//     const message = await client.messages.create({
//       body: "Su pedido ha sido recibido y se encuentra en proceso.",
//       from: "+19379362607",
//       to: to,
//     });
//     console.log(message);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const enviarWhatsapp = async (usuarioNombre, usuarioTelefono) => {
//   try {
//     const message = await client.messages.create({
//       body: `nuevo pedido de ${usuarioNombre}`,
//       mediaUrl: [
//         "https://st2.depositphotos.com/1114422/5830/v/600/depositphotos_58300529-stock-illustration-check-out-icon-symbol.jpg",
//       ],
//       from: "whatsapp:+14155238886",
//       to: `whatsapp:${usuarioTelefono}`,
//     });
//     console.log(message);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const enviarMail = async (usuarioNombre, usuarioMail, productosComprados) => {  
  
//   const mailOptions = {
//       from: 'Tercera entrega backend',
//       to: adminMail,
//       subject: `Nuevo pedido de ${usuarioNombre}, ${usuarioMail}`,
//       html: productosComprados
//   }
  
//   try {
//       const info = await transporter.sendMail(mailOptions)
//       console.log(info)
//   } catch (error) {
//       console.log(error)
//   }
// }