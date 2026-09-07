const fs = require("fs");
const path = require("path");
// usage: logMessage("Server started")
// output in logger.log: [2026-09-06 10:30:00] Server started
function loggger(message){


    
    const date = new Date().toISOString().split("T");
    fs.appendFile(
        "./logger.txt",
        `[ ${date[0]} ${date[1].slice(0, 8)}] ${message} \n`,
        (error) => {
            if (error) throw error;
        },
    );
}

// loggger('Hi, How are you ...')

