import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const signUpEmail = async (data: {[key:string]: any}) => {
    const smtpConfig: SMTPTransport.Options = {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT as string),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
    const transport = nodemailer.createTransport(smtpConfig)

    const { name, email, operationToken } = data

    await transport.sendMail({
        from: 'GSP Solutions App',
        to: email,
        subject: 'Confirma tu cuenta en GSP Solutions App',
        text: 'Confirma tu cuenta en GSP Solutions App',
        html:`
            <p>Hola ${name}, comprueba tu cuenta de GSP Solutions App</p>
            <p>
                Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URI}:${process.env.PORT ?? 3000}/api/users/confirm/${operationToken}">Confirmar Cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta ignora este mensaje</p>
        `
    })
}

export const resetPassEmail = async (data: {[key:string]: any}) => {
    const smtpConfig: SMTPTransport.Options = {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT as string),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
    const transport = nodemailer.createTransport(smtpConfig)

    const { name, email, operationToken } = data

    await transport.sendMail({
        from: 'GSP Solutions App',
        to: email,
        subject: 'Reestablece tu contraseña en GSP Solutions App',
        text: 'Reestablece tu contraseña en GSP Solutions App',
        html:`
            <p>Hola ${name}, haz solicitado reestablecer tu contraseña de GSP Solutions App</p>
            <p>
                Codigo de confirmación para generar una nueva contraseña: ${operationToken}
            </p>
            <p>Si tu no realizaste esta acción ignora este mensaje</p>
        `
    })
}

