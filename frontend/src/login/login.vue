<template>
  <div class="auth-page">
    <div class="auth-layout">

      <!-- LEFT — Visual Panel -->
      <div class="auth-visual">
        <div class="auth-visual__img"></div>
        <div class="auth-visual__overlay"></div>
        <div class="auth-visual__grid" aria-hidden="true"></div>

        <div class="auth-visual__content">
          <div class="auth-visual__logo">
            🍣 SUSHI <span>KICK</span>
          </div>

          <blockquote class="auth-visual__quote">
            "Every roll is a decision.<br />
            Make it count."
          </blockquote>

          <div class="auth-visual__stats">
            <div
              v-for="s in visualStats"
              :key="s.label"
              class="auth-visual__stat"
            >
              <span class="auth-visual__stat-num">{{ s.num }}</span>
              <span class="auth-visual__stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <div class="auth-visual__strip">
          <div class="auth-visual__strip-dot"></div>
          <span>27 Red Dragon Street · El Raval · Barcelona</span>
        </div>
      </div>

      <!-- RIGHT — Form Panel -->
      <div class="auth-form-col">
        <div class="auth-form-wrap">

          <p class="auth-eyebrow">メンバー — MEMBER</p>

          <!-- Tabs -->
          <div class="auth-tabs" role="tablist">

            <button
              role="tab"
              class="auth-tab"
              :class="{ active: tab === 'login' }"
              :aria-selected="tab === 'login'"
              @click="tab = 'login'"
            >
              Login
            </button>

            <button
              role="tab"
              class="auth-tab"
              :class="{ active: tab === 'register' }"
              :aria-selected="tab === 'register'"
              @click="tab = 'register'"
            >
              Register
            </button>

            <div
              class="auth-tabs__indicator"
              :style="tab === 'register'
                ? 'transform:translateX(100%)'
                : ''"
              aria-hidden="true"
            ></div>

          </div>

          <Transition name="form-slide" mode="out-in">

            <!-- LOGIN -->
            <div
              v-if="tab === 'login'"
              key="login"
              class="auth-panel"
            >

              <h1 class="auth-heading">
                Welcome<br />
                <em>back.</em>
              </h1>

              <p class="auth-sub">
                Access your account to manage orders and reservations.
              </p>

              <div class="auth-fields">

                <!-- Email -->
                <div class="f-group">

                  <label
                    class="f-label"
                    for="login-email"
                  >
                    Email Address
                  </label>

                  <div
                    class="f-input-wrap"
                    :class="{
                      'has-error': loginVisible.email,
                      'is-valid': loginTouched.email && !loginErrors.email
                    }"
                  >
                    <span class="f-icon" aria-hidden="true">✉</span>

                    <input
                      id="login-email"
                      class="f-input"
                      type="email"
                      placeholder="you@example.com"
                      v-model="login.email"
                      autocomplete="email"
                      @blur="touchLogin('email')"
                    />

                    <span
                      v-if="loginTouched.email && !loginErrors.email"
                      class="f-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>

                  <Transition name="err">
                    <p
                      v-if="loginVisible.email"
                      class="f-error"
                      role="alert"
                    >
                      {{ loginErrors.email }}
                    </p>
                  </Transition>

                </div>

                <!-- Password -->
                <div class="f-group">

                  <div class="f-label-row">

                    <label
                      class="f-label"
                      for="login-pass"
                    >
                      Password
                    </label>

                    <a
                      href="/forgot"
                      class="f-forgot"
                    >
                      Forgot your password?
                    </a>

                  </div>

                  <div
                    class="f-input-wrap"
                    :class="{
                      'has-error': loginVisible.password,
                      'is-valid': loginTouched.password && !loginErrors.password
                    }"
                  >
                    <span class="f-icon" aria-hidden="true">🔒</span>

                    <input
                      id="login-pass"
                      class="f-input"
                      :type="showPass ? 'text' : 'password'"
                      placeholder="••••••••"
                      v-model="login.password"
                      autocomplete="current-password"
                      @blur="touchLogin('password')"
                    />

                    <button
                      type="button"
                      class="f-toggle-pass"
                      :aria-label="showPass ? 'Hide' : 'Show'"
                      @click="showPass = !showPass"
                    >
                      {{ showPass ? '🙈' : '👁' }}
                    </button>

                  </div>

                  <Transition name="err">
                    <p
                      v-if="loginVisible.password"
                      class="f-error"
                      role="alert"
                    >
                      {{ loginErrors.password }}
                    </p>
                  </Transition>

                </div>

              </div>

              <button
                class="auth-btn-submit"
                @click="handleLogin"
              >
                <span>Login</span>
                <span
                  class="auth-btn-submit__arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>

              <div class="auth-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              <div class="auth-socials">

                <button
                  class="auth-social-btn"
                  type="button"
                >
                  <GoogleIcon />
                  Google
                </button>

                <button
                  class="auth-social-btn"
                  type="button"
                >
                  <InstagramIcon />
                  Instagram
                </button>

              </div>

              <p class="auth-switch">
                Don’t have an account?

                <button
                  class="auth-switch__btn"
                  type="button"
                  @click="tab = 'register'"
                >
                  Create one for free →
                </button>
              </p>

            </div>

            <!-- REGISTER -->
            <div
              v-else
              key="register"
              class="auth-panel"
            >

              <h1 class="auth-heading">
                JOIN<br />
                <em>Us</em>
              </h1>

              <p class="auth-sub">
                Create your account and earn rewards with every order.
              </p>

              <div class="auth-perks">

                <div
                  v-for="p in perks"
                  :key="p.text"
                  class="auth-perk"
                >
                  <span
                    class="auth-perk__icon"
                    aria-hidden="true"
                  >
                    {{ p.icon }}
                  </span>

                  <span>{{ p.text }}</span>
                </div>

              </div>

              <div class="auth-fields">

                <!-- Name Row -->
                <div class="f-row">

                  <div class="f-group">

                    <label
                      class="f-label"
                      for="reg-name"
                    >
                      First Name
                    </label>

                    <div
                      class="f-input-wrap"
                      :class="{
                        'has-error': regVisible.name,
                        'is-valid': regTouched.name && !regErrors.name
                      }"
                    >
                      <input
                        id="reg-name"
                        class="f-input"
                        type="text"
                        placeholder="First Name"
                        v-model="reg.name"
                        autocomplete="given-name"
                        @blur="touchReg('name')"
                      />

                      <span
                        v-if="regTouched.name && !regErrors.name"
                        class="f-check"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    </div>

                    <Transition name="err">
                      <p
                        v-if="regVisible.name"
                        class="f-error"
                        role="alert"
                      >
                        {{ regErrors.name }}
                      </p>
                    </Transition>

                  </div>

                  <div class="f-group">

                    <label
                      class="f-label"
                      for="reg-surname"
                    >
                      Last Name
                    </label>

                    <div
                      class="f-input-wrap"
                      :class="{
                        'has-error': regVisible.surname,
                        'is-valid': regTouched.surname && !regErrors.surname
                      }"
                    >
                      <input
                        id="reg-surname"
                        class="f-input"
                        type="text"
                        placeholder="Last Name"
                        v-model="reg.surname"
                        autocomplete="family-name"
                        @blur="touchReg('surname')"
                      />

                      <span
                        v-if="regTouched.surname && !regErrors.surname"
                        class="f-check"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    </div>

                    <Transition name="err">
                      <p
                        v-if="regVisible.surname"
                        class="f-error"
                        role="alert"
                      >
                        {{ regErrors.surname }}
                      </p>
                    </Transition>

                  </div>

                </div>

                <!-- Email -->
                <div class="f-group">

                  <label
                    class="f-label"
                    for="reg-email"
                  >
                    Email Address
                  </label>

                  <div
                    class="f-input-wrap"
                    :class="{
                      'has-error': regVisible.email,
                      'is-valid': regTouched.email && !regErrors.email
                    }"
                  >
                    <span class="f-icon" aria-hidden="true">✉</span>

                    <input
                      id="reg-email"
                      class="f-input"
                      type="email"
                      placeholder="you@example.com"
                      v-model="reg.email"
                      autocomplete="email"
                      @blur="touchReg('email')"
                    />

                    <span
                      v-if="regTouched.email && !regErrors.email"
                      class="f-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>

                  <Transition name="err">
                    <p
                      v-if="regVisible.email"
                      class="f-error"
                      role="alert"
                    >
                      {{ regErrors.email }}
                    </p>
                  </Transition>

                </div>

                <!-- Password -->
                <div class="f-group">

                  <label
                    class="f-label"
                    for="reg-pass"
                  >
                    Password
                  </label>

                  <div
                    class="f-input-wrap"
                    :class="{
                      'has-error': regVisible.password,
                      'is-valid': regTouched.password && !regErrors.password
                    }"
                  >
                    <span class="f-icon" aria-hidden="true">🔒</span>

                    <input
                      id="reg-pass"
                      class="f-input"
                      :type="showRegPass ? 'text' : 'password'"
                      placeholder="Minimum 8 characters"
                      v-model="reg.password"
                      autocomplete="new-password"
                      @blur="touchReg('password')"
                    />

                    <button
                      type="button"
                      class="f-toggle-pass"
                      :aria-label="showRegPass ? 'Hide' : 'Show'"
                      @click="showRegPass = !showRegPass"
                    >
                      {{ showRegPass ? '🙈' : '👁' }}
                    </button>

                  </div>

                  <div
                    class="f-strength-wrap"
                    v-if="reg.password"
                  >
                    <div class="f-strength">
                      <div
                        class="f-strength__bar"
                        :style="`
                          width:${passwordStrength}%;
                          background:${strengthColor}
                        `"
                      ></div>
                    </div>

                    <span
                      class="f-strength-label"
                      :style="`color:${strengthColor}`"
                    >
                      {{ strengthLabel }}
                    </span>
                  </div>

                  <Transition name="err">
                    <p
                      v-if="regVisible.password"
                      class="f-error"
                      role="alert"
                    >
                      {{ regErrors.password }}
                    </p>
                  </Transition>

                </div>

              </div>

              <button
                class="auth-btn-submit"
                @click="handleRegister"
              >
                <span>Create Account</span>

                <span
                  class="auth-btn-submit__arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>

              <div class="auth-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              <div class="auth-socials">

                <button
                  class="auth-social-btn"
                  type="button"
                >
                  <GoogleIcon />
                  Google
                </button>

                <button
                  class="auth-social-btn"
                  type="button"
                >
                  <InstagramIcon />
                  Instagram
                </button>

              </div>

              <p class="auth-switch">
                Already have an account?

                <button
                  class="auth-switch__btn"
                  type="button"
                  @click="tab = 'login'"
                >
                  Login →
                </button>

                <p v-if="apiError" class="f-error">
                  {{ apiError }}
                </p>
              </p>

            </div>

          </Transition>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import './login.css'

import {
  GoogleIcon,
  InstagramIcon,
} from './icons.js'
import {
  visualStats,
  perks,
  useAuthForm,
} from './login.js'

const {
  tab,
  showPass,
  showRegPass,
  login,
  loginErrors,
  loginVisible,
  loginTouched,
  touchLogin,
  handleLogin,
  reg,
  regErrors,
  regVisible,
  regTouched,
  touchReg,
  handleRegister,
  passwordStrength,
  strengthColor,
  strengthLabel,
  apiError,
} = useAuthForm()
</script>