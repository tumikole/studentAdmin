const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ dpath: path.resolve(__dirname, "../env") });
const mySecretKey = process.env.SECRET_KEY;

const {
  saveStudent,
  checkEmail,
  checkIdNumber,
  saveAdmin,
  adminCheckEmail,
  adminCheckIdNumber,
} = require("../queries/Queries");
const { secretePassword } = require("../security/SecretPassword");

const authenticationRoutes = (app) => {
  app.post(
    "/student_register",
    [
      check("email").isEmail(),
      check("password").isLength({
        min: 6,
      }),
    ],
    async (req, res) => {
      const {
        firstName,
        lastName,
        idNumber,
        email,
        password,
        confirmPassword,
      } = req.body;

      const errors = validationResult(req);
      const checkedEmail = await checkEmail(email);
      const checkedId = await checkIdNumber(idNumber);
      const hashedPassword = await secretePassword(password);
      try {
        const students = {
          firstName,
          lastName,
          idNumber,
          email,
          password: hashedPassword,
        };

        if (!errors.isEmpty()) {
          const errorMessage = { msg: "" };
          return res.send(errorMessage.msg);
        } else if (checkedId.length > 0) {
          return res.send({ message: "Id number already exist" });
        } else if (checkedEmail.length > 0) {
          return res.send({ message: "Email already exist" });
        } else if (confirmPassword !== password) {
          return res.send({ message: "Password should match" });
        }
        
        const data = await saveStudent(students);
        const token = jwt.sign({ payload: email }, mySecretKey, {
          expiresIn: "2h",
        });
        return res.send({ data: data, token });
      } catch (error) {
        res.sendStatus(500);
      }
    }
  );

  app.post(
    "/admin_register",
    [
      check("email").isEmail(),
      check("password").isLength({
        min: 6,
        min: 15,
      }),
    ],
    async (req, res) => {
      const {
        firstName,
        lastName,
        idNumber,
        email,
        password,
        confirmPassword,
      } = req.body;

      const errors = validationResult(req);
      const checkEmail = await adminCheckEmail(email);
      const checkIdNumber = await adminCheckIdNumber(idNumber);
      const hashedPassword = await secretePassword(password);
      try {
        const admin = {
          firstName,
          lastName,
          idNumber,
          email,
          password: hashedPassword,
        };

        if (!errors.isEmpty()) {
          const errorMessage = { msg: "" };
          return res.send(errorMessage.msg);
        } else if (checkIdNumber.length > 0) {
          return res.send({ message: "Id number already exist" });
        } else if (checkEmail.length > 0) {
          return res.send({ message: "Email already exist" });
        } else if (confirmPassword !== password) {
          return res.send({ message: "Password should match" });
        }
        const data = await saveAdmin(admin);
        const token = jwt.sign({ payload: email }, mySecretKey, {
          expiresIn: "2h",
        });
        return res.send({ data: data, token });
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    }
  );
};

module.exports = { authenticationRoutes };
