---
title: "Understanding Next.js SSR"
date: "2025-08-10"
author: "Michael Lee"
image: "https://media.licdn.com/dms/image/v2/D4D12AQELdJepiKKB3w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1680164749576?e=2147483647&v=beta&t=ykiSO_0ohDLrtEwVMpwG4l25KzKCKVYa29m79TkYHQ0"
excerpt: "An introduction to Server-Side Rendering (SSR) in Next.js and when to use it."
Category: "General"
---

# Understanding Next.js SSR

Server-Side Rendering (**SSR**) is one of Next.js’s superpowers.  

## What is SSR?
Instead of shipping a blank HTML shell, Next.js **renders the page on the server** before sending it to the browser.

```js
export async function getServerSideProps() {
  return { props: { message: "Hello SSR" } };
}
