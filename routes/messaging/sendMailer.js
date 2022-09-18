const amqplib = require('amqplib/callback_api');
const config = {
    "amqp": "amqp://localhost",
    "queue": "nodemailer-amqp",
  
    "server": {
      "port": 8090,
      "host": "127.0.0.1"
    }
  }
const sendMails=(list)=>{
    amqplib.connect(config.amqp, (err, connection) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }
        connection.createChannel((err, channel) => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }
    
           
            channel.assertQueue(config.queue, {
              
                durable: true
            }, err => {
                if (err) {
                    console.error(err.stack);
                    return process.exit(1);
                }
                let sender = (content, next) => {
                    let sent = channel.sendToQueue(config.queue, Buffer.from(JSON.stringify(content)), {                
                        persistent: true,
                        contentType: 'application/json'
                    });
                    if (sent) {
                        return next();
                    } else {
                        channel.once('drain', () => next());
                    }
                };
    
                let sent = 0;
                let sendNext = () => {
                    if (sent >= 100) {
                        console.log('All messages sent!');
                        return channel.close(() => connection.close());
                    }
                    sent++;
                    for(let data of list){
                        sender({
                            to: data.email,
                            subject: 'NewsLetter Subscription #' + sent,
                            text: `Hello ${data.firstName} ${data.lastName}, Age: ${data.age} 
                            You are now eligible to subscribe to this newsLetter, 
                            Please check out this page for more details www.newslettersApi.com
                            `
                        }, sendNext);
                    }
                   
                };
    
                sendNext();
    
            });
        });
    });
}
module.exports={sendMails}