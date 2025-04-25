const IODesktop = require("@interopio/desktop");
const IOConnectDesktop = require("@interopio/desktop");

const instruments = ["Audi", "Toyota", "Honda", "BMW"];

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const initializeIOConnect = async () => {
    // Optional configuration for initializing the library.
    const config = { appManager: "full" };

    // Use the object returned by the factory function to access the io.Connect APIs.
    const io = await IODesktop(config);

    // Here io.Connect is initialized and you can access all io.Connect APIs.
    
    return io;
};

initializeIOConnect()
.then((io) => {
    console.log(`io.Connect version: ${io.version}`);
    let carMakeFilter = "BMW";

    const streamDefinition = {
        name: "Demo.LastTradesStream",
        displayName: "Cars - Last car price changes",
        returns: "String carMake, Double lastPrice"
    };

    let options = {
        subscriptionAddedHandler: (subscription) => {
            console.log("NEW SUBSCRIPTION ADDED!");
            console.log(subscription);
            console.log(subscription.arguments);
            carMakeFilter = subscription.arguments.carMake;
        }
    }
    
    io
    .interop
    .createStream(streamDefinition, options)
    .then((stream) => {

        setInterval(() => {
            const lastCarPrice = {
                carMake: instruments[random(0, instruments.length - 1)],
                lastPrice: random(10, 1000)
            }

            if (lastCarPrice.carMake == carMakeFilter) {
                console.log("================================== PUBLISHING TO STREAM: ", lastCarPrice.carMake);
                stream.push(lastCarPrice);
                return;
            }
            console.log("SKIPPING PUBLISHING TO STREAM: ", lastCarPrice.carMake);

        }, 1000)
    });
})
.catch(console.error);