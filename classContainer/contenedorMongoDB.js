const mongoose = require('mongoose');
const modelMsgs = require('../models/modelMsgs.js');
const ModelProducts = require('../models/modelProducts.js');

class contenedorMsgsMongoDB {
  constructor({ name, schema }) {
    this.model = mongoose.model(name, schema);
  }

  async getAll() {
    try {
      const allMsgs = await this.model.find({});
      return allMsgs;
    } catch (err) {
      console.log(err, 'no se pueden mostrar todos los mensajes');
    }
  }

  async save(title, price, thumbnail) {
    try {
      const newProduct = new ModelProducts({
        title: title,
        price: price,
        thumbnail: thumbnail,
      });
      await newProduct.save();
    } catch (error) {
      console.log(error, 'se ha producido un error');
      return 'se ha producido un error';
    }
  }

  async saveMsg(id, nombre, apellido, edad, alias, avatar, text) {
    try {
      const newMsg = new modelMsgs({
        author: {
          id: id,
          nombre: nombre,
          apellido: apellido,
          edad: edad,
          alias: alias,
          avatar: avatar,
        },
        text: text,
      });
      await newMsg.save();
    } catch (error) {
      console.log(error, 'se ha producido un error');
      return 'se ha producido un error';
    }
  }
}

module.exports = contenedorMsgsMongoDB;
