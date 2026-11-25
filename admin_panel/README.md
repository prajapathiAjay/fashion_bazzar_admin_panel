# Fashion Bazar: Admin Panel

The back office for Fashion Bazar. Admins manage products, categories, orders, coupons, delivery rates and reviews, and view customers.

Built with **Next.js 16 (App Router)**, **React 19**, **Redux Toolkit / RTK Query** for API calls and **Tailwind CSS 4**.

> This is one of three projects. It needs the **backend** (`fashion_bazar_backend/backend`) running to work. Changes made here appear on the **shop website** (`fashion_bazar/fashion_bazar`).

---

## Getting started

### 1. Requirements
- Node.js 20 or newer
- The backend running on `http://localhost:3200` (see its folder)
- An **admin account** (see below)

### 2. Install
```bash
npm install
```

### 3. Environment
Create a `.env.local` file in this folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:3200/api
```

| Key | What it is |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. Every request is sent to this address. |

### 4. Run
```bash
npm run dev
```
Open **http://localhost:3000**. You'll be sent to `/login`.

> Keep the port as **3000**. The backend only accepts browser requests from `localhost:3000` (this panel) and `localhost:5173` (the shop website). Another port will be blocked by CORS.

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## Creating an admin account

There is no sign-up page for admins, on purpose. To make one:

1. Sign up normally on the **shop website** (`http://localhost:5173/register`).
2. In MongoDB (Atlas or Compass), open the `users` collection, find that user and change `type` from `"user"` to `"admin"`.
3. Log in to this panel with the same email and password.

Only users with `type: "admin"` can log in here, and every `/api/admin/...` route on the backend checks this too.

---

## Sections

| Path | Section | Data |
|---|---|---|
| `/dashboard` | Sales overview, recent orders, low stock | ⚠️ **Sample data** |
| `/analytics` | Traffic, conversion, cohorts, top searches | ⚠️ **Sample data** |
| `/products` | List, add, edit, delete products (with image upload) | Live |
| `/category` | List, add, edit, delete categories | Live |
| `/orders` | All orders, details, change status | Live |
| `/discounts` | Coupon codes: create, edit, delete | Live |
| `/shipping` | Delivery options and prices used at checkout | Live |
| `/customers` | Shoppers with order count and total spent (view only) | Live |
| `/reviews` | Hide, reply to, or delete reviews | Live |
| `/faq` | FAQ editor | ⚠️ **Sample data, not saved** |
| `/settings` | Store settings | ⚠️ **Not saved** (no backend yet) |

### Order statuses
`Ordered → Packed → Shipped → Delivered`, or `Cancelled`. Changing the status here updates the order the shopper sees in their account.

### Image uploads
Product images go to **Cloudinary** through the backend (`/api/upload`, admins only). The backend holds the Cloudinary keys; this panel only sends the files.

---

## Login and sessions

- `POST /users/admin/signin` returns a JWT, saved in Redux and `localStorage` (`lib/slice/authSlice.js`) and sent as `Authorization: Bearer <token>`.
- Admin logins last **1 day**.
- `app/(admin)/layout.jsx` guards every admin page: no token or an expired token means a redirect to `/login`. It also logs out automatically when the token's expiry time is reached.
- `lib/api/baseApi.js` logs out on any **401** response. A **403** ("logged in but not allowed") is shown as an error on the page instead.

---

## Folder structure

```
app/
├── (auth)/login/          Login page
├── (admin)/               Every page behind the admin login
│   ├── layout.jsx         Login guard + sidebar + navbar
│   ├── dashboard/  analytics/  products/  category/  orders/
│   ├── discounts/  shipping/   customers/ reviews/   faq/  settings/
│   └── <section>/new, [id], [id]/edit    Create / view / edit pages
components/
├── admin/                 Sidebar, navbar, table, pagination, actions menu
├── dashboard/ analytics/  Charts and cards
└── products/ category/ discounts/ shipping/ orders/ reviews/ faq/
                           Forms and helpers for each section
lib/
├── store.js               Redux store
├── slice/authSlice.js     The login token
├── tokenExpiry.js         Reads the expiry time out of the JWT
├── api/                   RTK Query endpoints, one file per backend feature
│   └── baseApi.js         Base URL, auth header, auto-logout on 401
└── data/                  Sample data for the dashboard and analytics
```

### Adding an API call
1. Open (or create) the file for that feature in `lib/api/`.
2. Add an endpoint with `baseApi.injectEndpoints`, following the others: `query` for reading, `mutation` for changing data, plus `providesTags` / `invalidatesTags` so lists refresh.
3. Export the generated hook and use it in the page. Pages that use hooks need `"use client"` at the top.

---

## Not finished yet

| Feature | State |
|---|---|
| Dashboard and Analytics | Built on sample data in `lib/data/`; need backend endpoints for real numbers |
| Settings | Form works on screen but nothing is saved |
| FAQ | Uses sample FAQs; nothing is saved |
| Contact messages and newsletter sign-ups | Saved by the backend, but there's no page here to view them yet |
