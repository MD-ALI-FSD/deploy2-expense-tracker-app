const forgotpassModel = require("../models/forgot-pass");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");
const dotenv = require("dotenv");
dotenv.config();

const userModel = require("../models/user");
const forgotPassModel = require("../models/forgot-pass");

const sequelize = require("../utils/database");
const { CLIENT_RENEG_LIMIT } = require("tls");

/*************************************************************/
//  Render Forgot Password Page
/*************************************************************/
exports.getForgotPasswordPage = (request, response, next) => {
  response.sendFile("forgot.html", { root: "client/public/views" });
};

/***********************************************************/
// Sending Email for Forgot Password
/***********************************************************/
exports.postForgotPasswordEmail = async (req, res) => {
  try {
    const receiverEmail = req.body.email;

    //verifying email
    const user = await userModel.findOne({
      where: { email: req.body.email },
    });

    // If email not found
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "email does not Exists!" });
    }

    const uniqeId = uuidv4();

    //update table
    const FPR = await forgotPassModel.create({
      id: uniqeId,
      isActive: true,
      userId: user.id,
    });

    // setting up sendinblue
    // Initialize the default client
    const defaultClient = await Sib.ApiClient.instance;
    var apiKey = await defaultClient.authentications["api-key"];

    // Create a new instance of the TransactionalEmailsApi
    const transEmailApi = await new Sib.TransactionalEmailsApi();
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const path = `${process.env.WEBSITE}/password/verifyLink/${uniqeId}`;

    const sender = {
      email: "alidj007@gmail.com",
      name: "Ali",
    };

    const receivers = [
      {
        email: receiverEmail,
      },
    ];

    const sendEmail = await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot Password",
      htmlContent: `<a href="${path}">Click Here</a> to reset your password!`,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending email" });
  }
};

/*********************************************************/
//Verify Link & send HTML file to update password
/*********************************************************/
exports.postVerifyLink = async (req, res, next) => {
  try {
    res.sendFile("update-password.html", { root: "client/public/views" });
  } catch (error) {}
};

/*********************************************************/
//create New Password
/*********************************************************/
exports.PostCreateNewPassword = async (req, res, next) => {
  const { pass, confirmPass, linkId } = req.body;
  const idd = linkId;

  //fetching data from forgotPassword Table
  const t = await sequelize.transaction();
  try {
    //matching both passwords
    if (pass !== confirmPass) {
      return res
        .status(400)
        .json({ success: false, message: "MisMatched Passwords!" });
    }

    const FPM = await forgotpassModel.findOne(
      { where: { id: idd } },
      { transaction: t }
    );

    //if link is not active
    if (!FPM.isActive) {
      await t.commit();
      return res.status(400).json({
        success: false,
        message: "Link Expired! Go back and generate a New Link",
      });
    }

    //else encrypting the password
    const hashedPassword = bcrypt.hashSync(pass, 10);

    //making link inactive
    const updatedFPM = forgotpassModel.update(
      { isActive: false },
      { where: { id: idd } },
      { transaction: t }
    );

    //updating password
    const updatedUser = userModel.update(
      { password: hashedPassword },
      { where: { id: FPM.userId } },
      { transaction: t }
    );

    await Promise.all([updatedFPM, updatedUser]);
    await t.commit();
    res
      .status(200)
      .json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    t.rollback();
  }
};
