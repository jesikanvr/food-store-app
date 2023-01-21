export default class User {
  constructor(id, name, last_name, username, email, password, phone, roles) {
    this.id = id;
    this.name = name;
    this.last_name = last_name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.roles = roles;
  }

  get idUser() {
    return this.id;
  }

  get nameUser() {
    return this.name;
  }
  get last_nameUser() {
    return this.last_name;
  }
  get userName() {
    this.username = this.createUserName();
    return this.username;
  }
  get emailAddress() {
    return this.email;
  }
  get userPassword() {
    return this.email;
  }
  get phoneUser() {
    return this.phone;
  }
  get rolesUser() {
    return this.roles;
  }

  set idUser(idUser) {
    this.id = idUser;
  }
  set nameUser(nameUser) {
    this.name = nameUser;
  }
  set last_nameUser(last_nameUser) {
    this.last_name = last_nameUser;
  }
  set userName(userName) {
    this.username = userName;
  }
  set emailAddress(emailAddress) {
    this.email = emailAddress;
  }
  set userPassword(userPassword) {
    this.password = userPassword;
  }
  set phoneUser(phoneUser) {
    this.phone = phoneUser;
  }
  set rolesUser(roles) {
    this.roles = roles;
  }

  createUserName() {
    return this.email.substring(0, this.email.indexOf("@"));
  }
}
