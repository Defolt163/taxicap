import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import accountDB from '../../accountDB'

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function POST(req) {
  try {
      const { inputName, inputEmail } = await req.json();

      // Проверка, существует ли пользователь
      const [rows] = await accountDB.query('SELECT * FROM accounts WHERE UserEmail = ?', [inputEmail]);

      if (rows.length > 0) {
          return new Response(
              JSON.stringify({ message: 'Пользователь уже существует' }),
              { status: 400 }
          );
      } else {
          // Сохранение пользователя в базе данных
          //const hashedPassword = await bcrypt.hash(inputPassword, 10)
          await accountDB.query(
              'INSERT INTO accounts (UserName, UserEmail) VALUES (?, ?)',
              [inputName, inputEmail]
          );

          // Получение сохраненного пользователя
          const [newRows] = await accountDB.query('SELECT * FROM accounts WHERE UserEmail = ?', [inputEmail]);
          const user = newRows[0];
          await accountDB.query(
            'INSERT INTO userphoto (User) VALUES (?)',
            [user.UserId]
          )

          // Генерация токена
          const token = jwt.sign(
              {
                  id: user.UserId,
                  name: user.UserName,
                  email: user.UserEmail,
              },
              SECRET_KEY,
              { expiresIn: '7d' }
          );

          console.log('Сгенерирован токен:', token);

          return new Response(
              JSON.stringify({ message: 'Готово', token }),
              { status: 201 }
          );
      }
  } catch (err) {
      console.error('Ошибка регистрации:', err);
      return new Response(
          JSON.stringify({ message: 'Ошибка' }),
          { status: 500 }
      );
  }
}

/* export async function POST(request: NextRequest) {
  try {
    const { sessionId, inputName, inputEmail, inputPassword } = await request.json();

    const result: any = await new Promise((resolve, reject) => {
        accountDB.query(
        "INSERT INTO accounts (UserSessionId, UserName, UserEmail, UserPassword) VALUES (?, ?, ?, ?)",
        [sessionId, inputName, inputEmail, inputPassword],
        (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (result && result.affectedRows === 1) {
      return NextResponse.json({ message: "User created successfully" });
    } else {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} */