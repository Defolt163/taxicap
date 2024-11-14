import EatHeader from '../components/EatHeader/EatHeader'
export default function LoginLayout({ children }) {
    return (
          <html lang="ru">
            <body>
            <EatHeader/>
                <div className="container">
                    {children}
                </div>
            </body>
          </html>
    );
}