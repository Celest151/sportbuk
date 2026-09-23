import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import { AccountPage } from '../pages/AccountPage'
import { AuthPage } from '../pages/AuthPage'
import { BagPage } from '../pages/BagPage'
import { CollectionPage, CollectionsPage } from '../pages/CollectionsPage'
import { ContactPage } from '../pages/ContactPage'
import { HomePage } from '../pages/HomePage'
import { JournalArticlePage, JournalPage } from '../pages/JournalPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProductPage } from '../pages/ProductPage'
import { ShopPage } from '../pages/ShopPage'
import { SizeGuidePage } from '../pages/SizeGuidePage'
import { WishlistPage } from '../pages/WishlistPage'
import { AdminLayout } from '../components/admin/AdminLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminCategoriesPage, AdminCollectionsPage, AdminProductsPage, AdminSizesPage } from '../pages/admin/AdminCatalogPages'
import { AdminAnalyticsPage, AdminChatsPage, AdminOrdersPage, AdminUsersPage } from '../pages/admin/AdminOperationsPages'

export function App() {
  return (
    <Routes>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="collections" element={<AdminCollectionsPage />} />
        <Route path="sizes" element={<AdminSizesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="chats" element={<AdminChatsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ShopPage />} />
        <Route path="products/:slug" element={<ProductPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:slug" element={<CollectionPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="journal/:slug" element={<JournalArticlePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="size-guide" element={<SizeGuidePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="bag" element={<BagPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
