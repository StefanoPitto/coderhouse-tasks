import { UserModel } from "./models/user.model.js";
import { hash, compare } from "bcrypt";
import { userDTO } from "../dto/user.dto.js";
import CryptoJS from "crypto-js";
import nodemailer from "nodemailer"
export class UsersManager {
  constructor() {
    this.collection = UserModel;
    this.saltRounds = 10;
  }

  createUser = async (user) => {
    const userFromDb = await this.collection.findOne({ email: user.email });
    if (userFromDb) throw new Error("Error! User already exists. ");
    let hashedPassword;
    try {
      hashedPassword = await hash(user.password, this.saltRounds);
    } catch (error) {
      console.log(error);
      throw new Error("Error when hashing the password.");
    }
    const newUser = new UserModel({ ...user, password: hashedPassword });
    try {
      await newUser.save();
      console.log(newUser);
      return new userDTO(newUser);
    } catch (err) {
      throw new Error("Error when trying to create a new user.");
    }
  };

  login = async (user) => {
    const userFromDb = await this.collection.findOne({ email: user.email });
    if (!userFromDb) throw new Error("Wrong username/password");

    const isPasswordValid = await compare(user.password, userFromDb.password);
    if (!isPasswordValid) throw new Error("Wrong username/password");

    return new userDTO(userFromDb);
  };

  getUserById = async (id) => {
    const user = await this.collection.findById(id);
    if (!user) throw new Error("Error! user doesn't exist.");
    else return new userDTO(user);
  };

  

  recoverPassword = async (email) => {
    const userFromDB = await UserModel.findOne({ email });
  
    if (userFromDB) {
      // Generate a random token
      const token = CryptoJS.lib.WordArray.random(20).toString();
  
      // Set the token and its expiration in the user's account
      userFromDB.passwordResetToken = token;
      userFromDB.passwordResetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
  
      await userFromDB.save();
  
      // create a transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_ACCOUNT,
          pass: process.env.GMAIL_PASSWORD,
        }
      });
  
      // Create the password reset URL
      const resetURL = `http://localhost:8080/token?token=${token}`;
  
      // Create the HTML content of the email with inline CSS styles
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #007bff;">Password Recovery</h2>
          <p>Here's your password recovery token: ${token}</p>
          <a href="${resetURL}" style="text-decoration: none;">
            <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Reset Password
            </button>
          </a>
        </div>
      `;
  
      // send the email
      transporter.sendMail({
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: 'Password Recovery',
        html: emailHTML
      }, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } else {
      throw new Error('User does not exist.');
    }
  };
  
  handlePasswordResetRequest = async (token) => {
    try {
      const userFromDB = await UserModel.findOne({
        passwordResetToken: token,
        passwordResetTokenExpiration: { $gt: Date.now() } // Ensure token is not expired
      });
  
      if (userFromDB) {
        // Token is valid, redirect to password change page
        return true;
      } else {
        // Invalid token or expired
        throw new Error('Invalid or expired token.');
      }
    } catch (error) {
      throw new Error('Server error.');
    }
  };

  updateUserPasswordFromToken = async (password,token) => {

    let hashedPassword;
    try {
      hashedPassword = await hash(password, this.saltRounds);
    } catch (error) {
      console.log(error);
      throw new Error("Error when hashing the password.");
    }

    try {
      const userFromDB = await UserModel.findOne({ passwordResetToken: token });
  
      if (userFromDB && userFromDB.passwordResetTokenExpiration > Date.now()) {
        // Token is valid, update the password
        console.log('hashedPass',hashedPassword)
        userFromDB.password = hashedPassword;
        userFromDB.passwordResetToken = null;
        userFromDB.passwordResetTokenExpiration = null;
        await userFromDB.save();     
        return userFromDB;
      } else {
        // Invalid token or expired
        throw new Error( 'Invalid or expired token.' );
      }
    } catch (error) {
      throw new Error('Server Error');
    }




  }


  updatePremiumUser = async (id) => {
    const userFromDB = await UserModel.findOne({ _id:id});
    if(!userFromDB) throw new Error('User does not exist');
    userFromDB.role= userFromDB.role === 'premium' ? 'user': 'premium';
    await userFromDB.save();
  
  }



}

export const userManager = new UsersManager();
