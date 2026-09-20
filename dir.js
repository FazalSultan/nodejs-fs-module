const fs = require('fs');

if(!fs.existsSync('./assets')){

    fs.mkdir('./assets' , (error) => {
        if(error) throw error
        
        console.log('Dir is created Successfully .....')
    })
}
else {
    console.log('Directory is already Present ...')
}