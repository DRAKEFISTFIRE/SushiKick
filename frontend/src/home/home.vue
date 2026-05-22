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

    <!-- ===== MARQUEE ===== -->
    <div class="marquee-strip">
      <div class="marquee-track">
        <span v-for="i in 3" :key="i">
          <span class="m-item">🍣 NIGIRI</span>
          <span class="m-sep">✦</span>
          <span class="m-item">🌯 TEMAKI</span>
          <span class="m-sep">✦</span>
          <span class="m-item">🍱 BENTO</span>
          <span class="m-sep">✦</span>
          <span class="m-item">🦐 EDOMAE</span>
          <span class="m-sep">✦</span>
          <span class="m-item">🥟 GYOZA</span>
          <span class="m-sep">✦</span>
          <span class="m-item">🍜 RAMEN</span>
          <span class="m-sep">✦</span>
        </span>
      </div>
    </div>

    <!-- ===== FEATURED ===== -->
    <section class="featured">
      <div class="featured__header">
        <span class="section-tag">今週のおすすめ — WEEKLY PICKS</span>
        <h2 class="section-title">Signature <em>Rolls</em></h2>
        <p class="section-sub">Each roll is a battle cry. Find yours.</p>
      </div>

      <div class="featured__grid">
        <article
          v-for="roll in rolls"
          :key="roll.name"
          class="roll-card"
          :style="`--card-accent: ${roll.color}`"
        >
          <div class="roll-card__emoji-wrap">
            <span class="roll-card__emoji">{{ roll.emoji }}</span>
            <div class="roll-card__glow"></div>
          </div>

          <div class="roll-card__tag">{{ roll.tag }}</div>
          <h3 class="roll-card__name">{{ roll.name }}</h3>
          <p class="roll-card__desc">{{ roll.desc }}</p>

          <div class="roll-card__footer">
            <span class="roll-card__price">{{ roll.price }}</span>
            <button class="roll-card__btn">Add +</button>
          </div>

          <div class="roll-card__heat">
            <span
              v-for="n in 5"
              :key="n"
              class="heat-dot"
              :class="{ active: n <= roll.heat }"
            ></span>
          </div>
        </article>
      </div>

      <div class="featured__cta">
        <a href="/menu" class="btn-primary">View Full Menu</a>
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

</script>