import { UserModel } from "./models/user.model.js";

export class UsersManager {
  constructor() {
    this.collection = UserModel;
  }

  createUser = async (user) => {
    console.log("USUARIO", user);
    const userFromDb = await this.collection.findOne({ email: user.email });
    if (userFromDb) throw new Error("Error! User already exists. ");
    const newUser = new UserModel({ ...user });
    try {
      await newUser.save();
      console.log(newUser);
      return newUser;
    } catch (err) {
      throw new Error("Error when trying to create a new user.");
    }
  };

  login = async (user) => {
    const userFromDb = await this.collection.findOne({ email: user.email });
    if (!userFromDb) throw new Error("Wrong username/password");

    if (userFromDb.password === user.password) return userFromDb;
    else throw new Error("Wrong username/password");
  };

  logout = async (user) => {};

  getUserById = async (id) => {
    const user = await this.collection.findById(id);
    if (!user) throw new Error("Error! user doesn't exist.");
    else
      return {
        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        role: user.role,
        address: user.address,
      };
  };
}

export const userManager = new UsersManager();
