const { getClient } = require("../db/database");

const sqlQueries = async (statement, parameters) => {
  const client = await getClient();
  try {
    res = await client.query(statement, parameters);
    return res.rows;
  } catch (error) {
    console.log(error);
    client.release();
  }
};

/*/////////student/////////*/

const saveStudent = async (data) => {
  const { firstName, lastName, idNumber, email, password } = data;
  let statement =
    "INSERT INTO student (first_name , last_name , id_number, email , password) VALUES ($1 ,$2 ,$3 , $4, $5) RETURNING first_name , last_name , id_number, email , password;";
  let parameters = [firstName, lastName, idNumber, email, password];
  return await sqlQueries(statement, parameters);
};

const checkEmail = async (email) => {
  let statement = "SELECT * FROM student WHERE email =$1;";
  let parameters = [email];
  return await sqlQueries(statement, parameters);
};

const checkPassword = async (password) => {
  let statement = "SELECT * FROM student WHERE password =$1;";
  let parameters = [password];
  return await sqlQueries(statement, parameters);
};
const checkIdNumber = async (idNumber) => {
  let statement = "SELECT * FROM student WHERE id_number =$1;";
  let parameters = [idNumber];
  return await sqlQueries(statement, parameters);
};


/*/////////admin/////////*/
const saveAdmin = async (data) => {
  const { firstName, lastName, idNumber, email, password } = data;
  let statement =
    "INSERT INTO admin (first_name , last_name , id_number, email , password) VALUES ($1 ,$2 ,$3 , $4, $5) RETURNING first_name , last_name , id_number, email , password;";
  let parameters = [firstName, lastName, idNumber, email, password];
  return await sqlQueries(statement, parameters);
};

const adminCheckEmail = async (email) => {
  let statement = "SELECT * FROM student WHERE email =$1;";
  let parameters = [email];
  return await sqlQueries(statement, parameters);
};

const adminCheckPassword = async (password) => {
  let statement = "SELECT * FROM student WHERE password =$1;";
  let parameters = [password];
  return await sqlQueries(statement, parameters);
};
const adminCheckIdNumber = async (idNumber) => {
  let statement = "SELECT * FROM student WHERE id_number =$1;";
  let parameters = [idNumber];
  return await sqlQueries(statement, parameters);
};




/*/////////books/////////*/


const getAllBooks = async () => {
  let statement = "SELECT * FROM books;";
  return await sqlQueries(statement);
};

const addBooks = async (books) => {
  const { bookName , bookAuthor , bookDescription } = books;
  let statement =
    "INSERT INTO books (book_name , book_author , book_description) VALUES ($1 ,$2 ,$3) RETURNING book_name , book_author , book_description;";
  let parameters = [bookName , bookAuthor , bookDescription];
  return await sqlQueries(statement, parameters);
};

const checkBookExist = async (bookName) => {
  let statement = "SELECT * FROM books WHERE book_name =$1;";
  let parameters = [bookName];
  return await sqlQueries(statement, parameters);
};

/////////////////join tables///////////////////////
const selectBook =  async(studentId , bookId)=> {

 let statement = "INSERT INTO books_look_up (student_id ,  books_id) values($1 ,$2);"
 let parameters = [studentId , bookId]
 return await sqlQueries(statement, parameters);

};


///////////general join//////
// SELECT * FROM public.books_look_up join student on books_look_up.student_id=student.id join books on books_look_up.books_id=books.id 

//////////for one user//////////
// SELECT * FROM public.books_look_up join student on books_look_up.student_id=student.id join books on books_look_up.books_id=books.id where books_look_up.student_id=1


module.exports = {
  saveStudent,
  checkPassword,
  checkEmail,
  checkIdNumber,
  saveAdmin,
  adminCheckEmail,
  adminCheckPassword,
  adminCheckIdNumber,
  getAllBooks,
  addBooks,
  checkBookExist,
  selectBook
};
