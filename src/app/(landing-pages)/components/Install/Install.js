import './style.sass'

export default function Install() {
    return (
        <section id="install" className="landing_install">
            <div className="landing_install_wrapper">
                <div className="landing_install_header">
                    <p className="landing_install_label">
                        Установка
                    </p>
                    <h2 className="landing_install_title">
                        Добавьте приложение на рабочий экран
                    </h2>
                </div>

                <div className="landing_install_options">
                    <div className="landing_install_card">
                        <h3>Android</h3>
                        <ol>
                            <li>Откройте сайт в браузере Chrome или Edge.</li>
                            <li>Нажмите на меню вверху справа.</li>
                            <li>Выберите пункт «Установить приложение» или «Добавить на главный экран».</li>
                            <li>Подтвердите установку и дождитесь появления ярлыка.</li>
                        </ol>
                    </div>

                    <div className="landing_install_card">
                        <h3>iPhone и iPad</h3>
                        <ol>
                            <li>Откройте сайт в Safari.</li>
                            <li>Нажмите кнопку «Поделиться» в нижней панели.</li>
                            <li>Выберите пункт «На экран «Домой»» или «Add to Home Screen».</li>
                            <li>Нажмите «Добавить» и приложение появится на рабочем столе.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}
