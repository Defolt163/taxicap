import { NextResponse } from 'next/server';
import accountDB from '../../accountDB';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Параметр id не указан' }, { status: 400 });
    }

    const results = await new Promise((resolve, reject) => {
      accountDB.query(
        'DELETE FROM orders WHERE id = ?',
        [id],
        (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    /* if (results.affectedRows === 0) {
      return NextResponse.json({ message: 'Запись не найдена' }, { status: 404 });
    } */

    return NextResponse.json({ message: 'Запись успешно удалена' });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
