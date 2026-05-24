import { useState } from "react";

import "./public-pages.css";

const featureCards = [
  {
    title: "ИИ-помощник для целей",
    description:
      "Опишите цель, привычку или личный челлендж, а приложение поможет превратить идею в понятный план.",
  },
  {
    title: "Задачи и напоминания",
    description:
      "Разбивайте цель на действия, назначайте регулярные напоминания и не теряйте темп.",
  },
  {
    title: "Прогресс, XP и награды",
    description:
      "Следите за сериями выполнения, получайте опыт и собирайте награды за движение вперёд.",
  },
];

const proofPoints = [
  "Сформулируйте цель или привычку, которую хотите закрепить.",
  "Получите структуру из задач, напоминаний и следующих шагов.",
  "Отмечайте выполнение, собирайте XP и держите темп каждый день.",
];

const screenshots = [
  {
    src: "/screen-1.PNG",
    alt: "Экран постановки целей в приложении Divergent",
  },
  {
    src: "/screen-2.PNG",
    alt: "Экран списка целей и задач в приложении Divergent",
  },
  {
    src: "/screen-3.PNG",
    alt: "Экран прогресса и наград в приложении Divergent",
  },
];

const heroTags = ["ИИ помогает начать", "Напоминания без хаоса", "Прогресс видно сразу"];

export default function MarketingView() {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentScreenshot = screenshots[activeSlide];

  const goToPrev = () => {
    setActiveSlide((current) => (current === 0 ? screenshots.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveSlide((current) => (current === screenshots.length - 1 ? 0 : current + 1));
  };

  return (
    <main className="public-page">
      <div className="public-page__shell">
        <section className="public-page__hero public-page__hero--single">
          <div className="public-page__hero-card public-page__hero-card--centered">
            <span className="public-page__eyebrow">Divergent</span>
            <h1 className="public-page__title">Цели и привычки с ИИ</h1>
            <p className="public-page__lead public-page__lead--wide">
              Divergent помогает превратить намерение в систему действий: сформулировать цель,
              разбить её на задачи, настроить напоминания и видеть реальный прогресс каждый день.
            </p>

            <div className="public-page__actions public-page__actions--centered">
              <a className="public-page__button public-page__button--primary" href="/signup">
                Начать
              </a>
            </div>

            <ul className="public-page__hero-tags">
              {heroTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="public-page__showcase">
          <div className="public-page__panel public-page__slider-section">
            <div className="public-page__slider">
              <div className="public-page__slider-header">
                <div>
                  <p className="public-page__slider-caption">Путь от идеи до прогресса</p>
                </div>
                <span className="public-page__slider-counter">
                  {activeSlide + 1} / {screenshots.length}
                </span>
              </div>

              <div className="public-page__slider-frame">
                <img
                  className="public-page__slider-image"
                  src={currentScreenshot.src}
                  alt={currentScreenshot.alt}
                />
              </div>

              <div className="public-page__slider-controls">
                <button
                  className="public-page__button public-page__button--secondary public-page__slider-button"
                  type="button"
                  onClick={goToPrev}
                  aria-label="Предыдущий скриншот"
                >
                  Назад
                </button>
                <button
                  className="public-page__button public-page__button--secondary public-page__slider-button"
                  type="button"
                  onClick={goToNext}
                  aria-label="Следующий скриншот"
                >
                  Далее
                </button>
              </div>

              <div className="public-page__slider-dots" aria-label="Выбор скриншота">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={screenshot.src}
                    className={
                      index === activeSlide
                        ? "public-page__slider-dot public-page__slider-dot--active"
                        : "public-page__slider-dot"
                    }
                    type="button"
                    aria-label={`Открыть скриншот ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="public-page__feature-stack">
            {featureCards.map((card) => (
              <article key={card.title} className="public-page__card public-page__card--feature">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-page__content public-page__content--split">
          <div className="public-page__section">
            <h2>Как это работает</h2>
            <ul className="public-page__bullets public-page__bullets--spacious">
              {proofPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="public-page__section public-page__section--compact">
            <h2>Для кого подходит</h2>
            <p>
              Для людей, которым важно не только ставить цели, но и регулярно доводить их до
              результата: в саморазвитии, спорте, обучении, работе и повседневных привычках.
            </p>
            <p>
              Поддержка доступна на странице{" "}
              <a className="public-page__link" href="/support">
                Support
              </a>
              . Политика конфиденциальности опубликована на странице{" "}
              <a className="public-page__link" href="/privacy">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
