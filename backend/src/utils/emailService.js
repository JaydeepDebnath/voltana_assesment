import nodemailer from 'nodemailer';

const sendInvitationEmail = async(email, inviteLink) => {
    const trasnporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from:process.env.EMAIL_USER,
        to : email,
        subject:'You are Invited',
        text:`Please click the link below to set up your password: ${inviteLink} `
    };

    try {
        await trasnporter.sendMail(mailOptions)
    } catch (error) {
        console.error("Error sending invitation email: ", error);
        throw new Error(500, "Failed to send invitation email.");  
    }
}


export default sendInvitationEmail;