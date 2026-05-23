<template>
  <div class="about-page">
    <Navbar />

    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero__left">
        <p class="hero__eyebrow">🇯🇵 Tokyo soul · Barcelona heart</p>
        <h1 class="hero__title">
          <span>THIS IS</span>
          <span class="accent">SUSHI</span>
          <span class="accent">KICK</span>
        </h1>
        <p class="hero__sub">
          A rebellious Japanese street-food house born in the heat of El Raval.
          Loud flavors. Neon nights. Knife precision. Zero compromises.
        </p>
        <div class="hero__scroll">
          <div class="hero__scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </div>

      <div class="hero__right">
        <div class="hero__right-bg"></div>
        <div class="hero__right-overlay"></div>
        <div class="hero__year-badge">EST. 2013 · BARCELONA</div>
        <div class="hero__float-card">
          <div class="hero__float-card-num">47</div>
          <div class="hero__float-card-label">Signature rolls on the menu</div>
        </div>
      </div>

      <div class="hero__divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0 L1440,80 L1440,100 L0,100 Z" fill="#060402" />
        </svg>
      </div>
    </section>

    <!-- ===== STORY ===== -->
    <section class="story container-sm" id="story">

      <!-- Chapter 1 -->
      <div class="story__chapter fade-up">
        <div class="story__text-col">
          <div class="story__chapter-num">01</div>
          <span class="section-tag">私たちの物語 — Our Story</span>
          <h2 class="section-title">More than sushi.<br /><em>A movement.</em></h2>
          <div class="story__body">
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
        </div>
        <div class="story__img-col">
          <div class="story__img-main">
            <img
              src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=85"
              alt="Sushi platter"
              loading="lazy"
            />
          </div>
          <div class="story__img-secondary">
            <img
              src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80"
              alt="Dragon Fire Roll"
              loading="lazy"
            />
          </div>
          <div class="story__img-badge">
            <div class="story__img-badge-num">12+</div>
            <div class="story__img-badge-label">Years in Barcelona</div>
          </div>
        </div>
      </div>

      <!-- Chapter 2 -->
      <div class="story__chapter story__chapter--reverse fade-up">
        <div class="story__text-col">
          <div class="story__chapter-num">02</div>
          <span class="section-tag">哲学 — Philosophy</span>
          <h2 class="section-title">Fish from<br /><em>the source.</em></h2>
          <div class="story__body">
            <p>
              Every morning our team heads to Mercabarna before the city wakes. We choose the fish
              ourselves — by eye, by texture, by smell. If it's not perfect, it doesn't make it onto the rice.
            </p>
            <p>
              Twice a week, a shipment arrives from Tsukiji. Nori, soy, sake, premium Japanese rice
              varieties — the ingredients that make the difference between good sushi and unforgettable sushi.
            </p>
          </div>
        </div>
        <div class="story__img-col">
          <div class="story__img-main">
            <img
              src="https://images.unsplash.com/photo-1539614474468-f423a2d2270c?w=800&q=85"
              alt="Chef at work"
              loading="lazy"
            />
          </div>
          <div class="story__img-badge story__img-badge--right">
            <div class="story__img-badge-num">98%</div>
            <div class="story__img-badge-label">Happy customers</div>
          </div>
        </div>
      </div>

    </section>

    <!-- ===== CHEF SPOTLIGHT ===== -->
    <section class="chef container-sm" id="chef">
      <div class="chef__inner fade-up">
        <div class="chef__img-wrap">
          <div class="chef__img">
            <img
              src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=85"
              alt="Head Chef Kenji Mori"
              loading="lazy"
            />
          </div>
          <div class="chef__deco-text" aria-hidden="true">ITAMAE</div>
        </div>

        <div class="chef__content">
          <span class="section-tag">料理人 — Our Itamae</span>
          <h2 class="chef__name">KENJI<br />MORI</h2>
          <p class="chef__title">Head Chef · Tokyo · Barcelona</p>
          <blockquote class="chef__quote">
            "A roll is not a recipe. It's a decision. Every ingredient chosen on purpose, nothing by accident."
          </blockquote>
          <div class="chef__bio">
            <p>
              Kenji trained for 8 years in Tokyo under Jiro Ono's lineage before moving to Barcelona in 2013.
              He brought with him an obsession for rice temperature, knife angles, and sourcing.
            </p>
            <p>
              At Sushi Kick he blends that rigid Japanese discipline with the creative chaos of Catalan
              culture — the result is a menu that surprises even the most experienced sushi eaters.
            </p>
          </div>
          <div class="chef__tags">
            <span v-for="tag in chefTags" :key="tag" class="chef__tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== VALUES ===== -->
    <section class="values container" id="values">
      <div class="values__header">
        <span class="section-tag">こだわり — Our Values</span>
        <h2 class="section-title">Built on <em>obsession</em><br />&amp; fire</h2>
      </div>
      <div class="values__grid">
        <article
          v-for="value in values"
          :key="value.title"
          class="value-card fade-up"
          :style="`--card-accent: ${value.accent}`"
        >
          <div class="value-card__num">{{ value.num }}</div>
          <div class="value-card__icon">{{ value.icon }}</div>
          <h3>{{ value.title }}</h3>
          <p>{{ value.desc }}</p>
        </article>
      </div>
    </section>

    <!-- ===== TIMELINE ===== -->
    <section class="timeline container-sm">
      <div class="timeline__header">
        <span class="section-tag">歴史 — Milestones</span>
        <h2 class="section-title">The <em>journey</em></h2>
      </div>
      <div class="timeline__track">
        <div class="timeline__line"></div>
        <div
          v-for="(item, index) in timeline"
          :key="item.year"
          class="timeline__item"
          :style="`transition-delay: ${index * 0.12}s`"
            :ref="el => {
            if (el) timelineRefs.value?.push(el)
            }">
          <div class="timeline__dot"></div>
          <div class="timeline__year">{{ item.year }}</div>
          <div class="timeline__title">{{ item.title }}</div>
          <p class="timeline__desc">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== LOCATION + MAP ===== -->
    <section class="location container" id="location">
      <div class="location__header">
        <span class="section-tag">店舗情報 — Find Us</span>
        <h2 class="section-title">Right in the<br /><em>heart of Raval</em></h2>
      </div>

      <div class="location__card fade-up">
        <div class="location__info">
          <h3 class="location__info-title">Sushi Kick<br /><em>Barcelona</em></h3>

          <div class="location__details">
            <div v-for="detail in locationDetails" :key="detail.label" class="location__item">
              <div class="location__item-icon">{{ detail.icon }}</div>
              <div>
                <strong>{{ detail.label }}</strong>
                <component
                  :is="detail.href ? 'a' : 'div'"
                  :href="detail.href || undefined"
                  v-html="detail.content"
                />
              </div>
            </div>

            <!-- Hours sub-table -->
            <div class="location__item">
              <div class="location__item-icon">🕒</div>
              <div>
                <strong>Hours</strong>
                <div class="location__hours">
                  <div v-for="row in hours" :key="row.days" class="location__hour-row">
                    <span>{{ row.days }}</span>
                    <span>{{ row.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="location__cta">
            <a
              href="https://maps.google.com/?q=El+Raval+Barcelona"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary btn--sm"
            >
              Get Directions 📍
            </a>
            <a href="tel:+34937771337" class="btn-ghost btn--sm">Call Us</a>
          </div>
        </div>

        <div class="location__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7929038875453!2d2.166862!3d41.380895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f9b5b4e5e1%3A0x2b7a9b43a8c1f4a0!2sEl%20Raval%2C%20Barcelona!5e0!3m2!1sen!2ses!4v1700000000000!5m2!1sen!2ses"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Sushi Kick location in El Raval, Barcelona"
          ></iframe>
          <div class="location__map-overlay"></div>
          <div class="location__pin-label" aria-hidden="true">
            <div class="location__pin-dot"></div>
            <span class="location__pin-text">SUSHI KICK · EL RAVAL</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="cta-band container-sm">
      <div class="cta-band__bg"></div>
      <div class="cta-band__content">
        <h2>Ready to taste<br /><em>the kick?</em></h2>
        <p>Reserve your table or order online tonight. We deliver across Barcelona in under 30 minutes.</p>
        <div class="cta-band__actions">
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
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '../components/navbar/Navbar.vue'
import './about.css'
import {
  chefTags,
  values,
  timeline,
  locationDetails,
  hours,
  useAboutPage
} from './about.js'

const { timelineRefs } = useAboutPage()

</script>