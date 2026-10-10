const data = require("../constant/learning");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require("bcrypt");

const filePath = path.join(__dirname, "..", "constant", "constant.js");
const firstNames = [
  "Amina",
  "Zayn",
  "Elena",
  "Liam",
  "Omar",
  "Sophia",
  "Kaelen",
  "Zara",
  "Mateo",
  "Chloe",
];

const lastNames = [
  "Khan",
  "Smith",
  "Rodriguez",
  "Chen",
  "Ahmed",
  "Dubois",
  "Murakami",
  "Okonkwo",
  "Silva",
  "Taylor",
];
const randomGenders = ["Male", "Femala"];

module.exports = {
  selfLearning: async (req, res) => {
    const { email, password } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;


    //check validation
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and Password both are required",
        code: "400",
      });
    }

    const pickRandoms = (array) =>
      array[Math.floor(Math.random() * array.length)];

    //to always return the new file instead of cached file
    const loadData = () => {
      delete require.cache[require.resolve(filePath)];
      return require(filePath);
    };

    let currentData = loadData();

    let totalPages = Math.ceil(currentData.length / limit);
    let start = (page - 1) * limit;
    let end = start + limit;
    var paginatedData;

    
    if (page > totalPages) {
     return res.status(200).send({
        data: [],
        page,
        limit,
        pages: totalPages,
        message: "Your Page number is exceding, from the total pages",
      });
    }

    const paginatedObj = {
      page,
      limit,
      totalPages,
    };

    const existed = currentData.find((p) => p.email == email);
    const hashedPassword = await bcrypt.hash(password, 10);

    //if an employee existed but password field is not existed
    if (existed && !Object.keys(existed).includes("password")) {
      const passwordRecord = currentData.map((person) =>
        person.email == email
          ? {
              ...person,
              password: hashedPassword,
            }
          : person,
      );
      const fileContent = `const data = ${JSON.stringify(passwordRecord, null, 2)}; \n\n module.exports= data`;
      paginatedData = passwordRecord.slice(start, end);
      await fs.writeFile(filePath, fileContent, "utf8");
      return res.status(200).json({
        message: `Employee is already Existed, We have only Added the Password`,
        data: paginatedData,
        code: "200",
        paginatedObj,
      });
    }

    //if  an employee is existed with the password field
    if (existed && Object.keys(existed).includes("password")) {
      return res.status(409).send({
        message: `A employee is already Present with this ${email} along with the password field`,
        data:paginatedData,
        code: "409",
        paginatedObj,
      });
    }

    const newData = {
      id: currentData.length + 1,
      first_name: pickRandoms(firstNames),
      last_name: pickRandoms(lastNames),
      email: email,
      gender: pickRandoms(randomGenders),
      password: hashedPassword,
    };

    currentData.push(newData);

    const fileContent = `const data = ${JSON.stringify(currentData, null, 2)};\n\nmodule.exports = data;`;
    paginatedData = currentData.slice(start, end);

    try {
      // 5. Await the file write directly in the controller action
      await fs.writeFile(filePath, fileContent, "utf8");

      // 6. Don't forget to send a response back to the client!
      return res.status(201).json({
        message: "A new Employee has been Added Successfully",
        data: paginatedData,
        code: "201",
        paginatedObj,
      });
    } catch (e) {
      console.log("An Error Occurred, while writing to the file", e);
      return res.status(500).send({
        message: "Failed to write Data",
        code: "500",
      });
    }
  },
};
