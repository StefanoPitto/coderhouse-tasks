export class userDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.address = user.address;
    this.age = user.age;
  }
}
