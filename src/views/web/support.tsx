import { FormEvent, useEffect, useState } from "react";

import "./public-pages.css";

const supportEmail = "support@divergentclub.ru";

function buildMailtoLink(subject: string, body: string) {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${supportEmail}?${params.toString()}`;
}

export default function SupportView() {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!formOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [formOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `Support request from ${name || "Divergent user"}`;
    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      "",
      "Message:",
      message || "-",
    ].join("\n");

    window.location.href = buildMailtoLink(subject, body);
    setFormOpen(false);
  };

  return (
    <main className="public-page">
      <div className="public-page__shell">
        <section className="public-page__hero">
          <div className="public-page__hero-card">
            <span className="public-page__eyebrow">Support</span>
            <h1 className="public-page__title">Поддержка</h1>
            <p className="public-page__lead">
              Если у вас появились вопросы или что-то работает не так, нажмите кнопку ниже. Форма
              связи откроется в отдельном окне поверх страницы.
            </p>

            <div className="public-page__actions">
              <button
                className="public-page__button public-page__button--primary"
                type="button"
                onClick={() => setFormOpen(true)}
              >
                Связаться
              </button>
              <a className="public-page__button public-page__button--secondary" href="/privacy">
                Политика конфиденциальности
              </a>
            </div>
          </div>

          <aside className="public-page__panel">
            <h2 className="public-page__panel-title">Когда писать</h2>
            <ul className="public-page__list">
              <li>
                <strong>Не удаётся войти</strong>
                Если есть проблемы с авторизацией, восстановлением пароля или доступом к аккаунту.
              </li>
              <li>
                <strong>Не работают функции</strong>
                Если не открываются цели, напоминания, челленджи, отчёты или платежи.
              </li>
              <li>
                <strong>Есть идея или отзыв</strong>
                Мы также принимаем предложения по улучшению приложения.
              </li>
            </ul>
          </aside>
        </section>

        <section className="public-page__content">
          <div className="public-page__section">
            <h2>Рекомендуемый формат обращения</h2>
            <ul className="public-page__bullets">
              <li>Кратко опишите, что произошло.</li>
              <li>Укажите, на каком экране или действии возникла проблема.</li>
              <li>Если возможно, приложите скриншот или видео.</li>
              <li>Напишите модель устройства и версию iOS или Android.</li>
            </ul>
          </div>

          <div className="public-page__section">
            <h2>Ссылки</h2>
            <p>
              Маркетинговая страница приложения:{" "}
              <a className="public-page__link" href="/app">
                /app
              </a>
              .
            </p>
            <p>
              Политика конфиденциальности:{" "}
              <a className="public-page__link" href="/privacy">
                /privacy
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      {formOpen ? (
        <div className="public-page__modal" role="dialog" aria-modal="true" aria-labelledby="support-modal-title">
          <button
            className="public-page__modal-backdrop"
            type="button"
            aria-label="Закрыть форму связи"
            onClick={() => setFormOpen(false)}
          />

          <div className="public-page__modal-card">
            <div className="public-page__modal-header">
              <div>
                <h2 id="support-modal-title">Связаться</h2>
                <p>Заполните форму, и мы подготовим письмо на адрес поддержки.</p>
              </div>

              <button
                className="public-page__modal-close"
                type="button"
                aria-label="Закрыть"
                onClick={() => setFormOpen(false)}
              >
                ×
              </button>
            </div>

            <form className="public-page__contact-form" onSubmit={handleSubmit}>
              <div className="public-page__field">
                <label htmlFor="support-name">Имя</label>
                <input
                  id="support-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Как к вам обращаться"
                />
              </div>

              <div className="public-page__field">
                <label htmlFor="support-email">Email</label>
                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="public-page__field">
                <label htmlFor="support-message">Сообщение</label>
                <textarea
                  id="support-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Опишите вопрос или проблему"
                  required
                />
              </div>

              <div className="public-page__actions">
                <button className="public-page__button public-page__button--primary" type="submit">
                  Отправить
                </button>
              </div>

              <p className="public-page__form-note">Письмо будет подготовлено для отправки на {supportEmail}.</p>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
