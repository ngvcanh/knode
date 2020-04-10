const UserModel = require('../../../../models/user');

const Email = require('../../../../modules/email');
const Controller = require('../../../../modules/controller');
const validate = require('../../../../modules/validate');

class UserController extends Controller{

  constructor(){
    super(UserModel);
  }

  register = async (req, res) => {
    let {
      username,
      password,
      confirm_password,
      email,
      phone
    } = req.body;

    if (!validate.validateMinLength(username, 1)){
      this.responseJson(res, 406, langs.get('error_username_length'));
      return;
    }

    if (
      !validate.validateEmail(email) ||
      !validate.validatePhone(phone) ||
      !validate.validatePassword(password)
    ){
      this.responseJson(res, 406, validate.getMessage());
      return;
    }

    if (password.localeCompare(confirm_password)){
      this.responseJson(res, 406, langs.get('error_password_confirm'));
      return;
    }

    username = username.trim();
    let user = await this.model.findUsername(username);

    if (user){
      this.responseJson(res, 406, langs.get('error_username_used'));
      return;
    }

    email = email.trim();
    user = await this.model.findEmail(email);

    if (user){
      this.responseJson(res, 406, langs.get('error_email_used'));
      return;
    }

    phone = phone.trim();
    user = await this.model.findPhone(phone);

    if (user){
      this.responseJson(res, 406, langs.get('error_phone_used'));
      return;
    }

    password = this.model.hashPassword(password);
    let data = { username, phone, email, password, active : !this.model.enabledVerify() };
    user = await this.model.create(data);

    let dataRes = { verifyEmail: this.model.enabledVerify() };
    let token = this.token.generate({ username });
    
    if (this.model.enabledVerify()){
      new Email('register').send(email, { username, token });
    }
    else{
      dataRes.user = { token, info: { ...this.model.asJson(user), password : undefined } };
    }

    this.model.close();
    this.responseJson(res, 200, langs.get('success_register'), dataRes);
  }

  login = async (req, res) => {
    let { username, password } = req.body;

    if (!validate.validateMinLength(username, 1)){
      this.responseJson(res, 406, langs.get('error_username_length'));
      return;
    }

    if (!validate.validatePassword(password)){
      this.responseJson(res, 406, validate.getMessage());
      return;
    }

    let user = await this.model.findUsername(username);
    if (!user || !this.model.comparePassword(password, user.password)){
      this.responseJson(res, 406, langs.get('error_login_incorrect'));
      return;
    }

    if (!user.active){
      this.responseJson(res, 403, langs.get('error_account_not_active'));
      return;
    }

    let token = this.token.generate({ username: user.username});
    let data = { token, info: { ...this.model.asJson(user), password: undefined } };

    this.model.close();
    this.responseJson(res, 200, langs.get('success_login'), { user: data });
  }

  verifyToken = async (req, res) => {
    let { access_token } = req.body;

    if (!validate.validateMinLength(access_token, 1)){
      this.responseJson(res, 403, langs.get('error_access_token_invalid'));
      return;
    }

    let decoded = this.token.verify(access_token);

    if (!decoded) {
      this.responseJson(res, 403, langs.get('error_access_token_not_exists'));
      return;
    }

    let user = await this.model.findUsername(decoded.username);

    if (!user || user.active) {
      this.responseJson(res, 403, langs.get('error_access_token_not_exists'));
      return;
    }

    user.active = true;
    await user.save();

    this.token.deny(access_token);
    let data = { info : { ...this.model.asJson(user), password : undefined } };

    this.model.close();
    this.responseJson(res, 200, langs.get('success_verify_token'), { user: data });
  }

  forgotPassword = async (req, res) => {
    let { username, email } = req.body;

    if (!validate.validateMinLength(username, 1)){
      this.responseJson(res, 406, langs.get('error_username_length'));
      return;
    }

    if (!validate.validateEmail(email)){
      this.responseJson(res, 406, validate.getMessage());
      return;
    }

    username = username.trim();
    let user = await this.model.findUsername(username);

    if (!user){
      this.responseJson(res, 406, langs.get('error_username_not_exists'));
      return;
    }

    email = email.trim();
    user = await this.model.findEmail(email);

    if (user.email !== email){
      this.responseJson(res, 406, langs.get('error_email_wrong'));
      return;
    }

    let token = this.token.generate({ username });
    new Email('forgot-password').send(email, { username, token });

    this.model.close();
    this.responseJson(res, 200, langs.get('success_forgot_password'));
  }

  resetPassword = async (req, res) => {
    let { password, confirm_password, access_token } = req.body;

    if (!validate.validatePassword(password)){
      this.responseJson(res, 406, validate.getMessage());
      return;
    }

    if (password.localeCompare(confirm_password)){
      this.responseJson(res, 406, langs.get('error_password_confirm'));
      return;
    }

    let user = this.token.verify(access_token);

    if (!user) {
      this.responseJson(res, 403, langs.get('error_access_token_not_exists'));
      return;
    }

    user = await this.model.findUsername(user.username);
    user.password = this.model.hashPassword(password);
    await user.save();

    this.token.deny(access_token);
    this.model.close();

    this.responseJson(res, 200, langs.get('success_reset_password'));
  }

  update = async (req, res) => {
    if (!req.user){
      this.responseJson(res, 403, langs.get('error_access_token_invalid'));
      return ;
    }

    let user = req.user;
    let { password, firstname, lastname, new_password, confirm_new_password } = req.body;

    if (!validate.validatePassword(password)){
      this.responseJson(res, 406, validate.getMessage());
      return;
    }

    firstname = firstname.trim();
    if (!validate.validateMinLength(firstname, 1)){
      this.responseJson(res, 406, langs.get('error_firstname_length'));
      return;
    }

    lastname = lastname.trim();
    if (!validate.validateMinLength(lastname, 1)){
      this.responseJson(res, 406, langs.get('error_lastname_length'));
      return;
    }

    if (new_password){
      if (!validate.validatePassword(new_password)){
        this.responseJson(res, 406, validate.getMessage());
        return;
      }
  
      if (new_password.localeCompare(confirm_new_password)){
        this.responseJson(res, 406, langs.get('error_password_confirm'));
        return;
      }
    }

    if (!this.model.comparePassword(password, user.password)){
      this.responseJson(res, 406, langs.get('error_password_incorrect'));
      return;
    }

    user.firstname = firstname;
    user.lastname = lastname;
    new_password && (user.password = this.model.hashPassword(new_password));

    await user.save();
    this.model.close();
    
    let data = { user: { info: { ...this.model.asJson(user), password: undefined } } };
    this.responseJson(res, 200, langs.get('success_update_user'), data);
  }
}

module.exports = new UserController;