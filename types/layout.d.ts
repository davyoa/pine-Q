// types/layout.d.ts
import type { RouteMeta } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layoutProps?: {
      pageTitle?: string
      showSidebar?: boolean
    }
  }
}
