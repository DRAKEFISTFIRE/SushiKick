<template>
  <div class="about-page">
    <Navbar />

    <!-- ===== HERO — full-bleed split ===== -->
    <section class="a-hero">
      <div class="a-hero__img-col">
        <div class="a-hero__img"></div>
        <div class="a-hero__img-overlay"></div>

        <!-- floating stat cards -->
        <div class="a-hero__stat a-hero__stat--1">
          <span class="a-hero__stat-num">4.9★</span>
          <span class="a-hero__stat-label">Google Rating</span>
        </div>
        <div class="a-hero__stat a-hero__stat--2">
          <span class="a-hero__stat-num">47</span>
          <span class="a-hero__stat-label">Signature Rolls</span>
        </div>
      </div>

      <div class="a-hero__text-col">
        <span class="a-hero__eyebrow">🇯🇵 Tokyo soul · Barcelona heart</span>

        <h1 class="a-hero__title">
          <span class="a-hero__t-dim">THIS IS</span>
          <span class="a-hero__t-fire">SUSHI</span>
          <span class="a-hero__t-fire">KICK</span>
        </h1>

        <p class="a-hero__sub">
          A rebellious Japanese street-food house born in the heat of El Raval.
          Loud flavors. Neon nights. Knife precision. Zero compromises.
        </p>

        <div class="a-hero__pills">
          <span class="a-hero__pill">Est. 2013</span>
          <span class="a-hero__pill">El Raval, Barcelona</span>
          <span class="a-hero__pill">12+ years</span>
        </div>

        <div class="a-hero__scroll">
          <div class="a-hero__scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </div>

      <!-- diagonal cut -->
      <div class="a-hero__cut" aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path d="M0,0 L1440,70 L1440,90 L0,90 Z" fill="var(--sk-black)" />
        </svg>
      </div>
    </section>

    <!-- ===== STATS STRIP ===== -->
    <div class="a-stats-strip">
      <div class="a-stats-strip__inner container">
        <div v-for="s in stats" :key="s.label" class="a-stats-strip__item">
          <span class="a-stats-strip__num">{{ s.num }}</span>
          <span class="a-stats-strip__label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- ===== STORY ===== -->
    <section class="a-story container-sm" id="story">

      <!-- Chapter 01 -->
      <div class="a-chapter fade-up">
        <div class="a-chapter__text">
          <div class="a-chapter__num" aria-hidden="true">01</div>
          <span class="section-tag">私たちの物語 — Our Story</span>
          <h2 class="section-title">More than sushi.<br /><em>A movement.</em></h2>
          <p>Sushi Kick started in a tiny alley near El Born with one mission: break the boring sushi rules.</p>
          <p>
            We mixed Tokyo street energy with Barcelona nightlife culture — creating a space where
            handcrafted nigiri meets bass-heavy playlists, neon lights, and fearless flavor combinations.
          </p>
          <p>
            Every roll is prepared fresh daily using premium fish, Japanese rice, house-made sauces,
            and ingredients sourced from local Catalan markets.
          </p>
        </div>
        <div class="a-chapter__media">
          <div class="a-chapter__img-main">
            <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=85" alt="Sushi platter" loading="lazy" />
          </div>
          <div class="a-chapter__img-pip">
            <img src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80" alt="Dragon Fire roll" loading="lazy" />
          </div>
          <div class="a-chapter__badge">
            <span class="a-chapter__badge-num">12+</span>
            <span class="a-chapter__badge-label">Years in Barcelona</span>
          </div>
        </div>
      </div>

      <!-- Chapter 02 -->
      <div class="a-chapter a-chapter--flip fade-up">
        <div class="a-chapter__text">
          <div class="a-chapter__num" aria-hidden="true">02</div>
          <span class="section-tag">哲学 — Philosophy</span>
          <h2 class="section-title">Fish from<br /><em>the source.</em></h2>
          <p>
            Every morning our team heads to Mercabarna before the city wakes. We choose the fish
            ourselves — by eye, by texture, by smell. If it's not perfect, it doesn't make it onto the rice.
          </p>
          <p>
            Twice a week, a shipment arrives from Tsukiji. Nori, soy, sake, premium Japanese rice
            varieties — the ingredients that make the difference between good sushi and unforgettable sushi.
          </p>
        </div>
        <div class="a-chapter__media">
          <div class="a-chapter__img-main">
            <img src="https://images.unsplash.com/photo-1539614474468-f423a2d2270c?w=900&q=85" alt="Chef at work" loading="lazy" />
          </div>
          <div class="a-chapter__badge a-chapter__badge--right">
            <span class="a-chapter__badge-num">98%</span>
            <span class="a-chapter__badge-label">Happy customers</span>
          </div>
        </div>
      </div>

    </section>

    <!-- ===== CHEF ===== -->
    <section class="a-chef" id="chef">
      <div class="a-chef__inner container-sm fade-up">

        <div class="a-chef__media">
          <div class="a-chef__img">
            <img src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=900&q=85" alt="Head Chef Kenji Mori" loading="lazy" />
          </div>
          <div class="a-chef__deco" aria-hidden="true">ITAMAE</div>
          <!-- small accent card -->
          <div class="a-chef__accent-card">
            <span class="a-chef__accent-icon">🔪</span>
            <span class="a-chef__accent-text">20 years of craft</span>
          </div>
        </div>

        <div class="a-chef__content">
          <span class="section-tag">料理人 — Our Itamae</span>
          <h2 class="a-chef__name">KENJI<br />MORI</h2>
          <p class="a-chef__role">Head Chef · Tokyo · Barcelona</p>

          <blockquote class="a-chef__quote">
            "A roll is not a recipe. It's a decision.
            Every ingredient chosen on purpose, nothing by accident."
          </blockquote>

          <p class="a-chef__bio">
            Kenji trained for 8 years in Tokyo under Jiro Ono's lineage before moving to
            Barcelona in 2013. He brought with him an obsession for rice temperature, knife
            angles, and sourcing.
          </p>
          <p class="a-chef__bio">
            At Sushi Kick he blends Japanese discipline with the creative chaos of Catalan
            culture — the result is a menu that surprises even the most experienced sushi eaters.
          </p>

          <div class="a-chef__tags">
            <span v-for="tag in chefTags" :key="tag" class="a-chef__tag">{{ tag }}</span>
          </div>
        </div>

      </div>
    </section>

   <section class="a-values container" id="values">
  <div class="a-values__hd">
    <span class="section-tag">こだわり — Our Values</span>

    <h2 class="section-title">
      Built on <em>obsession</em><br />
      &amp; fire
    </h2>
  </div>

  <div class="a-values__grid">
    <article
      v-for="v in values"
      :key="v.title"
      class="a-val-card fade-up"
      :style="`--accent:${v.accent}`"
    >

      <!-- IMAGE -->
      <div
        class="a-val-card__bg"
        :style="{ backgroundImage: `url(${v.image})` }"
      ></div>

      <!-- DARK OVERLAY -->
      <div class="a-val-card__overlay"></div>

      <!-- CONTENT -->
      <div class="a-val-card__content">

        <div class="a-val-card__num">
          {{ v.num }}
        </div>

        <div class="a-val-card__icon">
          {{ v.icon }}
        </div>

        <h3 class="a-val-card__title">
          {{ v.title }}
        </h3>

        <p class="a-val-card__desc">
          {{ v.desc }}
        </p>

      </div>
    </article>
  </div>
</section>

    <!-- ===== TIMELINE ===== -->
    <section class="a-timeline container-sm">
      <div class="a-timeline__hd">
        <span class="section-tag">歴史 — Milestones</span>
        <h2 class="section-title">The <em>journey</em></h2>
      </div>

      <div class="a-timeline__track">
        <div class="a-timeline__spine" aria-hidden="true"></div>

        <div
          v-for="(item, index) in timeline"
          :key="item.year"
          class="a-tl-item"
          :style="`transition-delay: ${index * 0.11}s`"
          :ref="(el) => setTimelineRef(el, index)"
        >
          <div class="a-tl-item__dot" aria-hidden="true"></div>
          <div class="a-tl-item__year">{{ item.year }}</div>
          <div class="a-tl-item__title">{{ item.title }}</div>
          <p class="a-tl-item__desc">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== LOCATION ===== -->
    <section class="a-location container" id="location">
      <div class="a-location__hd">
        <span class="section-tag">店舗情報 — Find Us</span>
        <h2 class="section-title">Right in the<br /><em>heart of Raval</em></h2>
      </div>

      <div class="a-location__card fade-up">

        <!-- Info panel -->
        <div class="a-location__info">
          <h3 class="a-location__card-title">Sushi Kick<br /><em>Barcelona</em></h3>

          <div class="a-location__rows">

            <div v-for="d in locationDetails" :key="d.label" class="a-location__row">
              <div class="a-location__row-icon">{{ d.icon }}</div>
              <div>
                <strong>{{ d.label }}</strong>
                <component
                  :is="d.href ? 'a' : 'p'"
                  :href="d.href ?? undefined"
                  v-html="d.content"
                />
              </div>
            </div>

            <div class="a-location__row">
              <div class="a-location__row-icon">🕒</div>
              <div>
                <strong>Hours</strong>
                <div class="a-location__hours">
                  <div v-for="row in hours" :key="row.days" class="a-location__hour-row">
                    <span>{{ row.days }}</span>
                    <span>{{ row.time }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="a-location__cta">
            <a
              href="https://maps.google.com/?q=El+Raval+Barcelona"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary btn--sm"
            >Get Directions 📍</a>
            <a href="tel:+34937771337" class="btn-ghost btn--sm">Call Us</a>
          </div>
        </div>

        <!-- Map panel -->
        <div class="a-location__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7929038875453!2d2.166862!3d41.380895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f9b5b4e5e1%3A0x2b7a9b43a8c1f4a0!2sEl%20Raval%2C%20Barcelona!5e0!3m2!1sen!2ses!4v1700000000000!5m2!1sen!2ses"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Sushi Kick — El Raval, Barcelona"
          ></iframe>
          <div class="a-location__map-overlay"></div>
          <div class="a-location__pin" aria-hidden="true">
            <div class="a-location__pin-dot"></div>
            <span>SUSHI KICK · EL RAVAL</span>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="a-cta container-sm">
      <div class="a-cta__bg"></div>
      <div class="a-cta__content">
        <h2>Ready to taste<br /><em>the kick?</em></h2>
        <p>Reserve your table or order online tonight. Delivered across Barcelona in under 30 minutes.</p>
        <div class="a-cta__actions">
          <a href="/menu" class="btn-primary">Explore Menu 🥢</a>
          <a href="tel:+34937771337" class="btn-ghost">Reserve a Table</a>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer__inner container">
        <div class="footer__brand">
          <div class="footer__brand-name">SUSHI <span>KICK</span></div>
          <p>Bold sushi.<br />Barcelona born.</p>
          <div class="footer__socials">
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="TikTok">🎵</a>
            <a href="#" aria-label="WhatsApp">💬</a>
          </div>
        </div>
        <div class="footer__col">
          <h4>Menu</h4>
          <a href="/menu">All Rolls</a>
          <a href="/menu">Nigiri</a>
          <a href="/menu">Temaki</a>
          <a href="/menu">Drinks</a>
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
          <p>Fri–Sat: 12:00 – 00:30</p>
          <p>Sunday: 13:00 – 22:00</p>
          <a href="tel:+34937771337">📞 +34 93 777 13 37</a>
        </div>
      </div>
      <div class="footer__bottom container">
        <p>© 2025 Sushi Kick — Barcelona</p>
        <p>Made with 🔥 and raw fish</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import Navbar from '../components/navbar/Navbar.vue'
import './about.css'
import {
  chefTags,
  values,
  timeline,
  locationDetails,
  hours,
  stats,
  useAboutPage,
} from './about.js'

// Per-instance composable — owns its own refs and observers.
const { setTimelineRef } = useAboutPage()
</script>