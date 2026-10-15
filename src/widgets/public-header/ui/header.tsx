import { LinkButton } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import Link from "@/shared/ui/link";
import s from "./header.module.scss";
export function PublicHeader() {
  return (
    <header className={s.header}>
      <Link href='/' className={s.logo}>
        wehicle<span>.</span>
      </Link>
      <nav aria-label='Навигация автосервиса'>
        <Link href='/#services'>Услуги</Link>
        <Link href='/#about'>О сервисе</Link>
        <Link href='/#contacts'>Контакты</Link>
      </nav>
      <div className={s.actions}>
        <Link href='/dashboard' className={s.demo}>
          CRM <Icon name='up' size={14} />
        </Link>
        <LinkButton href='/account' variant='secondary' icon='user'>
          Личный кабинет
        </LinkButton>
      </div>
    </header>
  );
}
