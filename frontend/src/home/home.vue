<template>
  <div class="home">
    <Navbar />

    <!-- ===== HERO ===== -->
    <section class="hero">
        <video
      ref="videoRef"
      class="hero__video"
      autoplay
      muted
      playsinline
      preload="auto"
    >
      <source
        :src="heroVideos[currentVideo]"
        type="video/mp4"
      />
    </video>

    <div class="hero__overlay"></div>

      <div class="hero__bg-grid"></div>

      <div class="hero__sparks">
        <span
          v-for="i in 18"
          :key="i"
          class="spark"
          :style="sparkStyle(i)"
        ></span>
      </div>

      <div class="hero__content">
        <p class="hero__eyebrow">🇯🇵 AUTHENTIC JAPANESE STREET FOOD</p>

        <h1 class="hero__title">
          <span class="hero__title-line1">SUSHI</span>
          <span class="hero__title-line2">THAT</span>
          <span class="hero__title-line3">KICKS</span>
        </h1>

        <p class="hero__sub">
          Bold flavors. Fearless rolls. <br />
          Crafted for those who dare to eat dangerously.
        </p>

        <div class="hero__actions">
          <a href="/menu" class="btn-primary">🥢 Explore Menu</a>
          <a href="/order" class="btn-secondary">Order Online →</a>
        </div>

        <div class="hero__badges">
          <span class="badge">⚡ Fast Delivery</span>
          <span class="badge">🔥 Daily Specials</span>
          <span class="badge">⭐ 4.9 Rating</span>
        </div>
      </div>

      <div class="hero__mascot-wrap">
        <div class="hero__mascot-glow"></div>
        <img :src="logoImg" class="LogoHero" alt="Sushi Kick" />
      </div>

      <div class="hero__scroll-hint">
        <span>SCROLL</span>
        <div class="scroll-line"></div>
      </div>
    </section>

<div class="marquee-wrapper">
  <div class="marquee-track">

    <div v-for="i in 3" :key="i" class="marquee-group">

      <div class="food-card nigiri">
        <div class="overlay"></div>
        <span class="food-name">NIGIRI</span>
      </div>

      <div class="food-card temaki">
        <div class="overlay"></div>
        <span class="food-name">TEMAKI</span>
      </div>

      <div class="food-card bento">
        <div class="overlay"></div>
        <span class="food-name">BENTO</span>
      </div>

      <div class="food-card edomae">
        <div class="overlay"></div>
        <span class="food-name">EDOMAE</span>
      </div>

      <div class="food-card gyoza">
        <div class="overlay"></div>
        <span class="food-name">GYOZA</span>
      </div>

      <div class="food-card ramen">
        <div class="overlay"></div>
        <span class="food-name">RAMEN</span>
      </div>

    </div>

  </div>
</div>

<!-- ===== MENU ACCESS ===== -->
<section class="menu-access">
  <div class="menu-access__hd">
    <span class="section-tag">WEEKLY PICKS — 今週のおすすめ</span>
    <h2 class="section-title">El nostre <em>menú</em></h2>
    <p class="menu-access__sub">Escull l'experiència que vols viure avui</p>
  </div>
  <div class="menu-grid">
    <a href="/menu" class="menu-panel" style="--accent:#f07b10">
      <div class="menu-panel__bg" style="background-image:url('/images/menu-full.jpg')"></div>
      <div class="menu-panel__overlay"></div>
      <div class="menu-panel__accent"></div>
      <div class="menu-panel__count">01 / 02</div>
      <div class="menu-panel__body">
        <div class="menu-panel__tag">MENÚ COMPLET</div>
        <div class="menu-panel__title">Tot el menú</div>
        <p class="menu-panel__desc">Nigiri, temaki, bento, ramen i totes les categories en un sol lloc.</p>
        <span class="menu-panel__link">Explorar tot →</span>
      </div>
    </a>
    <a href="/menu/signature" class="menu-panel" style="--accent:#c8201a">
      <div class="menu-panel__bg" style="background-image:url('/images/signature.jpg')"></div>
      <div class="menu-panel__overlay"></div>
      <div class="menu-panel__accent"></div>
      <div class="menu-panel__count">02 / 02</div>
      <div class="menu-panel__body">
        <div class="menu-panel__tag" style="color:#c8201a;border-color:#c8201a">SIGNATURE ROLLS</div>
        <div class="menu-panel__title">Rolls icònics</div>
        <p class="menu-panel__desc">Els nostres rolls emblemàtics. Sabors intensos, ingredients premium.</p>
        <span class="menu-panel__link" style="color:#c8201a;border-color:#c8201a">Descobrir →</span>
      </div>
    </a>
  </div>
</section>


<!-- ===== CATEGORIES ===== -->
<section class="s-cats">
  <div class="cats-grid">
    <a href="/menu#nigiri" class="cat cat--wide">
      <div class="cat__bg" style="background-image:url('/images/nigiri.png')"></div>
      <div class="cat__overlay"></div>
      <div class="cat__arrow">→</div>
      <div class="cat__body">
        <div class="cat__name">Nigiri</div>
        <div class="cat__sub">Tradició pura · 12 varietats</div>
      </div>
    </a>
    <a href="/menu#temaki" class="cat">
      <div class="cat__bg" style="background-image:url('/images/temaki.jpeg')"></div>
      <div class="cat__overlay"></div>
      <div class="cat__arrow">→</div>
      <div class="cat__body">
        <div class="cat__name">Temaki</div>
        <div class="cat__sub">Hand rolls</div>
      </div>
    </a>
    <a href="/menu#ramen" class="cat">
      <div class="cat__bg" style="background-image:url('/images/ramen.jpg')"></div>
      <div class="cat__overlay"></div>
      <div class="cat__arrow">→</div>
      <div class="cat__body">
        <div class="cat__name">Ramen</div>
        <div class="cat__sub">Calent & ric</div>
      </div>
    </a>
    <a href="/menu#gyoza" class="cat">
      <div class="cat__bg" style="background-image:url('/images/gyoza.jpg')"></div>
      <div class="cat__overlay"></div>
      <div class="cat__arrow">→</div>
      <div class="cat__body">
        <div class="cat__name">Gyoza</div>
        <div class="cat__sub">Cruixent</div>
      </div>
    </a>
    <a href="/menu#bento" class="cat">
      <div class="cat__bg" style="background-image:url('/images/bento.jpg')"></div>
      <div class="cat__overlay"></div>
      <div class="cat__arrow">→</div>
      <div class="cat__body">
        <div class="cat__name">Bento</div>
        <div class="cat__sub">Complet</div>
      </div>
    </a>
    <a href="/specials" class="cat">
      <div class="cat__bg" style="background-image:url('/images/edomae.jpg')"></div>
      <div class="cat__overlay"></div>
      <div class="cat__arrow" style="color:var(--sk-gold)">★</div>
      <div class="cat__body">
        <div class="cat__name" style="color:var(--sk-orange)">Especials</div>
        <div class="cat__sub">Avui · Temps limitat</div>
      </div>
    </a>
  </div>
</section>

    <!-- ===== WHY ===== -->
    <section class="why">
      <div class="why__deco-text">SUSHI</div>

      <div class="why__inner">
        <div class="why__text-col">
          <span class="section-tag">こだわり — OUR CRAFT</span>
          <h2 class="section-title">
            Why <em>Sushi Kick</em><br />
            hits different
          </h2>

          <p class="why__lead">
            We don't do boring. Every roll is engineered for maximum flavor impact,
            using fish sourced daily from Barcelona's Mercabarna and premium Japanese
            ingredients flown in twice a week.
          </p>

          <ul class="why__list">
            <li v-for="item in whyItems" :key="item.title">
              <span class="why__icon">{{ item.icon }}</span>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="why__visual-col">
          <div class="why__stat-grid">
            <div class="stat-card" v-for="stat in stats" :key="stat.label">
              <span class="stat-card__num">{{ stat.num }}</span>
              <span class="stat-card__label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== AUTH ===== -->
<section class="s-auth">
  <div class="s-auth__hd">
    <span class="section-tag">メンバー — MEMBRE</span>
    <h2 class="section-title">JOIN <em>US</em></h2>
  </div>
  <div class="auth-wrap">
    <div class="auth-shell">
      <div class="auth-tabs">
        <div class="auth-tab" :class="{ active: authTab === 'login' }" @click="authTab = 'login'">INICIAR SESSIÓ</div>
        <div class="auth-tab" :class="{ active: authTab === 'register' }" @click="authTab = 'register'">CREAR COMPTE</div>
      </div>
      <Transition name="auth-slide" mode="out-in">
        <div v-if="authTab === 'login'" key="login" class="auth-panel">
          <label class="f-label">Correu electrònic</label>
          <input class="f-inp" type="email" placeholder="tu@exemple.com" v-model="loginEmail" />
          <label class="f-label">Contrasenya</label>
          <input class="f-inp" type="password" placeholder="••••••••" v-model="loginPass" />
          <button class="btn-submit">Entrar</button>
          <div class="auth-or">O CONTINUA AMB</div>
          <div class="social-grid">
            <button class="btn-social">G&nbsp; Google</button>
            <button class="btn-social">Instagram</button>
          </div>
          <p class="auth-foot">No tens compte? <span @click="authTab = 'register'">Registra't gratis</span></p>
        </div>
        <div v-else key="register" class="auth-panel">
          <div class="perks">
            <span class="perk">⚡ Comandes ràpides</span>
            <span class="perk">★ Punts fidelitat</span>
            <span class="perk">Accés a exclusius</span>
          </div>
          <div class="f-row">
            <div><label class="f-label">Nom</label><input class="f-inp" type="text" placeholder="Nom" /></div>
            <div><label class="f-label">Cognoms</label><input class="f-inp" type="text" placeholder="Cognoms" /></div>
          </div>
          <label class="f-label">Correu electrònic</label>
          <input class="f-inp" type="email" placeholder="tu@exemple.com" />
          <label class="f-label">Contrasenya</label>
          <input class="f-inp" type="password" placeholder="Mínim 8 caràcters" />
          <button class="btn-submit">Crear compte</button>
          <div class="auth-or">O CONTINUA AMB</div>
          <div class="social-grid">
            <button class="btn-social">G&nbsp; Google</button>
            <button class="btn-social">Instagram</button>
          </div>
          <p class="auth-foot">Ja tens compte? <span @click="authTab = 'login'">Inicia sessió</span></p>
        </div>
      </Transition>
    </div>
  </div>
</section>

    <!-- ===== CTA ===== -->
    <section class="cta-band">
      <div class="cta-band__bg"></div>

      <div class="cta-band__content">
        <h2>Ready to<br /><em>kick it?</em></h2>
        <p>Order online or reserve your table tonight.</p>

        <div class="cta-band__actions">
          <a href="/order" class="btn-primary">Order Now 🥢</a>
          <a href="/reservations" class="btn-ghost">Reserve a Table</a>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <img :src="logoImg" class="footer__logo" />
          <p>Bold sushi. <br />Barcelona born.</p>

          <div class="footer__socials">
            <a href="#">📸</a>
            <a href="#">🎵</a>
            <a href="#">💬</a>
          </div>
        </div>

        <div class="footer__col">
          <h4>Menu</h4>
          <a href="/menu">All Rolls</a>
          <a href="/menu#nigiri">Nigiri</a>
          <a href="/menu#temaki">Temaki</a>
          <a href="/menu#drinks">Drinks</a>
        </div>

        <div class="footer__col">
          <h4>Info</h4>
          <a href="/about">About Us</a>
          <a href="/specials">Specials</a>
          <a href="/reservations">Reservations</a>
          <a href="/contact">Contact</a>
        </div>

        <div class="footer__col">
          <h4>Hours</h4>
          <p>Mon–Thu: 13:00 – 23:00</p>
          <p>Fri–Sat: 12:00 – 00:00</p>
          <p>Sunday: 13:00 – 22:00</p>
          <a href="tel:+34930000000">📞 +34 93 000 0000</a>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© 2025 Sushi Kick — Barcelona</p>
        <p>Made with 🔥 and raw fish</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../components/navbar/Navbar.vue'
import './home.css'
import { ref } from 'vue'


import {
  rolls,
  whyItems,
  stats,
  logoImg,
  sparkStyle,
  useHeroVideo,
} from './home.js'

const {
  videoRef,
  currentVideo,
  heroVideos,
} = useHeroVideo()

const authTab = ref('login')
const loginEmail = ref('')
const loginPass = ref('')
</script>