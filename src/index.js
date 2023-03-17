const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
// const { createChannel } = require('./utils/messageQueue');

// const { sendBasicEmail } = require('./services/email-service');
const TicketController = require('./controllers/ticket-controller');
const EmailService = require('./services/email-service');

const jobs = require('./utils/job');
const { subscribeMessage, createChannel } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('./config/serverConfig');

const setupAndStartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    const channel = await createChannel();
    subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);

    app.post('/api/v1/tickets', TicketController.create);

    app.listen(PORT, () => {
        console.log(`Server started at PORT ${PORT}`);
        jobs(); //comment it out if you don't need to send mails 
        // sendBasicEmail(
        //     'support@admin.com',
        //     'ambarish.dutta1010@gmail.com',
        //     'This is a testing email',
        //     'Hey, how are you, I hope you like the support'
        // );
    });
}

setupAndStartServer();