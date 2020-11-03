const bcrypt = require("bcrypt");
const db = require("../models");
const token = require("../middleware/token");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {
    try {
      const user = await db.User.findOne({
        where: { email: req.body.email },
      });
      if (user !== null) {
        if (user.username === req.body.username) {
          return res.status(400).json({ error: "ce pseudo est déjà utilisé" });
        }
      } else {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = await db.User.create({
          email: req.body.email,
          username: req.body.username,
          password: hash,
          bio: req.body.bio,
          isAdmin: false,
        });
  
        const tokenObject = await token.issueJWT(newUser);
        res.status(201).send({
          user: newUser,
          token: tokenObject.token,
          expires: tokenObject.expiresIn,
          message: `Votre compte est bien créé ${newUser.username} !`,
        });
      }
    } catch (error) {
      console.log(error)
      return res.status(400).send({ error: "email déjà utilisé" });
    }
  };


exports.login = async (req, res) => {
    try {
      const user = await db.User.findOne({
        where: { email: req.body.email },
      }); 
      if (user === null) {
        return res.status(403).send({ error: "Connexion échouée" });
      } else {
        const hash = await bcrypt.compare(req.body.password, user.password); 
        if (!hash) {
          return res.status(401).send({ error: "Mot de passe incorrect !" });
        } else {
          const tokenObject = await token.issueJWT(user);
          res.status(200).send({
            user: user,
            token: tokenObject.token,
            sub: tokenObject.sub,
            expires: tokenObject.expiresIn,
            message: "Bonjour " + user.username + " !",
          });
        }
      }
    } catch (error) {
      return res.status(500).send({ error: "Erreur serveur" });
    }
  };

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await db.User.findAll({
        attributes: ["username", "id", "bio", "email"],
        where: {
          id: {
            [Op.ne]: 1,
          },
        },
      });
      res.status(200).send(users);
    } catch (error) {
      return res.status(500).send({ error: "Erreur serveur" });
    }
  };

  exports.getAccount = async (req, res) => {
    try {
      const user = await db.User.findOne({
        where: { id: req.params.id },
      });
      res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ error: "Erreur serveur" });
    }
  };

  exports.deleteUser = async (req, res, next) => {
      const id = req.params.id;
      const user = await db.User.findOne({ where: { id: id } });

      db.User.destroy({ where: { id: id } });
      res.status(200).json({ messageRetour: "utilisateur supprimé" });
};