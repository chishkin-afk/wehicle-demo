import s from "./page-loading.module.scss";

export function PageLoading() {
  return (
    <div className={s.loading} role='status' aria-live='polite'>
      <span className={s.spinner} aria-hidden='true' />
      <p>Загружаем страницу…</p>
    </div>
  );
}
