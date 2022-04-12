const { secretPasswordCompare } = require("../security/SecretPassword");
const { checkEmail , selectBook} = require("../queries/Queries");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

  
const { getAllBooks, addBooks , checkBookExist , joinTables} = require("../queries/Queries");
const path = require("path");

require("dotenv").config({ dpath: path.resolve(__dirname, "../env") });
const mySecretKey = process.env.SECRET_KEY;

const allRoutes = (app) => {
  app.post("/student_login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const studentEmailCheck = await checkEmail(email);
      if (studentEmailCheck.length == 0) {
        res.send({ message: "Email address does not exist" }).status(401);
      } else if (studentEmailCheck[0].password) {
        const hashedPassword = studentEmailCheck[0].password;
        const compare = await secretPasswordCompare(password, hashedPassword);
        compare;
      }
      console.log("mySecretKey", mySecretKey);
      const token = jwt.sign({ payload: email }, mySecretKey, {
        expiresIn: "2h",
      });
      console.log("token", token);
      return res.send({ message: "Login successfully", token });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/get_allBooks", async (req, res) => {
    try {
      const allBooks = await getAllBooks();
      res.send(allBooks).status(201);
    } catch (error) {}
  });

  app.post("/add_books",[
    
    check("bookName").isLength({
      min: 1,
    }),
  ], async (req, res) => {
    const { bookName, bookAuthor, bookDescription } = req.body;
    const errors =  validationResult(req);
    const checkBook = await checkBookExist(bookName)
    console.log('checkBook :>> ', checkBook);
    const addingBook = {
      bookName,
      bookAuthor,
      bookDescription,
    };
    if (!errors.isEmpty()) {
      const errorMessage = { msg: "Fields should not be empty..." };
      return res.send(errorMessage.msg);
     }else if (checkBook.length > 0){
      return res.send({message:"Book already exist"})
     }
    const data = await addBooks(addingBook);
    res.send({ data: data, message: "Book added successfully" }).status(200);
  });

  app.post('/select_book' , async (req, res) => {
    const {studentId , bookId} = req.body
    try {
      const data = await selectBook(studentId , bookId)
      res.send({ data:data, message:'Book selected'}).status(200)
      console.log('data', data)
    } catch (error) {

      console.log(error);
      res.sendStatus(500)
    }

  })
};

module.exports = { allRoutes };
