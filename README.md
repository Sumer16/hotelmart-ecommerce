# [HotelMart](https://hotelmart.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About HotelMart

This is a fully functional e-commerce website that allows users to login, add/delete products to/from cart, view products in detail, and process payment for products. It has been built using React, Next.js, React MUI, Sanity (Headless CMS), and Stripe (Payment API), and deployed on Vercel.

## Featues

- Server-rendered pages using [Next.js](https://nextjs.org)
- User authentication & Product management using [Sanity Headless CMS](https://sanity.io)
- Shopping cart functionality using React Context API
- Payment processing using [Stripe Payment API](https://stripe.com/)
- Dark mode available

## Installation

### Clone the repository
To get started, you'll need to clone this repository to your local machine. You can do this by running the following in the command line:

```bash 
git clone https://github.com/Sumer16/hotelmart-ecommerce.git 
```

### Install dependencies

Once you've cloned the repository, navigate to the project directory and run npm/yarn install to install all the necessary dependencies.

```bash
cd hotelmart-ecommerce

npm install
# or
yarn install
```

### Setup the environment variables

After the dependencies have been installed, In the root of the project, create a .env.local file and add your Stripe and Sanity credentials:

```bash
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=your_sanity_dataset
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Run the development server

After the dependencies have been installed, you can start the development server by running:

```bash
npm run dev
# or
yarn dev
```

This will start the server at `http://localhost:3000`, and you can view the website in your browser.

Open [`http://localhost:3000`](http://localhost:3000) with your browser to see the result.

## Build for production

```bash
npm run build
# or
yarn build
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```bash
npm install -g vercel
# or
yarn global add vercel

vercel
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Things to say

I hope you find this e-commerce website to be a solid starting point for building your own online store. If you have any questions or feedback, please feel free to open an issue in this repository. Happy shopping!
