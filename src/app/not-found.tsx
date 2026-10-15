import layout from "@/shared/styles/utility.module.scss";
import { LinkButton } from "@/shared/ui/controls";
export default function NotFound() {
  return (
    <main className={layout.errorPage}>
      <p className={layout.mutedCode}>404</p>
      <h1 className={layout.paragraphSpacing}>Такой страницы нет</h1>
      <p className={layout.marginBottom30}>
        Вернитесь на главную или откройте рабочее пространство.
      </p>
      <LinkButton href='/'>На главную</LinkButton>
    </main>
  );
}
