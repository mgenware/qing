<template>
  <section class="section">
    <div class="container">
      <div class="columns is-variable is-7">
        <div class="column is-narrow">
          <aside class="menu">
            <p class="menu-label">{{$ls.common}}</p>
            <ul class="menu-list">
              <li>
                <router-link to="/m/new-post">{{$ls.newPost}}</router-link>
              </li>
            </ul>
            <p class="menu-label">{{$ls.settings}}</p>
            <ul class="menu-list">
              <li>
                <router-link to="/m/settings/profile">{{$ls.profile}}</router-link>
              </li>
            </ul>
          </aside>
        </div>
        <div class="column">
          <router-view/>
        </div>
      </div>
    </div>
  </section>
</template>
