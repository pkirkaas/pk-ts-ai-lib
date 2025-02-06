[[nextssr]]

I have created a nestjs SSR project.

I have created a very basic menu/navbar component and import it into my nextjs `layout.tsx` file, which works fine.

However, I would like the Navbar item to indicate whether the page is currently active.

I can do that easily by using the `"use client"` directive, making the component a client component, and then using the `usePathname` hook to get the current pathname, but that causes a page reload and flicker in the browser.

Is it possible to indicate the active state of the Navbar item in a Server Side Rendered component without causing a page reload?

