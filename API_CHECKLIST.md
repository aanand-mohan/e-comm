# Postman API Checklist

This file contains a list of all API endpoints in the application. Use this to verify your backend in Postman.
**Base URL:** `http://localhost:5000` (or your configured port)

---

## 1. User APIs
**Base Path:** `/api/users`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user | No |
| **POST** | `/login` | Authenticate user & get token | No |
| **POST** | `/forgot-password` | Request password reset email | No |
| **PUT** | `/reset-password/:resetToken` | Reset password | No |
| **GET** | `/profile` | Get user profile | Yes |
| **PUT** | `/profile` | Update user profile | Yes |
| **POST** | `/developer-init` | Initialize developer account | Yes |
| **GET** | `/wishlist` | Get user wishlist | Yes |
| **POST** | `/wishlist` | Add item to wishlist | Yes |
| **DELETE** | `/wishlist/:id` | Remove item from wishlist | Yes |
| **GET** | `/` | Get all users | Yes (Admin) |
| **GET** | `/:id` | Get user by ID | Yes (Admin) |
| **PUT** | `/:id` | Update user | Yes (Admin) |
| **DELETE** | `/:id` | Delete user | Yes (Admin) |

---

## 2. Product APIs
**Base Path:** `/api/products`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | List all products | No |
| **GET** | `/:id` | Get single product details | No |
| **POST** | `/add` | Create new product (Multipart/Form-data) | Yes (Admin) |
| **PUT** | `/:id` | Update product (Multipart/Form-data) | Yes (Admin) |
| **DELETE** | `/:id` | Delete product | Yes (Admin) |

---

## 3. Cart APIs
**Base Path:** `/api/cart`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Get user's cart | Yes |
| **POST** | `/` | Add item to cart | Yes |
| **PUT** | `/:productId` | Update cart item quantity | Yes |
| **DELETE** | `/:productId` | Remove item from cart | Yes |

---

## 4. Checkout APIs
**Base Path:** `/api/checkout`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Process checkout (Create Order) | Yes |

---

## 5. Order APIs
**Base Path:** `/api/orders`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/myorders` | Get logged-in user's orders | Yes |
| **GET** | `/:id` | Get order details by ID | Yes |
| **GET** | `/user/:id` | Get orders of specific user | Yes (Admin) |

---

## 6. Payment APIs
**Base Path:** `/api/payment`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/create-checkout-session` | Create Stripe session | Yes |
| **POST** | `/verify` | Verify payment status | Yes |
| **POST** | `/webhook` | Stripe Webhook (Raw Body) | No |

---

## 7. Admin Order APIs
**Base Path:** `/api/admin/orders`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | List all orders | Yes (Admin) |
| **GET** | `/:id` | Get order details | Yes (Admin) |
| **DELETE** | `/:id` | Delete order | Yes (Admin) |
| **PUT** | `/:id/status` | Update order delivery status | Yes (Admin) |
| **PUT** | `/:id/payment` | Update payment status | Yes (Admin) |

---

## 8. Admin Stats APIs
**Base Path:** `/api/admin/summary`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Get dashboard statistics | Yes (Admin) |

---

## 9. Coupon APIs
**Base Path:** `/api/coupons`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/active` | Get active coupons | No |
| **POST** | `/apply` | Apply coupon to cart | No |
| **GET** | `/` | Get all coupons | Yes (Admin) |
| **POST** | `/` | Create new coupon | Yes (Admin) |
| **PUT** | `/:id` | Update coupon | Yes (Admin) |
| **DELETE** | `/:id` | Disable/Delete coupon | Yes (Admin) |

---

## 10. Category APIs
**Base Path:** `/api/categories`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | List all categories | No |
| **GET** | `/admin` | List categories for admin | Yes (Admin) |
| **POST** | `/` | Create category | Yes (Admin) |
| **PUT** | `/:id` | Update category | Yes (Admin) |
| **DELETE** | `/:id` | Delete category | Yes (Admin) |
| **POST** | `/:id/subcategories` | Add subcategory | Yes (Admin) |

---

## 11. Banner APIs
**Base Path:** `/api/banners`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Get banners (optional query: `position`) | No |
| **GET** | `/admin` | Get all banners | Yes (Admin) |
| **POST** | `/` | Create banner (Multipart, key: `image`) | Yes (Admin) |
| **PUT** | `/:id` | Update banner (Multipart, key: `image`) | Yes (Admin) |
| **DELETE** | `/:id` | Delete banner | Yes (Admin) |

---

## 12. Content APIs
**Base Path:** `/api/content`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Get content blocks | No |
| **GET** | `/admin` | Get all content | Yes (Admin) |
| **POST** | `/` | Create content block | Yes (Admin) |
| **POST** | `/seed` | Seed default content | Yes (Admin) |
| **PUT** | `/:identifier` | Update content block | Yes (Admin) |
