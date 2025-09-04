<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/" class="logo-link">
            <span class="logo-text">Resume Builder</span>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">Home</router-link>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Templates</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Examples</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Help</a>
            </li>
          </ul>
        </nav>
        
        <div class="actions">
          <button class="btn btn-primary">Download PDF</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
};
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary);
  font-weight: 700;
  font-size: 1.5rem;
}

.main-nav {
  margin-left: 2rem;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0 0.5rem;
}

.nav-link {
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: color 0.2s, background-color 0.2s;
}

.nav-link:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

.nav-link.active {
  color: var(--primary);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
</style>
