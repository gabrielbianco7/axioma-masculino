import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>Sistema Editorial · Pipeline Multiagente</div>
      <h1 className={styles.title}>
        Axioma <em>Masculino</em>
      </h1>
      <p className={styles.tagline}>Honra · Disciplina · Força</p>
    </header>
  )
}
