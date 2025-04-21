import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pool from '../../accountDB'
import sharp from "sharp"; // добавляем sharp
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export const config = {
  api: {
    bodyParser: false, // Отключаем bodyParser для работы с большими файлами
  },
};
// Define the POST handler for the file upload
export const POST = async (req, res) => {

  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    console.log('Токен не предоставлен');
    return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.error('Ошибка декодирования токена:', err);
    return new Response(JSON.stringify({ message: 'Неверный токен' }), { status: 401 });
  }
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return new Response(JSON.stringify({ error: 'Файлы не были отправлены' }), { status: 400 });
  }
  // Replace spaces in the file name with underscores
  // const filename = file.name.replaceAll(" ", "_");
  const randomFolderName = crypto.randomBytes(16).toString('hex');
  const filePath = path.join(process.cwd(), 'public/users', randomFolderName);
    // Проверяем и создаем папку
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  // Сжимаем изображение с использованием sharp
  const compressedBuffer = await sharp(buffer)
  .rotate()
  .resize({ width: 800 }) // Указываем желаемую ширину изображения
  .toBuffer();
  // Записываем файл
  const fileExtension = path.extname(file.name); // Расширение файла
  const cleanedFileName = file.name.replaceAll(" ", "_").replace(fileExtension, ''); // убираем пробелы и дубликат расширения
  const fileName = `${cleanedFileName}${fileExtension}`; // собираем финальное имя файла

  const fullFilePath = path.join(filePath, fileName); // путь до ФАЙЛА, не папки!

  await fs.promises.writeFile(fullFilePath, compressedBuffer);

  // Извлечение относительного пути начиная с 'products/'
  const relativePath = path.relative(path.join(process.cwd(), 'public'), fullFilePath);

  console.log('Uploaded file paths:', relativePath);

  // Пример вставки в базу данных
  // UPDATE `userphoto` SET `UserPhoto` = 'users\\88644625c6aa0797ea7b767eb6bc3e8e\\eaHe0t5q590IXu9MA09mC2t.jpg' WHERE `userphoto`.`PhotoId` = 9;
  //await pool.query('INSERT INTO userphoto (`Approved`, `User`, `UserPhoto`) VALUES (?, ?, ?)', [3, decoded.id, relativePath]);
  await pool.query('UPDATE userphoto SET Approved = ?, UserPhoto = ? WHERE User = ?', [3, relativePath, decoded.id]);
  return new Response({ status: 200 });
};
