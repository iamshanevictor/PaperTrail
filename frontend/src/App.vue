<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="container">
        <h1>PaperTrail</h1>
        <p class="text-muted">Build your perfect resume</p>
      </div>
    </header>
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2023 PaperTrail. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --primary-light: #e0e7ff;
  --secondary: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --light: #f9fafb;
  --dark: #111827;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  min-height: 100vh;
  color: var(--gray-900);
  background: var(--light);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.text-muted {
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--gray-600);
  border-top: 1px solid var(--gray-200);
}
</style>
