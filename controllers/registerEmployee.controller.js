const data = require('../constant/constant');
const bcrypt = require('bcrypt');

const SALT_ROUND = 10;
module.exports = {
    handleEmployeeRegisteration: async (req , res) =>{
        try {
            //if password or username are not present
            const {userName, password}  = req.body;
            if(!userName || !password){
                return res.status(400).send({
                    code: '400',
                    message: "UserName and Password are Required!"
                })
            }

            //check for duplicates
            const duplicate =  data.find((person) => person.first_name === userName);
            if(duplicate){
                return res.status(409).send({
                    code: '409',
                    message: "User is already exist with this Name!"
                })
            }

            const hashedPassword =  await bcrypt.hash(password , SALT_ROUND )
            return res.status(201).send({
                code: '201',
                userName,
                hashedPassword,
                message: "User Register Successfully!"
            })

        } catch (error) {
            return res.status(500).send({
                code: '500',
                message: error.message
            })
        }
    }
}