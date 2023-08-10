"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const fs = require('fs');

app.get('/src/storage/:fileName', (req, res) => {
    const imagePath = `src/storage/${req.params.fileName}`; // Đường dẫn tới ảnh của bạn
    console.log(req.params.fileName)
    fs.readFile(imagePath, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.send(data);
        }
      });
  });
