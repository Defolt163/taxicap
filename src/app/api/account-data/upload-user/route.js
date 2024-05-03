import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import sharp from "sharp"; // добавляем sharp

// Define the POST handler for the file upload
export const POST = async (req, res) => {
  // Parse the incoming form data
  const formData = await req.formData();
  console.log(formData)

  // Get the file from the form data
  const file = formData.get("file");
  const userId = formData.get("userData")

  // Check if a file is received
  if (!file) {
    // If no file is received, return a JSON response with an error and a 400 status code
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Replace spaces in the file name with underscores
  const filename = file.name.replaceAll(" ", "_");

  try {
    // Сжимаем изображение с использованием sharp
    const compressedBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 800 }) // Указываем желаемую ширину изображения
      .toBuffer();

    // Write the compressed file to the specified directory (public/users) with the modified filename
    await writeFile(
      path.join(process.cwd(), "public/users/" + filename),
      compressedBuffer
    );
    fetch(`http://localhost:3000/api/account-data/upload-user/put-user-photo?UserId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "UserImage": "/users/" + filename
      })
    })

    // Return a JSON response with a success message and a 201 status code
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    // If an error occurs during file writing or image compression, log the error and return a JSON response with a failure message and a 500 status code
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
