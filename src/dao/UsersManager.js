import { UserModel } from "./models/user.model.js";
import { hash, compare } from "bcrypt";
import { userDTO } from "../dto/user.dto.js";
export class UsersManager {
  constructor() {
    this.collection = UserModel;
    this.saltRounds = 10;
  }

  createUser = async (user) => {
    console.log("USUARIO", user);
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
}

export const userManager = new UsersManager();
