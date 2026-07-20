import TransitionLink from './motion/TransitionLink';

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div>
          <TransitionLink className="logo" href="/">
            VULKA<span>N</span>O
          </TransitionLink>
          <p className="about-f" style={{ marginTop: 14 }}>
            Піцерія на дровах. Київ, вул. Вогняна 9. Щодня 11:00–23:00.
          </p>
        </div>
        <div>
          <h4>Меню</h4>
          <TransitionLink href="/menu">Всі позиції</TransitionLink>
          <TransitionLink href="/menu">Гострі</TransitionLink>
          <TransitionLink href="/menu">Комбо</TransitionLink>
        </div>
        <div>
          <h4>Контакти</h4>
          <a href="tel:+380441234567">+38 (044) 123 45 67</a>
          <TransitionLink href="/about">Про нас</TransitionLink>
          <TransitionLink href="/tracking">Трекер замовлення</TransitionLink>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="wrap">
          <span>© 2026 VULKANO. Демо-проєкт.</span>
          <span>Зроблено з вогнем</span>
        </div>
      </div>
    </footer>
  );
}
