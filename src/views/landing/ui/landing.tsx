"use client";
import Image from "next/image";
import Link from "@/shared/ui/link";
import { PublicHeader } from "@/widgets/public-header/ui/header";
import { useDemo } from "@/entities/workspace/model/provider";
import { Card, Button, LinkButton, Dialog } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import { money } from "@/shared/lib/format";
import { useState } from "react";
import s from "./landing.module.scss";
export default function Landing() {
  const { services } = useDemo();
  const [selected, setSelected] = useState("");
  const service = services.find(v => v.id === selected);
  return (
    <>
      <PublicHeader />
      <main className={`${s.main} page-enter`}>
        <section className={s.hero}>
          <div>
            <p className={s.open}>
              <span />
              Сегодня работаем до 19:00
            </p>
            <h1>
              Ваш автомобиль.
              <br />В хороших руках.
            </h1>
          </div>
          <div className={s.heroIntro}>
            <p>
              Сервис, в котором всё понятно.
              <br />
              Заботимся о вашем автомобиле,
              <br />а вы — о своих планах.
            </p>
            <LinkButton href='/book' icon='calendar'>
              Записаться в сервис
            </LinkButton>
          </div>
        </section>
        <section className={s.heroImage}>
          <Image
            src='/images/workshop.png'
            alt='Серебристый автомобиль в светлой мастерской Wehicle'
            fill
            loading='eager'
            fetchPriority='high'
            sizes='(max-width: 760px) 100vw, 1216px'
          />
          <div className={s.imageCaption}>
            <span className={s.captionIcon}>
              <Icon name='shield' size={23} />
            </span>
            <div>
              <strong>Внимание к каждой детали</strong>
              <span>Диагностика, обслуживание и ремонт</span>
            </div>
          </div>
          <span className={s.imageLabel}>Wehicle Service · Москва</span>
        </section>
        <div className={s.facts}>
          <div>
            <Icon name='shield' size={22} />
            <span>
              <strong>Гарантия на работы</strong>
              <small>12 месяцев спокойствия</small>
            </span>
          </div>
          <div>
            <Icon name='clock' size={22} />
            <span>
              <strong>Ваше время ценно</strong>
              <small>Запись без звонков и ожидания</small>
            </span>
          </div>
          <div>
            <Icon name='wrench' size={22} />
            <span>
              <strong>Мастера своего дела</strong>
              <small>Опыт, которому можно доверять</small>
            </span>
          </div>
        </div>
        <section id='services' className={s.section}>
          <div className={s.sectionHeading}>
            <div>
              <h2>
                Всё, что нужно
                <br />
                вашему автомобилю.
              </h2>
              <p>Стоимость работы известна до начала визита.</p>
            </div>
            <span>Выберите услугу и удобное время</span>
          </div>
          <div className={s.serviceGrid}>
            {services
              .filter(v => !v.archived)
              .map(v => (
                <Card key={v.id} className={s.service}>
                  <div className={s.serviceTop}>
                    <span className={s.serviceIcon}>
                      <Icon name={v.icon} size={26} />
                    </span>
                    <span>{v.duration} мин</span>
                  </div>
                  <button
                    className={s.serviceTitle}
                    onClick={() => setSelected(v.id)}
                  >
                    {v.name}
                  </button>
                  <p>{v.description}</p>
                  <div className={s.serviceBottom}>
                    <strong>{money(v.price)}</strong>
                    <Link
                      href={`/book?service=${v.id}`}
                      aria-label={`Записаться: ${v.name}`}
                    >
                      <Icon name='up' size={21} />
                    </Link>
                  </div>
                </Card>
              ))}
          </div>
        </section>
        <section className={s.about} id='about'>
          <div>
            <Icon name='garage' size={42} />
            <h2>
              Хороший сервис —<br />
              это просто.
            </h2>
            <p>
              Мы объясним, что нужно автомобилю, согласуем работы и позаботимся
              о результате. Без неожиданных услуг в счёте.
            </p>
            <LinkButton href='/book' variant='secondary'>
              Выбрать время
            </LinkButton>
          </div>
          <div className={s.process}>
            {[
              {
                title: "Запишитесь, когда удобно",
                text: "Выберите услугу, мастера и время. Это займёт всего пару минут.",
              },
              {
                title: "Доверьте автомобиль нам",
                text: "Мастер проведёт диагностику и согласует с вами план работ.",
              },
              {
                title: "Возвращайтесь к своим делам",
                text: "Сообщим о готовности и расскажем, что было сделано.",
              },
            ].map((p, i) => (
              <div key={p.title}>
                <span>{i + 1}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={s.faq}>
          <h2>Перед визитом</h2>
          <div>
            {[
              {
                q: "Можно приехать со своими расходниками?",
                a: "Да. Укажите это в комментарии к записи, чтобы мастер подготовился к визиту.",
              },
              {
                q: "Как перенести или отменить запись?",
                a: "Откройте личный кабинет, выберите запись и нажмите «Перенести» или «Отменить запись».",
              },
              {
                q: "Что входит в указанную стоимость?",
                a: "В каталоге указана стоимость работ. Материалы и дополнительные работы согласовываем отдельно до начала обслуживания.",
              },
            ].map(v => (
              <details key={v.q}>
                <summary>
                  {v.q}
                  <Icon name='plus' size={18} />
                </summary>
                <p>{v.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={s.contacts} id='contacts'>
          <div>
            <h2>
              Заезжайте.
              <br />
              Будем рады.
            </h2>
            <p>
              <Icon name='pin' size={18} /> Москва, ул. Автозаводская, 23
            </p>
            <p>
              <Icon name='clock' size={18} /> Пн–Сб: 09:00–19:00 · Вс: выходной
            </p>
          </div>
          <div>
            <Link href='tel:+74951234567'>+7 (495) 123-45-67</Link>
            <Link href='mailto:hello@wehicle.ru'>hello@wehicle.ru</Link>
            <LinkButton href='/book' icon='calendar'>
              Записаться в сервис
            </LinkButton>
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <Link href='/' className={s.footerLogo}>
          wehicle.
        </Link>
        <span>© 2026 Wehicle Service</span>
        <Link href='/dashboard'>
          Рабочее пространство <Icon name='up' size={13} />
        </Link>
      </footer>
      <Dialog
        open={!!service}
        onClose={() => setSelected("")}
        title={service?.name || ""}
      >
        {service && (
          <div className={s.serviceDialog}>
            <p>{service.description}</p>
            <strong>
              {money(service.price)} · {service.duration} мин
            </strong>
            <LinkButton href={`/book?service=${service.id}`}>
              Записаться на услугу
            </LinkButton>
          </div>
        )}
      </Dialog>
    </>
  );
}
